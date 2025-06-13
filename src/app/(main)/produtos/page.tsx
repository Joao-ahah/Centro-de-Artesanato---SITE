'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

// Categorias disponíveis
const categorias = [
  { id: '', nome: 'Todas as Categorias' },
  { id: 'ceramica', nome: 'Cerâmica' },
  { id: 'texteis', nome: 'Têxteis' },
  { id: 'madeira', nome: 'Madeira' },
  { id: 'trancados', nome: 'Trançados' },
  { id: 'adornos', nome: 'Adornos' },
  { id: 'decoracao', nome: 'Decoração' }
];

// Opções de ordenação
const opcoesOrdenacao = [
  { value: 'recentes', label: 'Mais Recentes' },
  { value: 'preco-menor', label: 'Menor Preço' },
  { value: 'preco-maior', label: 'Maior Preço' },
  { value: 'nome', label: 'Nome A-Z' },
  { value: 'avaliacao', label: 'Melhor Avaliação' }
];

// Interface para produto
interface Produto {
  _id: string;
  nome: string;
  preco: number;
  precoPromocional?: number;
  descricao: string;
  imagens: string[];
  categoria: string;
  categoriaNome: string;
  emDestaque: boolean;
  dataAdicionado: string;
  avaliacao?: number;
  numeroAvaliacoes?: number;
}

