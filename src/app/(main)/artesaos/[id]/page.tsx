'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

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
  redesSociais?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
}

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  precoPromocional?: number;
  descricao: string;
  imagens: string[];
  categoria: string;
  artesao?: string;
}

export default function PerfilArtesaoPage() {
  const params = useParams();
  const router = useRouter();
  const [artesao, setArtesao] = useState<Artesao | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sobre');

  useEffect(() => {
    if (params.id) {
      carregarArtesao();
      carregarProdutos();
    }
  }, [params.id]);

  const carregarArtesao = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/artesaos/${params.id}`);
      
      if (response.data.success) {
        setArtesao(response.data.artesao);
      } else {
        setErro('Artesão não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar artesão:', error);
      setErro('Erro ao carregar informações do artesão');
      // Usar dados de exemplo em caso de erro
      setArtesao(artesaoExemplo);
    } finally {
      setLoading(false);
    }
  };

  const carregarProdutos = async () => {
    try {
      // Em uma aplicação real, filtrar produtos por artesão
      const response = await axios.get(`/api/produtos?artesao=${params.id}&limite=6`);
      
      if (response.data.success) {
        setProdutos(response.data.produtos);
      } else {
        // Usar produtos de exemplo
        setProdutos(produtosExemplo);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProdutos(produtosExemplo);
    }
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(preco);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando perfil do artesão...</p>
        </div>
      </div>
    );
  }

  if (erro || !artesao) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Artesão não encontrado</h1>
          <p className="text-gray-600 mb-6">{erro || 'O artesão que você procura não existe ou foi removido.'}</p>
          <Link href="/artesaos" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors">
            Ver Todos os Artesãos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com foto e informações básicas */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Foto do artesão */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg">
                <Image
                  src={artesao.imagem || `https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=300&h=300&fit=crop&seed=${artesao._id}`}
                  alt={artesao.nome}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Informações básicas */}
            <div className="flex-grow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{artesao.nome}</h1>
                  <p className="text-xl text-amber-600 font-medium mb-4">{artesao.especialidade}</p>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{artesao.cidade}, {artesao.estado}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Artesão desde {formatarData(artesao.dataCriacao)}</span>
                  </div>
                </div>

                {/* Redes sociais e contato */}
                <div className="flex flex-col gap-4">
                  {/* Redes sociais */}
                  {artesao.redesSociais && (
                    <div className="flex gap-3">
                      {artesao.redesSociais.instagram && (
                        <a
                          href={artesao.redesSociais.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}
                      
                      {artesao.redesSociais.facebook && (
                        <a
                          href={artesao.redesSociais.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}
                      
                      {artesao.redesSociais.website && (
                        <a
                          href={artesao.redesSociais.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Botões de contato */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {artesao.telefone && (
                      <a
                        href={`tel:${artesao.telefone}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Ligar
                      </a>
                    )}
                    
                    {artesao.email && (
                      <a
                        href={`mailto:${artesao.email}`}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('sobre')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sobre'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sobre
            </button>
            <button
              onClick={() => setActiveTab('produtos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'produtos'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Produtos ({produtos.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'sobre' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sobre {artesao.nome}</h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {artesao.descricao}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Especialidade</h3>
                    <p className="text-gray-600">{artesao.especialidade}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Localização</h3>
                    <p className="text-gray-600">{artesao.cidade}, {artesao.estado}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Artesão desde</h3>
                    <p className="text-gray-600">{formatarData(artesao.dataCriacao)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      artesao.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {artesao.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'produtos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Produtos de {artesao.nome}
              </h2>
              <Link 
                href={`/produtos?artesao=${artesao._id}`}
                className="text-amber-600 hover:text-amber-800 font-medium"
              >
                Ver todos os produtos →
              </Link>
            </div>

            {produtos.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">🎨</div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600">
                  Este artesão ainda não possui produtos cadastrados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtos.map((produto) => (
                  <Link 
                    key={produto._id} 
                    href={`/produtos/${produto._id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          src={produto.imagens?.[0] || 'https://images.unsplash.com/photo-1565193566173-7a0af771d71a'}
                          alt={produto.nome}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {produto.precoPromocional && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                            -{Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100)}%
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                          {produto.nome}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{produto.descricao}</p>
                        
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
                            {produto.categoria}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botão voltar */}
      <div className="container mx-auto px-4 pb-8">
        <button
          onClick={() => router.back()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </button>
      </div>
    </div>
  );
}

// Dados de exemplo (fallback)
const artesaoExemplo: Artesao = {
  _id: '1',
  nome: 'Maria Silva',
  especialidade: 'Cerâmica Artesanal',
  descricao: 'Com mais de 20 anos de experiência, Maria cria peças únicas de cerâmica inspiradas na cultura nordestina. Suas obras refletem a tradição familiar passada de geração em geração, combinando técnicas ancestrais com um toque contemporâneo. Cada peça é cuidadosamente moldada à mão e queimada em forno tradicional, resultando em obras de arte funcionais que contam histórias.',
  estado: 'Pernambuco',
  cidade: 'Recife',
  imagem: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=300&h=300&fit=crop',
  telefone: '(81) 99999-9999',
  email: 'maria.silva@email.com',
  redesSociais: {
    instagram: 'https://instagram.com/mariasilva_ceramica',
    facebook: 'https://facebook.com/mariasilva.ceramica',
    website: 'https://mariasilva-ceramica.com.br'
  },
  ativo: true,
  dataCriacao: '2020-01-15',
  dataAtualizacao: '2023-10-15'
};

const produtosExemplo: Produto[] = [
  {
    _id: '1',
    nome: 'Vaso Decorativo Marajoara',
    preco: 149.90,
    descricao: 'Vaso decorativo inspirado na arte marajoara',
    imagens: ['https://images.unsplash.com/photo-1565193566173-7a0af771d71a'],
    categoria: 'Cerâmica',
    artesao: '1'
  },
  {
    _id: '2',
    nome: 'Conjunto de Pratos Artesanais',
    preco: 89.90,
    precoPromocional: 69.90,
    descricao: 'Conjunto com 4 pratos de cerâmica pintados à mão',
    imagens: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    categoria: 'Cerâmica',
    artesao: '1'
  }
]; 