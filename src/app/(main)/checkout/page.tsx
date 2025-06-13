'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaShoppingCart, FaStore, FaTruck } from 'react-icons/fa';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { formatarMoeda } from '@/utils/formatters';
import BotaoPagamento from '@/components/BotaoPagamento';
import { PagamentoItem, DadosPagador } from '@/hooks/useMercadoPago';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    itens, 
    subtotal, 
    frete, 
    total, 
    embrulhoPresente,
    limparCarrinho 
  } = useCarrinho();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState('entrega');
  const [observacoes, setObservacoes] = useState('');
  const [concordaTermos, setConcordaTermos] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [cepPesquisando, setCepPesquisando] = useState(false);
  const [etapa, setEtapa] = useState<'dados' | 'pagamento'>('dados');

  useEffect(() => {
    // Redirecionar para o carrinho se estiver vazio
    if (itens.length === 0) {
      router.push('/carrinho');
      toast.error('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
    }
  }, [itens, router]);

  // Calcular frete de acordo com o método de entrega
  const valorFrete = metodoEntrega === 'retirada' ? 0 : frete;
  const valorEmbrulho = embrulhoPresente ? 10 : 0;
  const totalFinal = subtotal + valorFrete + valorEmbrulho;

  // Buscar endereço pelo CEP
  const buscarCep = async () => {
    if (cep.length !== 8) {
      toast.error('CEP inválido. Por favor, insira um CEP com 8 dígitos');
      return;
    }

    setCepPesquisando(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado');
      } else {
        setEndereco(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setEstado(data.uf);
        toast.success('Endereço preenchido automaticamente');
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP');
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setCepPesquisando(false);
    }
  };

  // Função para validar os campos do formulário
  const validarFormulario = () => {
    if (!nome || !email || !telefone) {
      toast.error('Por favor, preencha todos os campos pessoais');
      return false;
    }

    if (metodoEntrega === 'entrega') {
      if (!cep || !endereco || !numero || !bairro || !cidade || !estado) {
        toast.error('Por favor, preencha todos os campos de endereço');
        return false;
      }
    }

    if (!concordaTermos) {
      toast.error('Você precisa concordar com os termos e condições');
      return false;
    }

    return true;
  };

  // Prosseguir para pagamento
  const prosseguirParaPagamento = () => {
    if (!validarFormulario()) return;
    setEtapa('pagamento');
  };

  // Preparar dados para o Mercado Pago
  const prepararDadosPagamento = (): { items: PagamentoItem[], payer: DadosPagador, external_reference: string } => {
    // Preparar itens para o Mercado Pago
    const items: PagamentoItem[] = [
      // Produtos
      ...itens.map(item => ({
        id: item.produtoId,
        title: item.nome,
        description: `Produto artesanal - Qtd: ${item.quantidade}`,
        unit_price: item.preco,
        quantity: item.quantidade
      })),
      // Frete (se houver)
      ...(valorFrete > 0 ? [{
        id: 'frete',
        title: 'Frete',
        description: 'Taxa de entrega',
        unit_price: valorFrete,
        quantity: 1
      }] : []),
      // Embrulho (se houver)
      ...(valorEmbrulho > 0 ? [{
        id: 'embrulho',
        title: 'Embrulho para Presente',
        description: 'Embrulho especial para presente',
        unit_price: valorEmbrulho,
        quantity: 1
      }] : [])
    ];

    // Preparar dados do pagador
    const payer: DadosPagador = {
      name: nome.split(' ')[0],
      surname: nome.split(' ').slice(1).join(' '),
      email: email,
      phone: telefone ? {
        area_code: telefone.substring(0, 2),
        number: telefone.substring(2)
      } : undefined,
      address: metodoEntrega === 'entrega' ? {
        street_name: endereco,
        street_number: parseInt(numero),
        zip_code: cep
      } : undefined
    };

    // Referência externa
    const external_reference = `pedido_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return { items, payer, external_reference };
  };

  // Callback de sucesso do pagamento
  const onPagamentoSucesso = (preferenceData: any) => {
    console.log('Pagamento iniciado com sucesso:', preferenceData);
    
    // Salvar dados do pedido no localStorage para recuperar depois
    const dadosPedido = {
      cliente: { nome, email, telefone },
      endereco: metodoEntrega === 'entrega' ? {
        cep, endereco, numero, complemento, bairro, cidade, estado
      } : null,
      metodoEntrega,
      observacoes,
      items: itens,
      valores: {
        subtotal,
        frete: valorFrete,
        embrulho: valorEmbrulho,
        total: totalFinal
      },
      mercadopago: {
        preference_id: preferenceData.id,
        external_reference: preferenceData.external_reference
      }
    };
    
    localStorage.setItem('pedido_pendente', JSON.stringify(dadosPedido));
    
    // O usuário será redirecionado para o Mercado Pago automaticamente
    toast.success('Redirecionando para pagamento...');
  };

  // Callback de erro do pagamento
  const onPagamentoErro = (error: string) => {
    console.error('Erro no pagamento:', error);
    toast.error(`Erro ao processar pagamento: ${error}`);
  };

  return (
    <div className="bg-amber-50 min-h-screen py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Finalizar Compra</h1>
        
        <Link href="/carrinho" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6">
          <FaArrowLeft className="mr-2" /> Voltar ao carrinho
        </Link>

        {/* Indicador de etapas */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${etapa === 'dados' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-800'}`}>
              1
            </div>
            <span className={`ml-2 font-medium ${etapa === 'dados' ? 'text-amber-600' : 'text-gray-500'}`}>
              Dados da Entrega
            </span>
          </div>
          
          <div className="mx-4 w-12 h-px bg-gray-300"></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${etapa === 'pagamento' ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <span className={`ml-2 font-medium ${etapa === 'pagamento' ? 'text-amber-600' : 'text-gray-500'}`}>
              Pagamento
            </span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulário de checkout */}
          <div className="lg:w-2/3">
            {etapa === 'dados' && (
              <form onSubmit={(e) => { e.preventDefault(); prosseguirParaPagamento(); }}>
                {/* Dados pessoais */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-amber-900">Dados Pessoais</h2>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
                      <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                      <input
                        type="tel"
                        id="telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Método de entrega */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-amber-900">Método de Entrega</h2>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center p-3 border border-gray-200 rounded-md">
                        <input
                          type="radio"
                          id="entrega"
                          name="metodoEntrega"
                          value="entrega"
                          checked={metodoEntrega === 'entrega'}
                          onChange={() => setMetodoEntrega('entrega')}
                          className="mr-3 h-4 w-4 text-amber-600 focus:ring-amber-500"
                        />
                        <div className="flex-1">
                          <label htmlFor="entrega" className="cursor-pointer font-medium flex items-center">
                            <FaTruck className="mr-2 text-amber-600" />
                            Entrega em domicílio
                          </label>
                          <p className="text-sm text-gray-600">
                            Entrega em até 5 dias úteis - {formatarMoeda(valorFrete)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 border border-gray-200 rounded-md">
                        <input
                          type="radio"
                          id="retirada"
                          name="metodoEntrega"
                          value="retirada"
                          checked={metodoEntrega === 'retirada'}
                          onChange={() => setMetodoEntrega('retirada')}
                          className="mr-3 h-4 w-4 text-amber-600 focus:ring-amber-500"
                        />
                        <div className="flex-1">
                          <label htmlFor="retirada" className="cursor-pointer font-medium flex items-center">
                            <FaStore className="mr-2 text-amber-600" />
                            Retirada na loja
                          </label>
                          <p className="text-sm text-gray-600">
                            Grátis - Retire em nosso endereço
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Endereço de entrega */}
                {metodoEntrega === 'entrega' && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-amber-900">Endereço de Entrega</h2>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                          <input
                            type="text"
                            id="cep"
                            value={cep}
                            onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                            maxLength={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required={metodoEntrega === 'entrega'}
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={buscarCep}
                            disabled={cepPesquisando || cep.length !== 8}
                            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
                          >
                            {cepPesquisando ? 'Buscando...' : 'Buscar'}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
                        <input
                          type="text"
                          id="endereco"
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required={metodoEntrega === 'entrega'}
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                          <input
                            type="text"
                            id="numero"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required={metodoEntrega === 'entrega'}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                          <input
                            type="text"
                            id="complemento"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                        <input
                          type="text"
                          id="bairro"
                          value={bairro}
                          onChange={(e) => setBairro(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required={metodoEntrega === 'entrega'}
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                          <input
                            type="text"
                            id="cidade"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required={metodoEntrega === 'entrega'}
                          />
                        </div>
                        
                        <div className="w-24">
                          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">UF *</label>
                          <input
                            type="text"
                            id="estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value.toUpperCase())}
                            maxLength={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required={metodoEntrega === 'entrega'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Observações */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-amber-900">Observações</h2>
                  </div>
                  
                  <div className="p-4">
                    <textarea
                      id="observacoes"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      rows={3}
                      placeholder="Informações adicionais sobre seu pedido"
                    ></textarea>
                  </div>
                </div>
                
                {/* Termos e condições */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="termos"
                          checked={concordaTermos}
                          onChange={() => setConcordaTermos(!concordaTermos)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <label htmlFor="termos" className="ml-3 text-sm text-gray-700">
                        Li e concordo com os <Link href="/termos" className="text-amber-600 hover:text-amber-800">termos e condições</Link> e <Link href="/privacidade" className="text-amber-600 hover:text-amber-800">política de privacidade</Link>. *
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-600 text-white py-3 px-4 rounded-md hover:bg-amber-700 transition-colors font-medium disabled:opacity-50"
                >
                  Prosseguir para Pagamento
                </button>
              </form>
            )}

            {etapa === 'pagamento' && (
              <div className="space-y-6">
                {/* Resumo dos dados */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-amber-900">Resumo dos Dados</h2>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <strong>Cliente:</strong> {nome} ({email})
                    </div>
                    <div>
                      <strong>Telefone:</strong> {telefone}
                    </div>
                    <div>
                      <strong>Entrega:</strong> {metodoEntrega === 'entrega' ? 'Entrega em domicílio' : 'Retirada na loja'}
                    </div>
                    {metodoEntrega === 'entrega' && (
                      <div>
                        <strong>Endereço:</strong> {endereco}, {numero} - {bairro}, {cidade}/{estado} - CEP: {cep}
                      </div>
                    )}
                    {observacoes && (
                      <div>
                        <strong>Observações:</strong> {observacoes}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => setEtapa('dados')}
                      className="text-amber-600 hover:text-amber-800 text-sm"
                    >
                      ← Editar dados
                    </button>
                  </div>
                </div>

                {/* Pagamento com Mercado Pago */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-amber-900">💳 Pagamento</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Processamento seguro via Mercado Pago
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <BotaoPagamento
                      {...prepararDadosPagamento()}
                      onSuccess={onPagamentoSucesso}
                      onError={onPagamentoErro}
                      className="shadow-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Resumo do pedido */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-amber-900">Resumo do Pedido</h2>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FaShoppingCart className="mr-2 text-amber-600" />
                    Itens ({itens.length})
                  </h3>
                  
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {itens.map((item) => (
                      <li key={item.produtoId} className="flex justify-between text-sm">
                        <span>{item.quantidade}x {item.nome}</span>
                        <span>{formatarMoeda(item.preco * item.quantidade)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatarMoeda(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>{metodoEntrega === 'retirada' ? 'Grátis' : formatarMoeda(valorFrete)}</span>
                  </div>
                  
                  {embrulhoPresente && (
                    <div className="flex justify-between">
                      <span>Embrulho para presente:</span>
                      <span>{formatarMoeda(valorEmbrulho)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-amber-900">{formatarMoeda(totalFinal)}</span>
                  </div>
                </div>

                {etapa === 'dados' && (
                  <div className="mt-6 p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">
                      ℹ️ Na próxima etapa você será redirecionado para o Mercado Pago para finalizar o pagamento com segurança.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 