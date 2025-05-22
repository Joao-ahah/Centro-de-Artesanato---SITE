'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';

interface ICliente {
  _id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  ativo: boolean;
  ultimoLogin?: string;
  createdAt: string;
}

export default function GerenciamentoClientes() {
  const router = useRouter();
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [mostrarModalAdicionar, setMostrarModalAdicionar] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: ''
  });

  // Buscar clientes
  const buscarClientes = async (pagina = 1, busca = '') => {
    try {
      setCarregando(true);
      setErro(null);
      
      const response = await axios.get(`/api/admin/clientes?page=${pagina}&search=${busca}`);
      
      if (response.data.success) {
        setClientes(response.data.clientes);
        setTotalPaginas(response.data.paginacao.totalPaginas);
        setPaginaAtual(pagina);
      } else {
        throw new Error(response.data.message || 'Falha ao carregar clientes');
      }
    } catch (error: any) {
      console.error('Erro ao buscar clientes:', error);
      setErro(error.message || 'Falha ao buscar clientes. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Carregar clientes na inicialização
  useEffect(() => {
    buscarClientes();
  }, []);

  // Buscar clientes ao mudar o termo de busca
  const handleBusca = () => {
    buscarClientes(1, termoBusca);
  };

  // Limpar busca
  const limparBusca = () => {
    setTermoBusca('');
    buscarClientes(1, '');
  };

  // Navegação de páginas
  const navegarPagina = (pagina: number) => {
    if (pagina < 1 || pagina > totalPaginas) return;
    buscarClientes(pagina, termoBusca);
  };

  // Desativar cliente
  const desativarCliente = async () => {
    if (!clienteSelecionado) return;
    
    try {
      const response = await axios.delete(`/api/admin/clientes/${clienteSelecionado}`);
      
      if (response.data.success) {
        toast.success('Cliente desativado com sucesso!');
        // Atualizar lista
        buscarClientes(paginaAtual, termoBusca);
      } else {
        throw new Error(response.data.message || 'Falha ao desativar cliente');
      }
    } catch (error: any) {
      console.error('Erro ao desativar cliente:', error);
      toast.error(error.message || 'Erro ao desativar cliente');
    } finally {
      setMostrarModalExcluir(false);
      setClienteSelecionado(null);
    }
  };

  // Adicionar novo cliente
  const adicionarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar campos
      if (!novoCliente.nome || !novoCliente.email || !novoCliente.senha) {
        toast.error('Nome, email e senha são obrigatórios');
        return;
      }
      
      const response = await axios.post('/api/admin/clientes', novoCliente);
      
      if (response.data.success) {
        toast.success('Cliente adicionado com sucesso!');
        // Limpar formulário
        setNovoCliente({
          nome: '',
          email: '',
          senha: '',
          telefone: ''
        });
        // Fechar modal
        setMostrarModalAdicionar(false);
        // Atualizar lista
        buscarClientes(1, '');
      } else {
        throw new Error(response.data.message || 'Falha ao adicionar cliente');
      }
    } catch (error: any) {
      console.error('Erro ao adicionar cliente:', error);
      toast.error(error.response?.data?.message || error.message || 'Erro ao adicionar cliente');
    }
  };

  // Formatação de data
  const formatarData = (dataString: string | undefined) => {
    if (!dataString) return 'N/A';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
              <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Clientes</h1>
              
              <button
                onClick={() => setMostrarModalAdicionar(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Adicionar Cliente
              </button>
            </div>
            
            {/* Área de busca */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <div className="relative">
                    <input
                      type="text"
                      value={termoBusca}
                      onChange={(e) => setTermoBusca(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
                      placeholder="Buscar por nome ou email..."
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleBusca}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
                  >
                    Buscar
                  </button>
                  {termoBusca && (
                    <button
                      onClick={limparBusca}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Conteúdo principal */}
            {carregando ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Carregando clientes...</p>
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
                  onClick={() => buscarClientes()}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : clientes.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhum cliente encontrado</h2>
                <p className="text-gray-600 mb-4">
                  {termoBusca ? 'Nenhum cliente corresponde aos critérios de busca.' : 'Não existem clientes cadastrados ainda.'}
                </p>
                {termoBusca && (
                  <button
                    onClick={limparBusca}
                    className="text-amber-600 hover:text-amber-800"
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Tabela de clientes */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email / Telefone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data de Cadastro
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clientes.map((cliente) => (
                          <tr key={cliente._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{cliente.email}</div>
                              <div className="text-sm text-gray-500">{cliente.telefone || 'Não informado'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatarData(cliente.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                cliente.ativo
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {cliente.ativo ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <Link
                                  href={`/admin/clientes/${cliente._id}`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Detalhes
                                </Link>
                                <button 
                                  onClick={() => {
                                    setClienteSelecionado(cliente._id);
                                    setMostrarModalExcluir(true);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Desativar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Paginação */}
                {totalPaginas > 1 && (
                  <div className="flex justify-center mt-6">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => navegarPagina(paginaAtual - 1)}
                        disabled={paginaAtual === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                          paginaAtual === 1 
                            ? 'cursor-not-allowed' 
                            : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        <span className="sr-only">Anterior</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: totalPaginas }).map((_, index) => {
                        const pagina = index + 1;
                        const mostrarPagina = 
                          pagina === 1 || 
                          pagina === totalPaginas || 
                          (pagina >= paginaAtual - 1 && pagina <= paginaAtual + 1);
                        
                        // Mostrar elipses
                        if (!mostrarPagina) {
                          if (pagina === 2 || pagina === totalPaginas - 1) {
                            return (
                              <span key={pagina} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                        
                        return (
                          <button
                            key={pagina}
                            onClick={() => navegarPagina(pagina)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              pagina === paginaAtual
                                ? 'z-10 bg-amber-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {pagina}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => navegarPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                          paginaAtual === totalPaginas 
                            ? 'cursor-not-allowed' 
                            : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        <span className="sr-only">Próximo</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de exclusão/desativação */}
      {mostrarModalExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Desativação</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja desativar este cliente? Esta ação pode ser revertida posteriormente.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setMostrarModalExcluir(false);
                  setClienteSelecionado(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={desativarCliente}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Desativar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de adicionar cliente */}
      {mostrarModalAdicionar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Adicionar Novo Cliente</h3>
              <button
                onClick={() => setMostrarModalAdicionar(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={adicionarCliente}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo*
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={novoCliente.nome}
                    onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={novoCliente.email}
                    onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha*
                  </label>
                  <input
                    id="senha"
                    type="password"
                    value={novoCliente.senha}
                    onChange={(e) => setNovoCliente({ ...novoCliente, senha: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    id="telefone"
                    type="tel"
                    value={novoCliente.telefone}
                    onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setMostrarModalAdicionar(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Adicionar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminRoute>
  );
} 