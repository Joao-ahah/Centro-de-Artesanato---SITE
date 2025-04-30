'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  // Estado para armazenar produtos em destaque
  const [produtosDestaque, setProdutosDestaque] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [emailNewsletter, setEmailNewsletter] = useState('');

  // Estado para controlar o slide atual do banner
  const [slideAtual, setSlideAtual] = useState(0);

  // Imagens do banner carrossel
  const bannerImagens = [
    {
      url: 'https://images.unsplash.com/photo-1528671839653-1f8eb059174c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      titulo: 'Artesanato Tradicional Brasileiro',
      subtitulo: 'Conheça o melhor da produção artesanal do Brasil'
    },
    {
      url: 'https://images.unsplash.com/photo-1617142584114-364f0b1b9300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      titulo: 'Cerâmica e Artesanato em Argila',
      subtitulo: 'Descubra as técnicas tradicionais e contemporâneas'
    },
    {
      url: 'https://images.unsplash.com/photo-1606509036992-4399d5c5afe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      titulo: 'Artesanato Sustentável',
      subtitulo: 'Arte e respeito ao meio ambiente em cada peça'
    }
  ];

  // Categorias principais
  const categorias = [
    { id: 1, nome: 'Cerâmica', icone: '🏺', cor: 'bg-amber-700', url: '/produtos?categoria=ceramica' },
    { id: 2, nome: 'Têxteis', icone: '🧶', cor: 'bg-emerald-700', url: '/produtos?categoria=texteis' },
    { id: 3, nome: 'Madeira', icone: '🪵', cor: 'bg-orange-800', url: '/produtos?categoria=madeira' },
    { id: 4, nome: 'Trançados', icone: '🧺', cor: 'bg-yellow-700', url: '/produtos?categoria=trancados' },
    { id: 5, nome: 'Adornos', icone: '💍', cor: 'bg-purple-900', url: '/produtos?categoria=adornos' },
    { id: 6, nome: 'Decoração', icone: '🏡', cor: 'bg-blue-800', url: '/produtos?categoria=decoracao' }
  ];

  // Efeito para avançar o slider automaticamente
  useEffect(() => {
    const intervalo = setInterval(() => {
      setSlideAtual((atual) => (atual === bannerImagens.length - 1 ? 0 : atual + 1));
    }, 5000);

    return () => clearInterval(intervalo);
  }, [bannerImagens.length]);

  // Efeito para carregar produtos em destaque
  useEffect(() => {
    const carregarProdutos = async () => {
      setCarregando(true);
      try {
        // Dados de exemplo, em produção conectaria com a API
        const produtosExemplo = [
          {
            id: 1,
            nome: 'Cerâmica Marajoara',
            preco: 149.90,
            descricao: 'Vaso decorativo inspirado na arte marajoara',
            imagem: 'https://images.unsplash.com/photo-1565193566173-7a0af771d71a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
            categoria: 'Cerâmica',
            emDestaque: true
          },
          {
            id: 2,
            nome: 'Rede Artesanal',
            preco: 239.90,
            descricao: 'Rede tradicional nordestina em algodão natural',
            imagem: 'https://images.unsplash.com/photo-1583260146211-0ee249945ad8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
            categoria: 'Têxteis',
            emDestaque: true
          },
          {
            id: 3,
            nome: 'Cesto de Palha',
            preco: 89.90,
            descricao: 'Cesto de palha trançado à mão por artesãs do Vale do Ribeira',
            imagem: 'https://images.unsplash.com/photo-1635431726133-253809e9db5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
            categoria: 'Trançados',
            emDestaque: true
          },
          {
            id: 4,
            nome: 'Escultura em Madeira',
            preco: 299.90,
            descricao: 'Escultura feita à mão em madeira de lei reciclada',
            imagem: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
            categoria: 'Madeira',
            emDestaque: true
          },
          {
            id: 5,
            nome: 'Bordado Nordestino',
            preco: 199.90,
            descricao: 'Kit com almofadas bordadas à mão por artesãs pernambucanas',
            imagem: 'https://images.unsplash.com/photo-1576096616585-f336dfa910ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
            categoria: 'Têxteis',
            emDestaque: true
          },
          {
            id: 6,
            nome: 'Colares Indígenas',
            preco: 79.90,
            descricao: 'Colar de sementes naturais da Amazônia, feito por comunidades indígenas',
            imagem: 'https://images.unsplash.com/photo-1644306014741-3dfef1d3bbcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
            categoria: 'Adornos',
            emDestaque: true
          }
        ];

        setProdutosDestaque(produtosExemplo);
      } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        toast.error('Não foi possível carregar os produtos em destaque');
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  // Função para lidar com a inscrição na newsletter
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailNewsletter || !emailNewsletter.includes('@')) {
      toast.error('Por favor, insira um email válido');
      return;
    }
    
    toast.success('Email cadastrado com sucesso! Você receberá nossas novidades.');
    setEmailNewsletter('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner principal com carrossel */}
      <div className="relative h-[500px] lg:h-[600px] overflow-hidden">
        {bannerImagens.map((banner, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              slideAtual === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
            <div 
              className="relative h-full w-full"
              style={{
                backgroundImage: `url(${banner.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl">
                {banner.titulo}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white max-w-2xl mb-8">
                {banner.subtitulo}
              </p>
              <Link 
                href="/produtos" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300"
              >
                Explorar Produtos
              </Link>
            </div>
          </div>
        ))}
        
        {/* Controles do carrossel */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-30">
          {bannerImagens.map((_, index) => (
            <button
              key={index}
              onClick={() => setSlideAtual(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                slideAtual === index ? 'bg-amber-500' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Categorias principais */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categorias.map((categoria) => (
            <Link 
              key={categoria.id} 
              href={categoria.url}
              className="group"
            >
              <div className={`${categoria.cor} text-white rounded-lg p-6 flex flex-col items-center justify-center text-center h-full transition-transform group-hover:scale-105`}>
                <span className="text-4xl mb-2">{categoria.icone}</span>
                <h3 className="font-medium">{categoria.nome}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Destaques</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Conheça nossa seleção de produtos artesanais em destaque. Peças únicas com história e tradição.
        </p>
        
        {carregando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosDestaque.map((produto) => (
              <Link 
                key={produto.id} 
                href={`/produtos/${produto.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-64 overflow-hidden">
                    <div 
                      className="absolute inset-0 transform duration-500 ease-in-out group-hover:scale-110" 
                      style={{
                        backgroundImage: `url(${produto.imagem})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">{produto.nome}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                      </span>
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
        
        <div className="text-center mt-10">
          <Link 
            href="/produtos" 
            className="inline-block bg-transparent border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-6 py-3 rounded-md font-medium transition-colors duration-300"
          >
            Ver todos os produtos
          </Link>
        </div>
      </section>
      
      {/* Sobre o Centro de Artesanato */}
      <section className="py-12 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="lg:flex lg:items-center">
            <div className="lg:w-1/2">
              <div className="relative h-80 lg:h-96 mb-10 lg:mb-0 overflow-hidden rounded-lg shadow-lg">
                <Image 
                  src="https://images.unsplash.com/photo-1528458422847-2b9d218d8e07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                  alt="Artesãos trabalhando"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Sobre o Centro de Artesanato</h2>
              <p className="text-gray-700 mb-4">
                O Centro de Artesanato é um espaço dedicado à valorização e divulgação do artesanato brasileiro. 
                Reunimos o trabalho de artesãos de diversas regiões do país, promovendo a preservação das técnicas tradicionais 
                e a inovação no artesanato contemporâneo.
              </p>
              <p className="text-gray-700 mb-6">
                Nossa missão é promover o desenvolvimento econômico e social das comunidades artesãs, 
                criando um canal de comercialização justo e sustentável, que respeita o valor cultural e 
                a história por trás de cada peça.
              </p>
              <Link 
                href="/sobre" 
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300"
              >
                Conheça nossa história
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 px-4 bg-amber-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Fique por dentro das novidades</h2>
          <p className="text-amber-100 mb-8">
            Cadastre-se para receber atualizações sobre novos produtos, eventos e histórias dos nossos artesãos.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={emailNewsletter}
              onChange={(e) => setEmailNewsletter(e.target.value)}
              placeholder="Seu melhor email"
              className="px-4 py-3 rounded-md flex-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300"
            >
              Inscrever-se
            </button>
          </form>
        </div>
      </section>
    </div>
  );
} 