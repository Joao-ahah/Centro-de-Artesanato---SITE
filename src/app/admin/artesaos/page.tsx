'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';

interface Artesao {
  _id: string;
  nome: string;
  especialidade: string;
  descricao: string;
  estado: string;
  cidade: string;
  imagem?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  dataCriacao: string;
}

export default function GerenciamentoArtesaos() {
  const router = useRouter();
  const [artesaos, setArtesaos] = useState<Artesao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [artesaoSelecionado, setArtesaoSelecionado] = useState<string | null>(null);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [mostrarModalAdicionar, setMostrarModalAdicionar] = useState(false);
  const [novoArtesao, setNovoArtesao] = useState({
    nome: '',
    especialidade: '',
    descricao: '',
    estado: '',
    cidade: '',
    imagem: '',
    telefone: '',
    email: ''
  });

  // Lista de estados brasileiros para o formulário
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Buscar artesãos
  const buscarArtesaos = async (pagina = 1, busca = '') => {
    try {
      setCarregando(true);
      setErro(null);
      
      const response = await axios.get(`/api/admin/artesaos?page=${pagina}&search=${busca}`);
      
      if (response.data.success) {
        setArtesaos(response.data.artesaos);
        setTotalPaginas(response.data.paginacao.totalPaginas);
        setPaginaAtual(pagina);
      } else {
        throw new Error(response.data.message || 'Falha ao carregar artesãos');
      }
    } catch (error: any) {
      console.error('Erro ao buscar artesãos:', error);
      setErro(error.message || 'Falha ao buscar artesãos. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Carregar artesãos na inicialização
  useEffect(() => {
    buscarArtesaos();
  }, []);

  // Buscar artesãos ao mudar o termo de busca
  const handleBusca = () => {
    buscarArtesaos(1, termoBusca);
  };

  // Limpar busca
  const limparBusca = () => {
    setTermoBusca('');
    buscarArtesaos(1, '');
  };

  // Navegação de páginas
  const navegarPagina = (pagina: number) => {
    if (pagina < 1 || pagina > totalPaginas) return;
    buscarArtesaos(pagina, termoBusca);
  };

  // Desativar artesão
  const desativarArtesao = async () => {
    if (!artesaoSelecionado) return;
    
    try {
      const response = await axios.delete(`/api/admin/artesaos/${artesaoSelecionado}`);
      
      if (response.data.success) {
        toast.success('Artesão desativado com sucesso!');
        // Atualizar lista
        buscarArtesaos(paginaAtual, termoBusca);
      } else {
        throw new Error(response.data.message || 'Falha ao desativar artesão');
      }
    } catch (error: any) {
      console.error('Erro ao desativar artesão:', error);
      toast.error(error.message || 'Erro ao desativar artesão');
    } finally {
      setMostrarModalExcluir(false);
      setArtesaoSelecionado(null);
    }
  };

  // Adicionar novo artesão
  const adicionarArtesao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar campos
      if (!novoArtesao.nome || !novoArtesao.especialidade || !novoArtesao.descricao || !novoArtesao.estado || !novoArtesao.cidade) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }
      
      const response = await axios.post('/api/admin/artesaos', novoArtesao);
      
      if (response.data.success) {
        toast.success('Artesão adicionado com sucesso!');
        // Limpar formulário
        setNovoArtesao({
          nome: '',
          especialidade: '',
          descricao: '',
          estado: '',
          cidade: '',
          imagem: '',
          telefone: '',
          email: ''
        });
        // Fechar modal
        setMostrarModalAdicionar(false);
        // Atualizar lista
        buscarArtesaos(1, '');
      } else {
        throw new Error(response.data.message || 'Falha ao adicionar artesão');
      }
    } catch (error: any) {
      console.error('Erro ao adicionar artesão:', error);
      toast.error(error.response?.data?.message || error.message || 'Erro ao adicionar artesão');
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
              <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Artesãos</h1>
              
              <button
                onClick={() => setMostrarModalAdicionar(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Adicionar Artesão
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
                      placeholder="Buscar por nome, especialidade ou descrição..."
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
                <p className="text-gray-600">Carregando artesãos...</p>
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
                  onClick={() => buscarArtesaos()}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : artesaos.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhum artesão encontrado</h2>
                <p className="text-gray-600 mb-4">
                  {termoBusca ? 'Nenhum artesão corresponde aos critérios de busca.' : 'Não existem artesãos cadastrados ainda.'}
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
                {/* Tabela de artesãos */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Especialidade
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Localização
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
                        {artesaos.map((artesao) => (
                          <tr key={artesao._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {artesao.imagem ? (
                                    <img
                                      src={artesao.imagem}
                                      alt={artesao.nome}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                                      {artesao.nome.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{artesao.nome}</div>
                                  <div className="text-sm text-gray-500">{artesao.email || 'Email não cadastrado'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{artesao.especialidade}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{artesao.cidade}</div>
                              <div className="text-sm text-gray-500">{artesao.estado}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                artesao.ativo
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {artesao.ativo ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <Link
                                  href={`/admin/artesaos/${artesao._id}`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Detalhes
                                </Link>
                                <button 
                                  onClick={() => {
                                    setArtesaoSelecionado(artesao._id);
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
              Tem certeza que deseja desativar este artesão? Esta ação pode ser revertida posteriormente.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setMostrarModalExcluir(false);
                  setArtesaoSelecionado(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={desativarArtesao}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Desativar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de adicionar artesão */}
      {mostrarModalAdicionar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Adicionar Novo Artesão</h3>
              <button
                onClick={() => setMostrarModalAdicionar(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={adicionarArtesao} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo*
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={novoArtesao.nome}
                    onChange={(e) => setNovoArtesao({ ...novoArtesao, nome: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="especialidade" className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidade*
                  </label>
                  <input
                    id="especialidade"
                    type="text"
                    value={novoArtesao.especialidade}
                    onChange={(e) => setNovoArtesao({ ...novoArtesao, especialidade: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Ex: Cerâmica, Tecelagem, Escultura em madeira"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição*
                </label>
                <textarea
                  id="descricao"
                  value={novoArtesao.descricao}
                  onChange={(e) => setNovoArtesao({ ...novoArtesao, descricao: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Breve biografia e descrição do trabalho do artesão"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado*
                  </label>
                  <select
                    id="estado"
                    value={novoArtesao.estado}
                    onChange={(e) => setNovoArtesao({ ...novoArtesao, estado: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecione um estado</option>
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade*
                  </label>
                  <input
                    id="cidade"
                    type="text"
                    value={novoArtesao.cidade}
                    onChange={(e) => setNovoArtesao({ ...novoArtesao, cidade: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    id="telefone"
                    type="tel"
                    value={novoArtesao.telefone}
                    onChange={(e) => setNovoArtesao({ ...novoArtesao, telefone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={novoArtesao.email}
                    onChange={(e) => setNovoArtesao({ ...novoArtesao, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem
                </label>
                <input
                  id="imagem"
                  type="url"
                  value={novoArtesao.imagem}
                  onChange={(e) => setNovoArtesao({ ...novoArtesao, imagem: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Adicione uma URL de imagem do artesão ou deixe em branco para usar a inicial do nome
                </p>
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
                  Adicionar Artesão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminRoute>
  );
} 