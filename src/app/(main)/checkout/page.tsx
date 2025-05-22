'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaShoppingCart, FaStore, FaTruck } from 'react-icons/fa';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { formatarMoeda } from '@/utils/formatters';

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
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [observacoes, setObservacoes] = useState('');
  const [concordaTermos, setConcordaTermos] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [cepPesquisando, setCepPesquisando] = useState(false);

  useEffect(() => {
    // Redirecionar para o carrinho se estiver vazio
    if (itens.length === 0) {
      router.push('/carrinho');
      toast.error('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
    }
  }, [itens, router]);

  // Calcular frete de acordo com o método de entrega
  const valorFrete = metodoEntrega === 'retirada' ? 0 : frete;

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

  // Função para finalizar a compra
  const finalizarCompra = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setIsLoading(true);
    try {
      // Preparar dados do pedido
      const pedidoData = {
        nomeCliente: nome,
        emailCliente: email,
        telefone: telefone,
        metodoEntrega: metodoEntrega,
        endereco: metodoEntrega === 'entrega' ? {
          cep,
          logradouro: endereco,
          numero,
          complemento,
          bairro,
          cidade,
          estado
        } : undefined,
        items: itens.map(item => ({
          produtoId: item.produtoId,
          nomeProduto: item.nome,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
          subtotal: item.preco * item.quantidade,
          imagem: item.imagem
        })),
        valorFrete: valorFrete,
        valorTotal: total,
        valorProdutos: subtotal,
        embrulhoPresente,
        observacoes,
        metodoPagamento
      };

      // Enviar pedido para API
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoData)
      });

      const data = await response.json();

      if (data.success) {
        // Limpar carrinho
        limparCarrinho();
        
        // Redirecionar para página de confirmação
        router.push(`/conta/pedidos/${data.pedido._id}`);
        toast.success('Pedido realizado com sucesso!');
      } else {
        throw new Error(data.message || 'Erro ao finalizar o pedido');
      }
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      toast.error('Ocorreu um erro ao finalizar seu pedido. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Finalizar Compra</h1>
        
        <Link href="/carrinho" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6">
          <FaArrowLeft className="mr-2" /> Voltar ao carrinho
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulário de checkout */}
          <div className="lg:w-2/3">
            <form onSubmit={finalizarCompra}>
              {/* Dados pessoais */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-amber-900">Dados Pessoais</h2>
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
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
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="tel"
                      id="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
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
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className={`flex-1 p-4 border rounded-lg cursor-pointer ${metodoEntrega === 'entrega' ? 'border-amber-500 bg-amber-50' : 'border-gray-300'}`}
                      onClick={() => setMetodoEntrega('entrega')}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="entrega"
                          name="metodoEntrega"
                          value="entrega"
                          checked={metodoEntrega === 'entrega'}
                          onChange={() => setMetodoEntrega('entrega')}
                          className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor="entrega" className="flex items-center cursor-pointer">
                          <FaTruck className="mr-2 text-amber-600" />
                          <div>
                            <p className="font-medium">Entrega em domicílio</p>
                            <p className="text-sm text-gray-600">Receba em sua casa</p>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className={`flex-1 p-4 border rounded-lg cursor-pointer ${metodoEntrega === 'retirada' ? 'border-amber-500 bg-amber-50' : 'border-gray-300'}`}
                      onClick={() => setMetodoEntrega('retirada')}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="retirada"
                          name="metodoEntrega"
                          value="retirada"
                          checked={metodoEntrega === 'retirada'}
                          onChange={() => setMetodoEntrega('retirada')}
                          className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor="retirada" className="flex items-center cursor-pointer">
                          <FaStore className="mr-2 text-amber-600" />
                          <div>
                            <p className="font-medium">Retirada na loja</p>
                            <p className="text-sm text-gray-600">Sem custo de frete</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {metodoEntrega === 'retirada' && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Local de retirada:</strong> Centro de Artesanato - Rua das Artes, 123, Centro.
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Horário de funcionamento:</strong> Segunda a Sexta, das 9h às 18h. Sábados das 9h às 13h.
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Tempo de separação:</strong> Após a confirmação do pagamento, seu pedido estará disponível para retirada em até 2 dias úteis.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Endereço de entrega (condicional) */}
              {metodoEntrega === 'entrega' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-amber-900">Endereço de Entrega</h2>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-1/3">
                        <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                        <div className="flex">
                          <input
                            type="text"
                            id="cep"
                            value={cep}
                            onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required={metodoEntrega === 'entrega'}
                            placeholder="00000000"
                          />
                          <button
                            type="button"
                            onClick={buscarCep}
                            disabled={cepPesquisando || cep.length !== 8}
                            className="bg-amber-600 text-white px-3 py-2 rounded-r-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                          >
                            {cepPesquisando ? '...' : 'Buscar'}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                      <input
                        type="text"
                        id="endereco"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required={metodoEntrega === 'entrega'}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-1/4">
                        <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                        <input
                          type="text"
                          id="numero"
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required={metodoEntrega === 'entrega'}
                        />
                      </div>
                      
                      <div className="sm:w-3/4">
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
                      <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                      <input
                        type="text"
                        id="bairro"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required={metodoEntrega === 'entrega'}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-3/4">
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                        <input
                          type="text"
                          id="cidade"
                          value={cidade}
                          onChange={(e) => setCidade(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required={metodoEntrega === 'entrega'}
                        />
                      </div>
                      
                      <div className="sm:w-1/4">
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <input
                          type="text"
                          id="estado"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required={metodoEntrega === 'entrega'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Método de pagamento */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-amber-900">Método de Pagamento</h2>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="pix"
                        name="metodoPagamento"
                        value="pix"
                        checked={metodoPagamento === 'pix'}
                        onChange={() => setMetodoPagamento('pix')}
                        className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="pix" className="cursor-pointer">PIX</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cartao"
                        name="metodoPagamento"
                        value="cartao"
                        checked={metodoPagamento === 'cartao'}
                        onChange={() => setMetodoPagamento('cartao')}
                        className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="cartao" className="cursor-pointer">Cartão de Crédito/Débito</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="boleto"
                        name="metodoPagamento"
                        value="boleto"
                        checked={metodoPagamento === 'boleto'}
                        onChange={() => setMetodoPagamento('boleto')}
                        className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="boleto" className="cursor-pointer">Boleto Bancário</label>
                    </div>
                  </div>
                </div>
              </div>
              
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
                      Li e concordo com os <Link href="/termos" className="text-amber-600 hover:text-amber-800">termos e condições</Link> e <Link href="/privacidade" className="text-amber-600 hover:text-amber-800">política de privacidade</Link>.
                    </label>
                  </div>
                </div>
              </div>
            </form>
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
                      <span>R$ 10,00</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-amber-900">{formatarMoeda(total - (metodoEntrega === 'retirada' ? frete : 0))}</span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  onClick={finalizarCompra}
                  disabled={isLoading}
                  className="w-full bg-amber-600 text-white py-3 px-4 rounded-md hover:bg-amber-700 transition-colors font-medium mt-6 disabled:opacity-50"
                >
                  {isLoading ? 'Processando...' : 'Finalizar Compra'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 