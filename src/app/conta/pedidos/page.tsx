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

interface Pedido {
  id: string;
  numero: string;
  dataRegistro: string;
  valorTotal: number;
  status: 'aguardando_pagamento' | 'pagamento_aprovado' | 'em_preparacao' | 'enviado' | 'entregue' | 'cancelado';
  items: ItemPedido[];
  rastreamento?: string;
}

export default function PedidosPage() {
  const { user, authenticated, requireAuth } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await requireAuth();
      if (!result.success) {
        router.push('/conta/login?redirect=/conta/pedidos');
      } else {
        await carregarPedidos();
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [requireAuth, router]);

  const carregarPedidos = async () => {
    try {
      // Em produção, esta seria uma chamada real à API
      // const response = await fetch('/api/pedidos/meus-pedidos');
      // const data = await response.json();
      
      // Simulando dados de pedidos para demonstração
      const pedidosSimulados: Pedido[] = [
        {
          id: '1',
          numero: 'ART20230001',
          dataRegistro: '2023-06-15T14:30:00Z',
          valorTotal: 189.90,
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
          rastreamento: 'BR123456789'
        },
        {
          id: '2',
          numero: 'ART20230015',
          dataRegistro: '2023-05-20T10:15:00Z',
          valorTotal: 249.90,
          status: 'entregue',
          items: [
            {
              produto: 'prod3',
              nomeProduto: 'Manta Artesanal',
              quantidade: 1,
              precoUnitario: 249.90,
              subtotal: 249.90,
              imagem: '/produtos/manta.jpg'
            }
          ],
          rastreamento: 'BR987654321'
        },
        {
          id: '3',
          numero: 'ART20230042',
          dataRegistro: '2023-08-03T16:20:00Z',
          valorTotal: 159.80,
          status: 'em_preparacao',
          items: [
            {
              produto: 'prod4',
              nomeProduto: 'Conjunto de Potes Decorativos',
              quantidade: 1,
              precoUnitario: 159.80,
              subtotal: 159.80,
              imagem: '/produtos/potes.jpg'
            }
          ]
        }
      ];
      
      setPedidos(pedidosSimulados);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  };

  // Traduz o status do pedido
  const traduzirStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'aguardando_pagamento': 'Aguardando Pagamento',
      'pagamento_aprovado': 'Pagamento Aprovado',
      'em_preparacao': 'Em Confecção',
      'enviado': 'Enviado',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    };
    
    return statusMap[status] || status;
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

  // Componente de barra de progresso para acompanhamento do pedido
  const AcompanhamentoPedido = ({ status }: { status: string }) => {
    // Definir as etapas do pedido em ordem
    const etapas = [
      { key: 'aguardando_pagamento', label: 'Aguardando Pagamento' },
      { key: 'pagamento_aprovado', label: 'Pagamento Aprovado' },
      { key: 'em_preparacao', label: 'Em Confecção' },
      { key: 'enviado', label: 'Enviado' },
      { key: 'entregue', label: 'Entregue' }
    ];
    
    // Encontrar o índice da etapa atual
    const etapaAtualIndex = etapas.findIndex(etapa => etapa.key === status);
    
    // Se o pedido foi cancelado, mostrar uma mensagem específica
    if (status === 'cancelado') {
      return (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-center bg-red-50 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-red-700 font-medium">Pedido Cancelado</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-3">Acompanhamento do Pedido</h4>
        <div className="relative">
          {/* Linha de progresso */}
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${Math.max(0, Math.min(100, (etapaAtualIndex / (etapas.length - 1)) * 100))}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
            ></div>
          </div>
          
          {/* Etapas */}
          <div className="flex justify-between">
            {etapas.map((etapa, index) => {
              const isActive = index <= etapaAtualIndex;
              const isPast = index < etapaAtualIndex;
              
              return (
                <div key={etapa.key} className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full mb-1 flex items-center justify-center ${
                    isActive ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}>
                    {isPast ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-xs text-center max-w-[80px]">{etapa.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Formata data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Meus Pedidos</h1>
          
          {pedidos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Você ainda não possui pedidos</h2>
              <p className="text-gray-600 mb-6">Que tal começar a explorar nossos produtos?</p>
              <Link href="/produtos" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Ver Produtos
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 bg-amber-50 border-b flex flex-wrap items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pedido:</p>
                      <p className="font-semibold text-gray-800">{pedido.numero}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Data:</p>
                      <p className="font-semibold text-gray-800">{formatarData(pedido.dataRegistro)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor:</p>
                      <p className="font-semibold text-gray-800">R$ {pedido.valorTotal.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status:</p>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(pedido.status)}`}>
                        {traduzirStatus(pedido.status)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Adicionar componente de acompanhamento do pedido */}
                  <AcompanhamentoPedido status={pedido.status} />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Itens do Pedido</h3>
                    
                    <div className="space-y-3">
                      {pedido.items.map((item, index) => (
                        <div key={index} className="flex items-center border-b border-gray-100 pb-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-3xl">
                            🏺
                          </div>
                          <div className="ml-4 flex-grow">
                            <h4 className="font-medium text-gray-800">{item.nomeProduto}</h4>
                            <p className="text-sm text-gray-600">
                              {item.quantidade} x R$ {item.precoUnitario.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">R$ {item.subtotal.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    {pedido.rastreamento ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Rastreamento:</p>
                        <a 
                          href={`https://www.correios.com.br/rastreamento/${pedido.rastreamento}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:text-amber-800 transition-colors"
                        >
                          {pedido.rastreamento}
                        </a>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">Código de rastreamento ainda não disponível</p>
                      </div>
                    )}
                    
                    <Link 
                      href={`/conta/pedidos/${pedido.id}`}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 