// Função para formatar preço
const formatarPreco = (preco: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(preco);
};

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  
  // Estados dos filtros
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');
  const [avaliacaoMin, setAvaliacaoMin] = useState('');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Carregar produtos da API
  useEffect(() => {
    carregarProdutos();
  }, []);

  // Aplicar filtros quando os estados mudarem
  useEffect(() => {
    aplicarFiltros();
  }, [produtos, termoPesquisa, categoriaFiltro, precoMin, precoMax, avaliacaoMin, ordenacao]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/produtos?limite=50');
      
      if (response.data.success) {
        // Mapear produtos para incluir dados de exemplo de avaliação
        const produtosComAvaliacao = response.data.produtos.map((produto: any) => ({
          ...produto,
          categoriaNome: produto.categoria,
          avaliacao: Math.random() * 2 + 3, // Avaliação entre 3 e 5
          numeroAvaliacoes: Math.floor(Math.random() * 50) + 5, // Entre 5 e 55 avaliações
          imagem: produto.imagens?.[0] || 'https://images.unsplash.com/photo-1565193566173-7a0af771d71a'
        }));
        
        setProdutos(produtosComAvaliacao);
      } else {
        setErro('Erro ao carregar produtos');
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      // Usar dados de exemplo em caso de erro
      setProdutos(produtosExemplo);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let produtosFiltrados = [...produtos];

    // Filtro por termo de pesquisa
    if (termoPesquisa) {
      produtosFiltrados = produtosFiltrados.filter(produto =>
        produto.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(termoPesquisa.toLowerCase())
      );
    }

    // Filtro por categoria
    if (categoriaFiltro) {
      produtosFiltrados = produtosFiltrados.filter(produto =>
        produto.categoria.toLowerCase() === categoriaFiltro.toLowerCase()
      );
    }

    // Filtro por preço mínimo
    if (precoMin) {
      produtosFiltrados = produtosFiltrados.filter(produto =>
        (produto.precoPromocional || produto.preco) >= parseFloat(precoMin)
      );
    }

    // Filtro por preço máximo
    if (precoMax) {
      produtosFiltrados = produtosFiltrados.filter(produto =>
        (produto.precoPromocional || produto.preco) <= parseFloat(precoMax)
      );
    }

    // Filtro por avaliação mínima
    if (avaliacaoMin) {
      produtosFiltrados = produtosFiltrados.filter(produto =>
        (produto.avaliacao || 0) >= parseFloat(avaliacaoMin)
      );
    }

    // Aplicar ordenação
    switch (ordenacao) {
      case 'preco-menor':
        produtosFiltrados.sort((a, b) => 
          (a.precoPromocional || a.preco) - (b.precoPromocional || b.preco)
        );
        break;
      case 'preco-maior':
        produtosFiltrados.sort((a, b) => 
          (b.precoPromocional || b.preco) - (a.precoPromocional || a.preco)
        );
        break;
      case 'nome':
        produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'avaliacao':
        produtosFiltrados.sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0));
        break;
      default: // recentes
        produtosFiltrados.sort((a, b) => 
          new Date(b.dataAdicionado || '').getTime() - new Date(a.dataAdicionado || '').getTime()
        );
    }

    setProdutosFiltrados(produtosFiltrados);
  };

  const limparFiltros = () => {
    setTermoPesquisa('');
    setCategoriaFiltro('');
    setPrecoMin('');
    setPrecoMax('');
    setAvaliacaoMin('');
    setOrdenacao('recentes');
  };

  // Renderizar estrelas de avaliação
  const renderizarEstrelas = (avaliacao: number) => {
    const estrelas = [];
    const avaliacaoArredondada = Math.round(avaliacao * 2) / 2; // Arredondar para 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= avaliacaoArredondada) {
        estrelas.push(
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      } else if (i - 0.5 <= avaliacaoArredondada) {
        estrelas.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="currentColor"/>
                <stop offset="50%" stopColor="transparent"/>
              </linearGradient>
            </defs>
            <path fill={`url(#half-${i})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      } else {
        estrelas.push(
          <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      }
    }
    
    return estrelas;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <div className="bg-amber-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Produtos Artesanais</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Descubra peças únicas feitas à mão por artesãos de todo o Brasil, 
            carregadas de tradição, história e cultura.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Barra de pesquisa */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros
            </button>
          </div>
        </div>

        {/* Painel de filtros */}
        {mostrarFiltros && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por preço mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Mínimo
                </label>
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  value={precoMin}
                  onChange={(e) => setPrecoMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Filtro por preço máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Máximo
                </label>
                <input
                  type="number"
                  placeholder="R$ 1000,00"
                  value={precoMax}
                  onChange={(e) => setPrecoMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Filtro por avaliação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação Mínima
                </label>
                <select
                  value={avaliacaoMin}
                  onChange={(e) => setAvaliacaoMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Todas</option>
                  <option value="4">4+ estrelas</option>
                  <option value="3">3+ estrelas</option>
                  <option value="2">2+ estrelas</option>
                  <option value="1">1+ estrela</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={limparFiltros}
                className="text-amber-600 hover:text-amber-800 font-medium"
              >
                Limpar Filtros
              </button>
              <div className="text-sm text-gray-600">
                {produtosFiltrados.length} produto(s) encontrado(s)
              </div>
            </div>
          </div>
        )}

        {/* Barra de ordenação */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            Mostrando {produtosFiltrados.length} de {produtos.length} produtos
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Ordenar por:
            </label>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {opcoesOrdenacao.map(opcao => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {erro}
          </div>
        )}

        {/* Listagem de produtos */}
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              Nenhum produto encontrado com os filtros aplicados.
            </div>
            <button
              onClick={limparFiltros}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosFiltrados.map((produto) => (
              <Link 
                key={produto._id} 
                href={`/produtos/${produto._id}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={produto.imagens?.[0] || 'https://images.unsplash.com/photo-1565193566173-7a0af771d71a'}
                      alt={produto.nome}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {produto.precoPromocional && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        -{Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                        {produto.nome}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{produto.descricao}</p>
                      
                      {/* Avaliação */}
                      {produto.avaliacao && (
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {renderizarEstrelas(produto.avaliacao)}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            ({produto.numeroAvaliacoes})
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        {produto.precoPromocional ? (
                          <>
                            <span className="text-amber-700 font-bold text-lg">
                              {formatarPreco(produto.precoPromocional)}
                            </span>
                            <span className="text-gray-500 line-through text-sm">
                              {formatarPreco(produto.preco)}
                            </span>
                          </>
                        ) : (
                          <span className="text-amber-700 font-bold text-lg">
                            {formatarPreco(produto.preco)}
                          </span>
                        )}
                      </div>
                      <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                        {produto.categoriaNome}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Dados de exemplo dos produtos (fallback)
const produtosExemplo = [
  {
    _id: '1',
    nome: 'Cerâmica Marajoara',
    preco: 149.90,
    descricao: 'Vaso decorativo inspirado na arte marajoara',
    imagem: 'https://images.unsplash.com/photo-1565193566173-7a0af771d71a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    imagens: ['https://images.unsplash.com/photo-1565193566173-7a0af771d71a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80'],
    categoria: 'ceramica',
    categoriaNome: 'Cerâmica',
    emDestaque: true,
    dataAdicionado: '2023-10-15',
    avaliacao: 4.5,
    numeroAvaliacoes: 23
  },
  {
    _id: '2',
    nome: 'Rede Artesanal',
    preco: 239.90,
    precoPromocional: 199.90,
    descricao: 'Rede tradicional nordestina em algodão natural',
    imagem: 'https://images.unsplash.com/photo-1583260146211-0ee249945ad8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    imagens: ['https://images.unsplash.com/photo-1583260146211-0ee249945ad8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80'],
    categoria: 'texteis',
    categoriaNome: 'Têxteis',
    emDestaque: true,
    dataAdicionado: '2023-10-12',
    avaliacao: 4.8,
    numeroAvaliacoes: 15
  }
]; 