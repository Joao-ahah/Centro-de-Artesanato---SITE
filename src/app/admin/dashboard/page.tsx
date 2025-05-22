'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';

interface DashboardData {
  totalProdutos: number;
  produtosEmDestaque: number;
  produtosEsgotados: number;
  totalPedidos: number;
  pedidosPendentes: number;
  vendasHoje: number;
  vendasMes: number;
  clientesNovos: number;
  totalArtesaos: number;
  artesaosAtivos: number;
  statusPedidos?: {
    aguardandoPagamento: number;
    pagamentoAprovado: number;
    emPreparacao: number;
    enviado: number;
    entregue: number;
    cancelado: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Buscar dados para o dashboard
  useEffect(() => {
    const buscarDados = async () => {
      try {
        setCarregando(true);
        const response = await axios.get('/api/admin/dashboard');
        
        if (response.data.success && response.data.data) {
          setDados(response.data.data);
        } else {
          throw new Error('Falha ao carregar dados');
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        toast.error('Não foi possível carregar os dados do dashboard');
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  // Formatar valor monetário
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {carregando ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
              </div>
            ) : !dados ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600">Não foi possível carregar os dados. Tente novamente mais tarde.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Resumo em cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card de Vendas do Mês */}
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Vendas do Mês</p>
                        <h2 className="text-2xl font-bold text-gray-800">{formatarMoeda(dados.vendasMes)}</h2>
                      </div>
                      <div className="p-2 bg-green-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Vendas de hoje: {formatarMoeda(dados.vendasHoje)}</p>
                    </div>
                  </div>

                  {/* Card de Pedidos */}
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Total de Pedidos</p>
                        <h2 className="text-2xl font-bold text-gray-800">{dados.totalPedidos}</h2>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Pedidos pendentes: {dados.pedidosPendentes}</p>
                    </div>
                    <div className="mt-2">
                      <Link href="/admin/pedidos" className="text-sm text-blue-600 hover:text-blue-800">
                        Ver todos os pedidos →
                      </Link>
                    </div>
                  </div>

                  {/* Card de Produtos */}
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Total de Produtos</p>
                        <h2 className="text-2xl font-bold text-gray-800">{dados.totalProdutos}</h2>
                      </div>
                      <div className="p-2 bg-amber-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Produtos esgotados: {dados.produtosEsgotados}</p>
                    </div>
                    <div className="mt-2">
                      <Link href="/admin/produtos" className="text-sm text-amber-600 hover:text-amber-800">
                        Gerenciar produtos →
                      </Link>
                    </div>
                  </div>

                  {/* Card de Artesãos */}
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Total de Artesãos</p>
                        <h2 className="text-2xl font-bold text-gray-800">{dados.totalArtesaos}</h2>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Artesãos ativos: {dados.artesaosAtivos}</p>
                    </div>
                    <div className="mt-2">
                      <Link href="/admin/artesaos" className="text-sm text-purple-600 hover:text-purple-800">
                        Gerenciar artesãos →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Links rápidos */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link 
                      href="/admin/produtos/novo" 
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                    >
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Adicionar Produto</span>
                    </Link>
                    
                    <Link 
                      href="/admin/pedidos" 
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Ver Pedidos</span>
                    </Link>
                    
                    <button
                      onClick={() => router.push('/admin/artesaos')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Gerenciar Artesãos</span>
                    </button>
                    
                    <button 
                      onClick={() => router.push('/admin/produtos?estoque=0')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Produtos Esgotados</span>
                    </button>
                  </div>
                </div>

                {/* Status dos Pedidos */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Status de Pedidos</h2>
                  
                  {dados.statusPedidos ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex flex-col border rounded-lg p-4 bg-blue-50">
                          <span className="text-sm text-gray-600">Pagamento Aprovado</span>
                          <span className="text-2xl font-bold text-blue-700">{dados.statusPedidos.pagamentoAprovado}</span>
                          <Link href="/admin/pedidos?status=pagamento_aprovado" className="text-xs text-blue-600 mt-2 hover:underline">
                            Ver detalhes →
                          </Link>
                        </div>
                        
                        <div className="flex flex-col border rounded-lg p-4 bg-purple-50">
                          <span className="text-sm text-gray-600">Em Confecção</span>
                          <span className="text-2xl font-bold text-purple-700">{dados.statusPedidos.emPreparacao}</span>
                          <Link href="/admin/pedidos?status=em_preparacao" className="text-xs text-purple-600 mt-2 hover:underline">
                            Ver detalhes →
                          </Link>
                        </div>
                        
                        <div className="flex flex-col border rounded-lg p-4 bg-indigo-50">
                          <span className="text-sm text-gray-600">Enviados</span>
                          <span className="text-2xl font-bold text-indigo-700">{dados.statusPedidos.enviado}</span>
                          <Link href="/admin/pedidos?status=enviado" className="text-xs text-indigo-600 mt-2 hover:underline">
                            Ver detalhes →
                          </Link>
                        </div>
                      </div>
                      
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                              Progresso de Pedidos
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              {Math.round((dados.statusPedidos.entregue / dados.totalPedidos) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                          <div 
                            style={{ width: `${Math.round((dados.statusPedidos.entregue / dados.totalPedidos) * 100)}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500">
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Informações sobre status de pedidos não disponíveis</p>
                  )}
                  
                  <div className="mt-4 text-center">
                    <Link 
                      href="/admin/pedidos" 
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      Ver todos os pedidos
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 