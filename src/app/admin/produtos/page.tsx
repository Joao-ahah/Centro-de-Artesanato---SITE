'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';

// Definindo a interface para o tipo de produto
interface Produto {
  _id: string;
  nome: string;
  categoria: string;
  preco: number;
  precoPromocional?: number;
  estoque: number;
  artesao: string;
  emDestaque: boolean;
  disponivel: boolean;
  imagens: string[];
}

// Interface para resposta da API
interface ProdutosResponse {
  success: boolean;
  produtos: Produto[];
  paginacao: {
    total: number;
    pagina: number;
    totalPaginas: number;
    limite: number;
  };
}

export default function GerenciamentoProdutos() {
  // Estados
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  // Categorias para o filtro (poderia vir de uma API)
  const categorias = [
    { id: '', nome: 'Todas' },
    { id: 'Decoração', nome: 'Decoração' },
    { id: 'Têxteis', nome: 'Têxteis' },
    { id: 'Acessórios', nome: 'Acessórios' },
    { id: 'Utilidades', nome: 'Utilidades' }
  ];

  // Carregar produtos ao montar o componente ou quando os filtros mudarem
  useEffect(() => {
    carregarProdutos();
  }, [paginaAtual, categoria, ordenacao]);

  // Função para carregar produtos da API
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      setErro(null);

      // Montar URL com parâmetros de consulta
      const params = new URLSearchParams();
      params.append('pagina', paginaAtual.toString());
      params.append('limite', '10');
      
      if (categoria) {
        params.append('categoria', categoria);
      }
      
      if (busca) {
        params.append('busca', busca);
      }

      // Fazer requisição à API
      const response = await axios.get<ProdutosResponse>(`/api/produtos?${params.toString()}`);
      
      if (response.data.success) {
        setProdutos(response.data.produtos);
        setTotalPaginas(response.data.paginacao.totalPaginas);
      } else {
        setErro('Não foi possível carregar os produtos');
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setErro('Erro ao carregar produtos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Função para realizar busca
  const realizarBusca = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaAtual(1); // Reiniciar para a primeira página
    carregarProdutos();
  };

  // Função para excluir produto
  const excluirProduto = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/produtos/${id}`);
      
      if (response.data.success) {
        setMensagem({ tipo: 'sucesso', texto: 'Produto excluído com sucesso!' });
        // Atualizar lista após exclusão
        carregarProdutos();
      } else {
        setMensagem({ tipo: 'erro', texto: response.data.message || 'Erro ao excluir produto' });
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao excluir produto. Tente novamente mais tarde.' });
    }
  };

  // Função para alternar destaque do produto
  const alternarDestaque = async (produto: Produto) => {
    try {
      const response = await axios.put(`/api/produtos/${produto._id}`, {
        emDestaque: !produto.emDestaque
      });
      
      if (response.data.success) {
        const novoStatus = !produto.emDestaque;
        setMensagem({ 
          tipo: 'sucesso', 
          texto: `Produto ${novoStatus ? 'adicionado aos destaques' : 'removido dos destaques'}!` 
        });
        
        // Atualizar o estado local sem precisar recarregar todos os produtos
        setProdutos(produtos.map(p => 
          p._id === produto._id ? { ...p, emDestaque: novoStatus } : p
        ));
      } else {
        setMensagem({ tipo: 'erro', texto: response.data.message || 'Erro ao atualizar destaque' });
      }
    } catch (error) {
      console.error('Erro ao alternar destaque:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao atualizar destaque. Tente novamente mais tarde.' });
    }
  };

  // Função para alternar disponibilidade do produto
  const alternarDisponibilidade = async (produto: Produto) => {
    try {
      const response = await axios.put(`/api/produtos/${produto._id}`, {
        disponivel: !produto.disponivel
      });
      
      if (response.data.success) {
        const novoStatus = !produto.disponivel;
        setMensagem({ 
          tipo: 'sucesso', 
          texto: `Produto ${novoStatus ? 'ativado' : 'desativado'} com sucesso!` 
        });
        
        // Atualizar o estado local sem precisar recarregar todos os produtos
        setProdutos(produtos.map(p => 
          p._id === produto._id ? { ...p, disponivel: novoStatus } : p
        ));
      } else {
        setMensagem({ tipo: 'erro', texto: response.data.message || 'Erro ao atualizar disponibilidade' });
      }
    } catch (error) {
      console.error('Erro ao alternar disponibilidade:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao atualizar disponibilidade. Tente novamente mais tarde.' });
    }
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
              <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Produtos</h1>
              <Link href="/admin/produtos/novo" className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md shadow-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Novo Produto
              </Link>
            </div>
            
            {/* Mensagem de feedback */}
            {mensagem && (
              <div className={`mb-4 p-4 rounded ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {mensagem.texto}
                <button 
                  className="float-right font-bold" 
                  onClick={() => setMensagem(null)}
                >
                  &times;
                </button>
              </div>
            )}
            
            {/* Filtros e busca */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <form onSubmit={realizarBusca} className="flex flex-wrap gap-4 items-end">
                <div className="w-full md:w-auto flex-1">
                  <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar produto
                  </label>
                  <input
                    type="text"
                    id="busca"
                    placeholder="Nome, descrição ou tag..."
                    className="input-field w-full"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
                
                <div className="w-full md:w-auto md:flex-1">
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    id="categoria"
                    className="input-field w-full"
                    value={categoria}
                    onChange={(e) => {
                      setCategoria(e.target.value);
                      setPaginaAtual(1);
                    }}
                  >
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <button type="submit" className="btn-primary h-10">
                    Buscar
                  </button>
                </div>
              </form>
            </div>
            
            {/* Tabela de produtos */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700"></div>
                  <p className="mt-2 text-gray-600">Carregando produtos...</p>
                </div>
              ) : erro ? (
                <div className="p-8 text-center text-red-600">
                  {erro}
                  <button 
                    className="block mx-auto mt-4 text-amber-700 hover:text-amber-900"
                    onClick={carregarProdutos}
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : produtos.length === 0 ? (
                <div className="p-8 text-center text-gray-600">
                  Nenhum produto encontrado.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                            Produto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                            Categoria
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                            Preço
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                            Estoque
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {produtos.map((produto) => (
                          <tr key={produto._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-amber-100 rounded-md flex items-center justify-center text-amber-700 flex-shrink-0">
                                  {produto.imagens && produto.imagens.length > 0 ? (
                                    <img
                                      src={produto.imagens[0]}
                                      alt={produto.nome}
                                      className="h-10 w-10 rounded-md object-cover"
                                    />
                                  ) : (
                                    <span>🏺</span>
                                  )}
                                </div>
                                <div className="ml-4 overflow-hidden">
                                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{produto.nome}</div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">Artesão: {produto.artesao}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 truncate">{produto.categoria}</div>
                            </td>
                            <td className="px-6 py-4">
                              {produto.precoPromocional ? (
                                <div>
                                  <div className="text-sm text-gray-500 line-through">
                                    R$ {produto.preco.toFixed(2)}
                                  </div>
                                  <div className="text-sm font-medium text-green-600">
                                    R$ {produto.precoPromocional.toFixed(2)}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-900">
                                  R$ {produto.preco.toFixed(2)}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm ${produto.estoque === 0 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                {produto.estoque}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col space-y-1">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${produto.disponivel ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {produto.disponivel ? 'Ativo' : 'Inativo'}
                                </span>
                                {produto.emDestaque && (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                    Destaque
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end space-x-1">
                                <button 
                                  onClick={() => alternarDestaque(produto)}
                                  className={`px-2 py-1 rounded text-xs ${produto.emDestaque ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}
                                  title={produto.emDestaque ? 'Remover dos destaques' : 'Adicionar aos destaques'}
                                >
                                  {produto.emDestaque ? 'Remover' : 'Destacar'}
                                </button>
                                <button 
                                  onClick={() => alternarDisponibilidade(produto)}
                                  className={`px-2 py-1 rounded text-xs ${produto.disponivel ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                                  title={produto.disponivel ? 'Desativar produto' : 'Ativar produto'}
                                >
                                  {produto.disponivel ? 'Desativar' : 'Ativar'}
                                </button>
                                <Link
                                  href={`/admin/produtos/editar/${produto._id}`}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                                  title="Editar produto"
                                >
                                  Editar
                                </Link>
                                <button
                                  onClick={() => excluirProduto(produto._id)}
                                  className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                                  title="Excluir produto"
                                >
                                  Excluir
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
                    <div className="px-6 py-3 flex justify-center space-x-1">
                      <button
                        onClick={() => setPaginaAtual(page => Math.max(1, page - 1))}
                        disabled={paginaAtual === 1}
                        className={`px-3 py-1 rounded ${paginaAtual === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                      >
                        &laquo;
                      </button>
                      
                      {[...Array(totalPaginas)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPaginaAtual(i + 1)}
                          className={`px-3 py-1 rounded ${paginaAtual === i + 1 ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setPaginaAtual(page => Math.min(totalPaginas, page + 1))}
                        disabled={paginaAtual === totalPaginas}
                        className={`px-3 py-1 rounded ${paginaAtual === totalPaginas ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                      >
                        &raquo;
                      </button>
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