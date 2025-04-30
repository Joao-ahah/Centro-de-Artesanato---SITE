'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/providers/AuthProvider';
import LoadingScreen from '@/components/LoadingScreen';

// Interfaces
interface ItemPedido {
  produto: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  imagem?: string;
}

interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface Pagamento {
  metodo: 'pix' | 'cartao' | 'boleto';
  status: 'pendente' | 'aprovado' | 'recusado' | 'estornado';
  valor: number;
  detalhes?: any;
  dataPagamento?: string;
  comprovante?: string;
}

interface Pedido {
  id: string;
  numero: string;
  dataRegistro: string;
  valorTotal: number;
  valorFrete: number;
  valorProdutos: number;
  status: 'aguardando_pagamento' | 'pagamento_aprovado' | 'em_preparacao' | 'enviado' | 'entregue' | 'cancelado';
  items: ItemPedido[];
  endereco: Endereco;
  pagamento: Pagamento;
  rastreamento?: string;
  dataAtualizacao?: string;
  dataCancelamento?: string;
  dataEnvio?: string;
  dataEntrega?: string;
}

export default function DetalhesPedidoPage({ params }: { params: { id: string } }) {
  const { user, authenticated, requireAuth } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await requireAuth();
      if (!result.success) {
        router.push('/conta/login?redirect=/conta/pedidos/' + params.id);
      } else {
        await carregarPedido();
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [requireAuth, router, params.id]);

  const carregarPedido = async () => {
    try {
      // Em produção, esta seria uma chamada real à API
      // const response = await fetch(`/api/pedidos/${params.id}`);
      // const data = await response.json();
      
      // Simulando dados de pedido para demonstração
      const pedidoSimulado: Pedido = {
        id: params.id,
        numero: 'ART20230001',
        dataRegistro: '2023-06-15T14:30:00Z',
        valorTotal: 189.90,
        valorFrete: 20.00,
        valorProdutos: 169.90,
        status: 'entregue',
        items: [
          {
            produto: 'prod1',
            nomeProduto: 'Vaso de Cerâmica Marajoara',
            quantidade: 1,
            precoUnitario: 129.90,
            subtotal: 129.90,
            imagem: '/produtos/vaso-ceramica.jpg'
          },
          {
            produto: 'prod2',
            nomeProduto: 'Porta-lápis de Madeira',
            quantidade: 2,
            precoUnitario: 29.95,
            subtotal: 59.90,
            imagem: '/produtos/porta-lapis.jpg'
          }
        ],
        endereco: {
          cep: '01234-567',
          logradouro: 'Rua das Artes',
          numero: '123',
          complemento: 'Apto 101',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP'
        },
        pagamento: {
          metodo: 'pix',
          status: 'aprovado',
          valor: 189.90,
          dataPagamento: '2023-06-15T14:45:00Z'
        },
        rastreamento: 'BR123456789',
        dataAtualizacao: '2023-06-15T14:45:00Z',
        dataEnvio: '2023-06-17T10:30:00Z',
        dataEntrega: '2023-06-20T14:15:00Z'
      };
      
      setPedido(pedidoSimulado);
    } catch (error) {
      console.error('Erro ao carregar detalhes do pedido:', error);
      setErro('Não foi possível carregar os detalhes do pedido. Tente novamente mais tarde.');
    }
  };

  // Traduz o status do pedido
  const traduzirStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'aguardando_pagamento': 'Aguardando Pagamento',
      'pagamento_aprovado': 'Pagamento Aprovado',
      'em_preparacao': 'Em Preparação',
      'enviado': 'Enviado',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    };
    
    return statusMap[status] || status;
  };

  // Traduz o método de pagamento
  const traduzirMetodoPagamento = (metodo: string) => {
    const metodosMap: Record<string, string> = {
      'pix': 'PIX',
      'cartao': 'Cartão de Crédito',
      'boleto': 'Boleto Bancário'
    };
    
    return metodosMap[metodo] || metodo;
  };

  // Retorna a cor do badge de status
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'aguardando_pagamento': 'bg-yellow-100 text-yellow-800',
      'pagamento_aprovado': 'bg-blue-100 text-blue-800',
      'em_preparacao': 'bg-purple-100 text-purple-800',
      'enviado': 'bg-indigo-100 text-indigo-800',
      'entregue': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Formata data
  const formatarData = (dataString?: string) => {
    if (!dataString) return 'N/A';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Erro</h2>
            <p className="text-gray-600 mb-6">{erro}</p>
            <Link href="/conta/pedidos" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              Voltar para Meus Pedidos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Pedido não encontrado</h2>
            <p className="text-gray-600 mb-6">Não foi possível encontrar detalhes para o pedido solicitado.</p>
            <Link href="/conta/pedidos" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              Voltar para Meus Pedidos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Detalhes do Pedido #{pedido.numero}</h1>
            <Link href="/conta/pedidos" className="text-amber-600 hover:text-amber-800 transition-colors text-sm flex items-center">
              &larr; Voltar para Meus Pedidos
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 bg-amber-50 border-b">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(pedido.status)}`}>
                    {traduzirStatus(pedido.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data do Pedido</p>
                  <p className="font-semibold text-gray-800">{formatarData(pedido.dataRegistro)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Última Atualização</p>
                  <p className="font-semibold text-gray-800">{formatarData(pedido.dataAtualizacao)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="font-semibold text-gray-800">R$ {pedido.valorTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">Endereço de Entrega</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-1">{pedido.endereco.logradouro}, {pedido.endereco.numero}</p>
                    {pedido.endereco.complemento && <p className="mb-1">{pedido.endereco.complemento}</p>}
                    <p className="mb-1">{pedido.endereco.bairro}</p>
                    <p className="mb-1">{pedido.endereco.cidade} - {pedido.endereco.estado}</p>
                    <p>CEP: {pedido.endereco.cep}</p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">Pagamento</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2">
                      <span className="font-medium">Método:</span> {traduzirMetodoPagamento(pedido.pagamento.metodo)}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Status:</span> {pedido.pagamento.status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Data do Pagamento:</span> {formatarData(pedido.pagamento.dataPagamento)}
                    </p>
                    <p>
                      <span className="font-medium">Valor:</span> R$ {pedido.pagamento.valor.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Itens do Pedido</h2>
                
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço Unit.
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pedido.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-xl">
                                🏺
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.nomeProduto}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.quantidade}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">R$ {item.precoUnitario.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            R$ {item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                          Subtotal:
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          R$ {pedido.valorProdutos.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                          Frete:
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          R$ {pedido.valorFrete.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-3 text-right text-sm font-bold text-gray-700">
                          Total:
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-gray-900">
                          R$ {pedido.valorTotal.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {pedido.rastreamento && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">Informações de Entrega</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Código de Rastreamento</p>
                        <a 
                          href={`https://www.correios.com.br/rastreamento/${pedido.rastreamento}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:text-amber-800 transition-colors font-medium"
                        >
                          {pedido.rastreamento}
                        </a>
                      </div>
                      
                      {pedido.dataEnvio && (
                        <div>
                          <p className="text-sm text-gray-600">Data de Envio</p>
                          <p className="font-medium text-gray-800">{formatarData(pedido.dataEnvio)}</p>
                        </div>
                      )}
                      
                      {pedido.dataEntrega && (
                        <div>
                          <p className="text-sm text-gray-600">Data de Entrega</p>
                          <p className="font-medium text-gray-800">{formatarData(pedido.dataEntrega)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-between items-center">
                <Link href="/conta/pedidos" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                  Voltar
                </Link>
                
                {pedido.status === 'entregue' && (
                  <Link 
                    href={`/produtos`}
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                  >
                    Comprar Novamente
                  </Link>
                )}
                
                {pedido.status === 'aguardando_pagamento' && (
                  <button 
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                    onClick={() => alert('Simulação: Redirecionando para a página de pagamento.')}
                  >
                    Efetuar Pagamento
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 