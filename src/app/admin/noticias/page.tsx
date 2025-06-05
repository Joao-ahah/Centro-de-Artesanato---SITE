'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';

// Interface para notícia
interface Noticia {
  _id: string;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  imagem: string;
  autor: string;
  categorias: string[];
  publicado: boolean;
  dataPublicacao: string;
  dataCriacao: string;
  dataAtualizacao: string;
  visualizacoes: number;
  tags: string[];
}

// Interface para resposta da API
interface NoticiasResponse {
  success: boolean;
  noticias: Noticia[];
  paginacao: {
    total: number;
    pagina: number;
    paginas: number;
    limite: number;
  };
}

export default function GerenciamentoNoticias() {
  // Estados
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [statusPublicacao, setStatusPublicacao] = useState('');
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  // Categorias para o filtro
  const categorias = [
    { id: '', nome: 'Todas' },
    { id: 'Eventos', nome: 'Eventos' },
    { id: 'Workshop', nome: 'Workshop' },
    { id: 'Notícias', nome: 'Notícias' },
    { id: 'Lançamento', nome: 'Lançamento' },
    { id: 'Sustentabilidade', nome: 'Sustentabilidade' },
    { id: 'Exposição', nome: 'Exposição' }
  ];

  // Carregar notícias ao montar o componente ou quando os filtros mudarem
  useEffect(() => {
    carregarNoticias();
  }, [paginaAtual, categoria, statusPublicacao]);

  // Função para carregar notícias da API
  const carregarNoticias = async () => {
    try {
      setLoading(true);
      setErro(null);

      // Montar URL com parâmetros de consulta
      const params = new URLSearchParams();
      params.append('pagina', paginaAtual.toString());
      params.append('limite', '10');
      params.append('publicado', 'false'); // Mostrar todas as notícias no admin
      
      if (categoria) {
        params.append('categoria', categoria);
      }
      
      if (busca) {
        params.append('busca', busca);
      }

      // Fazer requisição à API
      const response = await axios.get<NoticiasResponse>(`/api/noticias?${params.toString()}`);
      
      if (response.data.success) {
        setNoticias(response.data.noticias);
        setTotalPaginas(response.data.paginacao.paginas);
      } else {
        setErro('Não foi possível carregar as notícias');
      }
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      setErro('Erro ao carregar notícias. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Função para realizar busca
  const realizarBusca = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaAtual(1); // Reiniciar para a primeira página
    carregarNoticias();
  };

  // Função para excluir notícia
  const excluirNoticia = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/noticias?id=${id}`);
      
      if (response.data.success) {
        setMensagem({ tipo: 'sucesso', texto: 'Notícia excluída com sucesso!' });
        // Atualizar lista após exclusão
        carregarNoticias();
      } else {
        setMensagem({ tipo: 'erro', texto: response.data.message || 'Erro ao excluir notícia' });
      }
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao excluir notícia. Tente novamente mais tarde.' });
    }
  };

  // Função para alternar status de publicação
  const alternarPublicacao = async (noticia: Noticia) => {
    try {
      const response = await axios.put(`/api/noticias?id=${noticia._id}`, {
        publicado: !noticia.publicado
      });
      
      if (response.data.success) {
        const novoStatus = !noticia.publicado;
        setMensagem({ 
          tipo: 'sucesso', 
          texto: `Notícia ${novoStatus ? 'publicada' : 'despublicada'} com sucesso!` 
        });
        
        // Atualizar o estado local
        setNoticias(noticias.map(n => 
          n._id === noticia._id ? { ...n, publicado: novoStatus } : n
        ));
      } else {
        setMensagem({ tipo: 'erro', texto: response.data.message || 'Erro ao alterar status de publicação' });
      }
    } catch (error) {
      console.error('Erro ao alterar publicação:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao alterar status de publicação. Tente novamente mais tarde.' });
    }
  };

  // Função para formatar data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
              <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Notícias</h1>
              <Link href="/admin/noticias/nova" className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md shadow-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nova Notícia
              </Link>
            </div>
            
            {/* Mensagem de feedback */}
            {mensagem && (
              <div className={`mb-4 p-4 rounded-md ${
                mensagem.tipo === 'sucesso' 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                {mensagem.texto}
                <button 
                  onClick={() => setMensagem(null)}
                  className="float-right text-lg font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* Filtros e busca */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <form onSubmit={realizarBusca} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Buscar notícias..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={statusPublicacao}
                    onChange={(e) => setStatusPublicacao(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Todos os Status</option>
                    <option value="true">Publicadas</option>
                    <option value="false">Rascunhos</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Buscar
                  </button>
                </div>
              </form>
            </div>

            {/* Tabela de notícias */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando notícias...</p>
                </div>
              ) : erro ? (
                <div className="p-8 text-center text-red-600">
                  {erro}
                </div>
              ) : noticias.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Nenhuma notícia encontrada.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Título
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoria
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Autor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Visualizações
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {noticias.map((noticia) => (
                          <tr key={noticia._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12">
                                  <img 
                                    className="h-12 w-12 rounded-lg object-cover" 
                                    src={noticia.imagem} 
                                    alt={noticia.titulo}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                    {noticia.titulo}
                                  </div>
                                  <div className="text-sm text-gray-500 max-w-xs truncate">
                                    {noticia.resumo}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {noticia.categorias.slice(0, 2).map((cat, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    {cat}
                                  </span>
                                ))}
                                {noticia.categorias.length > 2 && (
                                  <span className="text-xs text-gray-500">+{noticia.categorias.length - 2}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {noticia.autor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => alternarPublicacao(noticia)}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  noticia.publicado
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {noticia.publicado ? 'Publicada' : 'Rascunho'}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {noticia.publicado && noticia.dataPublicacao 
                                ? formatarData(noticia.dataPublicacao)
                                : formatarData(noticia.dataCriacao)
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {noticia.visualizacoes || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Link
                                  href={`/blog/${noticia.slug}`}
                                  target="_blank"
                                  className="text-amber-600 hover:text-amber-900"
                                  title="Visualizar"
                                >
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </Link>
                                <Link
                                  href={`/admin/noticias/editar/${noticia._id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </Link>
                                <button
                                  onClick={() => excluirNoticia(noticia._id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Excluir"
                                >
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginação */}
                  {totalPaginas > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                          disabled={paginaAtual === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                          disabled={paginaAtual === totalPaginas}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Próxima
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Mostrando página <span className="font-medium">{paginaAtual}</span> de{' '}
                            <span className="font-medium">{totalPaginas}</span>
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                              disabled={paginaAtual === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Anterior
                            </button>
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                              <button
                                key={pagina}
                                onClick={() => setPaginaAtual(pagina)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  pagina === paginaAtual
                                    ? 'z-10 bg-amber-50 border-amber-500 text-amber-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pagina}
                              </button>
                            ))}
                            <button
                              onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                              disabled={paginaAtual === totalPaginas}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Próxima
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 