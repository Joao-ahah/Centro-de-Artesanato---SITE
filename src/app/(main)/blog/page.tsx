'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

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
  visualizacoes: number;
  tags: string[];
}

export default function BlogPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Carregar notícias da API
  useEffect(() => {
    carregarNoticias();
  }, [paginaAtual, categoriaFiltro]);

  const carregarNoticias = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('pagina', paginaAtual.toString());
      params.append('limite', '6');
      
      if (categoriaFiltro) {
        params.append('categoria', categoriaFiltro);
      }
      
      if (termoBusca) {
        params.append('busca', termoBusca);
      }

      const response = await axios.get(`/api/noticias?${params.toString()}`);
      
      if (response.data.success) {
        setNoticias(response.data.noticias);
        setTotalPaginas(response.data.paginacao.paginas);
      } else {
        setErro('Erro ao carregar notícias');
        // Usar dados de exemplo em caso de erro
        setNoticias(noticiasExemplo);
      }
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      setErro('Erro ao carregar notícias');
      setNoticias(noticiasExemplo);
    } finally {
      setLoading(false);
    }
  };

  const realizarBusca = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaAtual(1);
    carregarNoticias();
  };

  const limparFiltros = () => {
    setTermoBusca('');
    setCategoriaFiltro('');
    setPaginaAtual(1);
  };

  // Todas as categorias únicas
  const todasCategorias = Array.from(new Set(noticias.flatMap(noticia => noticia.categorias)));
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header do blog */}
      <div className="bg-amber-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog do Centro de Artesanato</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Notícias, eventos, histórias de artesãos e muito mais sobre o mundo do artesanato brasileiro
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="lg:flex lg:gap-12">
          {/* Posts do Blog */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Publicações Recentes</h2>
              {(termoBusca || categoriaFiltro) && (
                <button
                  onClick={limparFiltros}
                  className="text-amber-600 hover:text-amber-800 font-medium"
                >
                  Limpar Filtros
                </button>
              )}
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {erro}
              </div>
            )}
            
            {/* Lista de posts */}
            {noticias.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  Nenhuma notícia encontrada.
                </div>
                <button
                  onClick={limparFiltros}
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Ver Todas as Notícias
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {noticias.map((noticia) => (
                  <article key={noticia._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                      <div className="md:flex-shrink-0 md:w-64">
                        <img
                          src={noticia.imagem}
                          alt={noticia.titulo}
                          className="h-48 w-full object-cover md:h-full"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {noticia.categorias.map((categoria) => (
                            <span key={categoria} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                              {categoria}
                            </span>
                          ))}
                        </div>
                        <Link href={`/blog/${noticia.slug}`}>
                          <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-amber-700 transition-colors">
                            {noticia.titulo}
                          </h3>
                        </Link>
                        <p className="text-gray-600 mb-4">{noticia.resumo}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <span>{noticia.autor}</span>
                          <span className="mx-2">•</span>
                          <time dateTime={noticia.dataPublicacao}>
                            {new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </time>
                          <span className="mx-2">•</span>
                          <span>{noticia.visualizacoes} visualizações</span>
                        </div>
                        <div className="mt-4">
                          <Link href={`/blog/${noticia.slug}`} className="text-amber-600 hover:text-amber-800 font-medium">
                            Ler artigo completo →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            
            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                    disabled={paginaAtual === 1}
                    className="px-4 py-2 text-gray-500 bg-white rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                    <button
                      key={pagina}
                      onClick={() => setPaginaAtual(pagina)}
                      className={`px-4 py-2 rounded-md ${
                        pagina === paginaAtual
                          ? 'text-white bg-amber-600'
                          : 'text-gray-700 bg-white border hover:bg-gray-50'
                      }`}
                    >
                      {pagina}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                    disabled={paginaAtual === totalPaginas}
                    className="px-4 py-2 text-gray-500 bg-white rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 mt-10 lg:mt-0">
            {/* Busca */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Buscar no Blog</h3>
              <form onSubmit={realizarBusca} className="flex">
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-l-md flex-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-r-md transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>
            
            {/* Categorias */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Categorias</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setCategoriaFiltro('');
                      setPaginaAtual(1);
                    }}
                    className={`text-gray-700 hover:text-amber-600 transition-colors flex items-center w-full text-left ${
                      !categoriaFiltro ? 'text-amber-600 font-medium' : ''
                    }`}
                  >
                    <span className="mr-2">•</span>
                    Todas as Categorias
                  </button>
                </li>
                {todasCategorias.map((categoria) => (
                  <li key={categoria}>
                    <button
                      onClick={() => {
                        setCategoriaFiltro(categoria);
                        setPaginaAtual(1);
                      }}
                      className={`text-gray-700 hover:text-amber-600 transition-colors flex items-center w-full text-left ${
                        categoriaFiltro === categoria ? 'text-amber-600 font-medium' : ''
                      }`}
                    >
                      <span className="mr-2">•</span>
                      {categoria}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Inscrição Newsletter */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Receba as últimas notícias sobre artesanato brasileiro diretamente no seu e-mail.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Inscrever-se
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dados de exemplo (fallback)
const noticiasExemplo: Noticia[] = [
  {
    _id: '1',
    titulo: 'Feira de Artesanato de Primavera: Conheça os Destaques',
    slug: 'feira-artesanato-primavera',
    resumo: 'A Feira de Artesanato de Primavera traz o melhor do artesanato nacional com foco em peças que celebram a estação das flores.',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imagem: 'https://images.unsplash.com/photo-1555639594-48ba11f2c095',
    autor: 'Maria Oliveira',
    categorias: ['Eventos', 'Feira'],
    publicado: true,
    dataPublicacao: '2023-09-05',
    visualizacoes: 150,
    tags: ['feira', 'primavera', 'artesanato']
  },
  {
    _id: '2',
    titulo: 'Workshop de Cerâmica Tradicional com Mestre Artesão',
    slug: 'workshop-ceramica-tradicional',
    resumo: 'Aprenda técnicas ancestrais de cerâmica com o renomado mestre artesão José da Silva em um workshop exclusivo.',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imagem: 'https://images.unsplash.com/photo-1565193566173-7a0af771d71a',
    autor: 'Carlos Santos',
    categorias: ['Workshop', 'Cerâmica'],
    publicado: true,
    dataPublicacao: '2023-08-20',
    visualizacoes: 89,
    tags: ['workshop', 'ceramica', 'tradicional']
  }
]; 