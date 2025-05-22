'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';

interface IPedido {
  _id: string;
  numero: string;
  nomeCliente: string;
  emailCliente: string;
  valorTotal: number;
  status: 'aguardando_pagamento' | 'pagamento_aprovado' | 'em_preparacao' | 'enviado' | 'entregue' | 'cancelado';
  pagamento: {
    metodo: string;
    status: string;
  };
  dataRegistro: string;
}

export default function GerenciamentoPedidos() {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [ordenacao, setOrdenacao] = useState<string>('recentes');
  const [busca, setBusca] = useState<string>('');

  useEffect(() => {
    const buscarPedidos = async () => {
      try {
        setCarregando(true);
        setErro(null);
        
        const response = await axios.get('/api/admin/pedidos');
        
        if (response.data.success) {
          setPedidos(response.data.pedidos);
        } else {
          throw new Error(response.data.message || 'Falha ao carregar pedidos');
        }
      } catch (error: any) {
        console.error('Erro ao buscar pedidos:', error);
        setErro(error.message || 'Falha ao buscar pedidos. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    };
    
    buscarPedidos();
  }, []);

  // Filtrar os pedidos com base nos filtros aplicados
  const pedidosFiltrados = pedidos
    .filter(pedido => {
      // Filtro por status
      if (filtroStatus !== 'todos' && pedido.status !== filtroStatus) {
        return false;
      }
      
      // Busca por número ou nome do cliente
      if (busca && !pedido.numero.toLowerCase().includes(busca.toLowerCase()) && 
          !pedido.nomeCliente.toLowerCase().includes(busca.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenação
      const dataA = new Date(a.dataRegistro).getTime();
      const dataB = new Date(b.dataRegistro).getTime();
      
      if (ordenacao === 'recentes') {
        return dataB - dataA;
      } else if (ordenacao === 'antigos') {
        return dataA - dataB;
      } else if (ordenacao === 'valor_maior') {
        return b.valorTotal - a.valorTotal;
      } else if (ordenacao === 'valor_menor') {
        return a.valorTotal - b.valorTotal;
      }
      
      return 0;
    });

  const atualizarStatusPedido = async (pedidoId: string, novoStatus: string) => {
    try {
      setCarregando(true);
      
      // Confirmação do usuário
      const mensagens = {
        'aguardando_pagamento': 'Alterar para "Aguardando Pagamento"?',
        'pagamento_aprovado': 'Confirmar aprovação do pagamento?',
        'em_preparacao': 'Marcar pedido como "Em Confecção"?',
        'enviado': 'Confirmar que o pedido foi enviado?',
        'entregue': 'Marcar pedido como entregue?',
        'cancelado': 'ATENÇÃO: Tem certeza que deseja cancelar este pedido?'
      };
      
      // Pedir confirmação do usuário
      if (!window.confirm(mensagens[novoStatus] || `Alterar status para ${novoStatus}?`)) {
        setCarregando(false);
        return;
      }
      
      // Atualizar status via API
      const response = await axios.patch(`/api/admin/pedidos/${pedidoId}`, {
        status: novoStatus
      });
      
      if (response.data.success) {
        toast.success('Status do pedido atualizado com sucesso!');
        
        // Atualizar a lista de pedidos
        await buscarPedidos();
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      toast.error('Não foi possível atualizar o status do pedido. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aguardando_pagamento':
        return { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800' };
      case 'pagamento_aprovado':
        return { label: 'Pagamento Aprovado', color: 'bg-green-100 text-green-800' };
      case 'em_preparacao':
        return { label: 'Em Preparação', color: 'bg-blue-100 text-blue-800' };
      case 'enviado':
        return { label: 'Enviado', color: 'bg-indigo-100 text-indigo-800' };
      case 'entregue':
        return { label: 'Entregue', color: 'bg-purple-100 text-purple-800' };
      case 'cancelado':
        return { label: 'Cancelado', color: 'bg-red-100 text-red-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Pedidos</h1>
            </div>
            
            {carregando ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Carregando pedidos...</p>
              </div>
            ) : erro ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-600 mb-4">{erro}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : (
              <>
                {/* Filtros e busca */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                      <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar por número ou cliente
                      </label>
                      <input
                        type="text"
                        id="busca"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Digite para buscar..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="w-full md:w-48">
                      <label htmlFor="filtroStatus" className="block text-sm font-medium text-gray-700 mb-1">
                        Filtrar por status
                      </label>
                      <select
                        id="filtroStatus"
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="todos">Todos os status</option>
                        <option value="aguardando_pagamento">Aguardando Pagamento</option>
                        <option value="pagamento_aprovado">Pagamento Aprovado</option>
                        <option value="em_preparacao">Em Preparação</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregue">Entregue</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                    
                    <div className="w-full md:w-48">
                      <label htmlFor="ordenacao" className="block text-sm font-medium text-gray-700 mb-1">
                        Ordenar por
                      </label>
                      <select
                        id="ordenacao"
                        value={ordenacao}
                        onChange={(e) => setOrdenacao(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="recentes">Mais recentes</option>
                        <option value="antigos">Mais antigos</option>
                        <option value="valor_maior">Maior valor</option>
                        <option value="valor_menor">Menor valor</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Lista de pedidos */}
                {pedidosFiltrados.length === 0 ? (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600 mb-2">Nenhum pedido encontrado com os filtros atuais.</p>
                    {filtroStatus !== 'todos' || busca ? (
                      <button 
                        onClick={() => { setFiltroStatus('todos'); setBusca(''); }}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        Limpar filtros
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Número do Pedido
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Valor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pedidosFiltrados.map((pedido) => {
                            const statusInfo = getStatusLabel(pedido.status);
                            
                            return (
                              <tr key={pedido._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-700">
                                  <Link href={`/admin/pedidos/${pedido._id}`} className="hover:underline">
                                    {pedido.numero}
                                  </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                  {pedido.nomeCliente}
                                  <div className="text-xs text-gray-500">{pedido.emailCliente}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {formatarData(pedido.dataRegistro)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {formatarValor(pedido.valorTotal)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                  <div className="flex justify-end space-x-2">
                                    <Link 
                                      href={`/admin/pedidos/${pedido._id}`}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Detalhes
                                    </Link>
                                    <div className="relative group">
                                      <button className="text-gray-500 hover:text-amber-700 ml-2">
                                        Alterar Status
                                      </button>
                                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                        {pedido.status !== 'aguardando_pagamento' && (
                                          <button
                                            onClick={() => atualizarStatusPedido(pedido._id, 'aguardando_pagamento')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                          >
                                            Aguardando Pagamento
                                          </button>
                                        )}
                                        {pedido.status !== 'pagamento_aprovado' && (
                                          <button
                                            onClick={() => atualizarStatusPedido(pedido._id, 'pagamento_aprovado')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                          >
                                            Pagamento Aprovado
                                          </button>
                                        )}
                                        {pedido.status !== 'em_preparacao' && (
                                          <button
                                            onClick={() => atualizarStatusPedido(pedido._id, 'em_preparacao')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                          >
                                            Em Preparação
                                          </button>
                                        )}
                                        {pedido.status !== 'enviado' && (
                                          <button
                                            onClick={() => atualizarStatusPedido(pedido._id, 'enviado')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                          >
                                            Enviado
                                          </button>
                                        )}
                                        {pedido.status !== 'entregue' && (
                                          <button
                                            onClick={() => atualizarStatusPedido(pedido._id, 'entregue')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                          >
                                            Entregue
                                          </button>
                                        )}
                                        {pedido.status !== 'cancelado' && (
                                          <button
                                            onClick={() => atualizarStatusPedido(pedido._id, 'cancelado')}
                                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                          >
                                            Cancelar Pedido
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 