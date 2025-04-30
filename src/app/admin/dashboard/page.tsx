'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProdutos: 0,
    produtosEmDestaque: 0,
    produtosEsgotados: 0,
    totalPedidos: 0,
    pedidosPendentes: 0,
    vendasHoje: 0,
    vendasMes: 0,
    clientesNovos: 0
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fazer requisição à API
        const response = await axios.get('/api/admin/dashboard');
        
        if (response.data.success) {
          console.log('Dados do dashboard carregados:', response.data.data);
          setDashboardData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Erro ao carregar dados do dashboard');
        }
      } catch (err: any) {
        console.error('Erro ao carregar dashboard:', err);
        setError(err.message || 'Ocorreu um erro ao carregar os dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Formatar valores monetários em reais
  const formatarMoeda = (valor: number) => {
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700"></div>
                <p className="ml-2 text-gray-600">Carregando dados...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 p-4 rounded-lg text-red-800 mb-6">
                {error}
                <button
                  className="ml-4 text-amber-700 hover:text-amber-900"
                  onClick={() => window.location.reload()}
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <>
                {/* Cards principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">Vendas Hoje</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatarMoeda(dashboardData.vendasHoje)}</h3>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-green-600 font-medium">+5.2%</span>
                      <span className="text-gray-500 ml-1">vs ontem</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">Vendas no Mês</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatarMoeda(dashboardData.vendasMes)}</h3>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-green-600 font-medium">+12.7%</span>
                      <span className="text-gray-500 ml-1">vs mês anterior</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">Pedidos Pendentes</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{dashboardData.pedidosPendentes}</h3>
                      </div>
                      <div className="p-3 bg-amber-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Link 
                        href="/admin/pedidos" 
                        className="text-amber-700 hover:text-amber-800 text-sm font-medium"
                      >
                        Ver todos os pedidos
                      </Link>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">Produtos em Estoque</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{dashboardData.totalProdutos - dashboardData.produtosEsgotados}</h3>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <span className={`${dashboardData.produtosEsgotados > 0 ? 'text-red-600' : 'text-gray-600'} font-medium`}>
                        {dashboardData.produtosEsgotados} esgotados
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estatísticas secundárias */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo de Vendas</h3>
                    
                    <div className="h-60 flex items-center justify-center text-gray-500">
                      <p>Gráfico de vendas seria mostrado aqui</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
                    
                    <div className="space-y-3">
                      <Link 
                        href="/admin/produtos/novo" 
                        className="flex items-center p-3 bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Adicionar Produto
                      </Link>
                      
                      <Link 
                        href="/admin/pedidos" 
                        className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Gerenciar Pedidos
                      </Link>
                      
                      <Link 
                        href="/admin/produtos" 
                        className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Atualizar Produtos
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Estatísticas detalhadas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas de Produtos</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total de Produtos</span>
                        <span className="font-semibold">{dashboardData.totalProdutos}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Produtos em Destaque</span>
                        <span className="font-semibold">{dashboardData.produtosEmDestaque}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Produtos Esgotados</span>
                        <span className="font-semibold text-red-600">{dashboardData.produtosEsgotados}</span>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <Link 
                          href="/admin/produtos" 
                          className="text-amber-700 hover:text-amber-800 font-medium"
                        >
                          Ver todos os produtos →
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas de Clientes</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Clientes Novos (este mês)</span>
                        <span className="font-semibold">{dashboardData.clientesNovos}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total de Pedidos</span>
                        <span className="font-semibold">{dashboardData.totalPedidos}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Taxa de Conversão</span>
                        <span className="font-semibold">2.4%</span>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <Link 
                          href="/admin/clientes" 
                          className="text-amber-700 hover:text-amber-800 font-medium"
                        >
                          Ver todos os clientes →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 