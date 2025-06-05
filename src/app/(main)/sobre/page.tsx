'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

interface Artesao {
  _id: string;
  nome: string;
  especialidade: string;
  descricao: string;
  imagem?: string;
  estado: string;
  cidade: string;
  ativo: boolean;
}

export default function SobrePage() {
  const [artesaosDestaque, setArtesaosDestaque] = useState<Artesao[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar artesãos da API
  useEffect(() => {
    carregarArtesaos();
  }, []);

  const carregarArtesaos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/artesaos?limit=4');
      
      if (response.data.success) {
        setArtesaosDestaque(response.data.artesaos);
      } else {
        // Usar dados de exemplo em caso de erro
        setArtesaosDestaque(artesaosExemplo);
      }
    } catch (error) {
      console.error('Erro ao carregar artesãos:', error);
      setArtesaosDestaque(artesaosExemplo);
    } finally {
      setLoading(false);
    }
  };

  // Dados da equipe
  const equipe = [
    {
      nome: 'Fernanda Lima',
      cargo: 'Diretora Executiva',
      imagem: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop'
    },
    {
      nome: 'Carlos Mendes',
      cargo: 'Curador & Especialista em Artesanato',
      imagem: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop'
    },
    {
      nome: 'Juliana Costa',
      cargo: 'Gestora de Comunidades',
      imagem: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop'
    }
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-amber-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre o Centro de Artesanato</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Valorizando e preservando a rica tradição artesanal brasileira desde 2023
          </p>
        </div>
      </section>
      
      {/* Nossa História */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="lg:flex items-center gap-12">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <img
                src="https://images.unsplash.com/photo-1602766682749-c5bcc5657072?w=800&auto=format&fit=crop"
                alt="Centro de Artesanato"
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-amber-900">Nossa História</h2>
              <p className="text-gray-700 mb-4">
                O Centro de Artesanato nasceu da paixão de um grupo de entusiastas do artesanato brasileiro, preocupados 
                com a preservação e valorização das técnicas tradicionais que formam parte importante do patrimônio cultural 
                do nosso país.
              </p>
              <p className="text-gray-700 mb-4">
                Fundado em 2023, nosso centro tem como missão criar uma ponte entre os artesãos talentosos de todas as 
                regiões do Brasil e consumidores que valorizam produtos autênticos, feitos à mão e carregados de história 
                e significado.
              </p>
              <p className="text-gray-700">
                Acreditamos que o artesanato é muito mais que um produto – é uma forma de expressão cultural que conta 
                histórias sobre as pessoas, as comunidades e as tradições brasileiras, contribuindo para a sustentabilidade 
                econômica e social de inúmeras famílias em todo o país.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Nossa Missão, Visão e Valores */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-amber-900">Missão, Visão e Valores</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Missão</h3>
              <p className="text-gray-600 text-center">
                Promover e valorizar o artesanato brasileiro, conectando artesãos a um mercado justo e 
                consciente, enquanto preservamos tradições culturais e impulsionamos o desenvolvimento sustentável.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Visão</h3>
              <p className="text-gray-600 text-center">
                Ser reconhecido como o principal centro de referência para o artesanato brasileiro, 
                celebrando a diversidade cultural e transformando vidas através da arte manual.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Valores</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-amber-600">•</span>
                  <span>Autenticidade e Preservação Cultural</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-amber-600">•</span>
                  <span>Comércio Justo e Transparência</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-amber-600">•</span>
                  <span>Sustentabilidade e Responsabilidade Social</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-amber-600">•</span>
                  <span>Inovação com Respeito às Tradições</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-amber-600">•</span>
                  <span>Colaboração e Comunidade</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Nossos Artesãos */}
      <section className="py-16" id="artesaos">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-amber-900">Nossos Artesãos</h2>
          <p className="text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Conheça alguns dos talentosos artesãos que fazem parte do nosso centro. Cada um traz consigo técnicas 
            únicas e histórias inspiradoras que se refletem em seus trabalhos excepcionais.
          </p>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando artesãos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {artesaosDestaque.map((artesao) => (
                <div key={artesao._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                  <div className="relative h-64">
                    <img
                      src={artesao.imagem || `https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=300&h=300&fit=crop&seed=${artesao._id}`}
                      alt={artesao.nome}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-amber-600 text-white px-3 py-1 text-sm">
                      {artesao.estado}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1 text-gray-800">{artesao.nome}</h3>
                    <p className="text-amber-600 font-medium mb-3">{artesao.especialidade}</p>
                    <p className="text-gray-600 mb-4">{artesao.descricao}</p>
                    <Link href={`/artesaos/${artesao._id}`} className="text-amber-700 hover:text-amber-900 font-medium">
                      Ver perfil completo →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/artesaos" className="bg-amber-600 hover:bg-amber-700 text-white py-3 px-8 rounded-lg transition-colors inline-block">
              Conhecer Todos os Artesãos
            </Link>
          </div>
        </div>
      </section>
      
      {/* Nossa Equipe */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-amber-900">Nossa Equipe</h2>
          <p className="text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Conheça as pessoas dedicadas que trabalham todos os dias para promover e valorizar o artesanato brasileiro.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {equipe.map((membro, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <img
                    src={membro.imagem}
                    alt={membro.nome}
                    className="w-full h-full object-cover rounded-full shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{membro.nome}</h3>
                <p className="text-amber-600 font-medium">{membro.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Estatísticas */}
      <section className="py-16 bg-amber-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nosso Impacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-amber-100">Artesãos Parceiros</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-amber-100">Produtos Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-amber-100">Estados Representados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-amber-100">Clientes Satisfeitos</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-amber-900">Faça Parte da Nossa História</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Seja você um artesão talentoso ou alguém que valoriza produtos autênticos e únicos, 
            convidamos você a fazer parte da nossa comunidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contato" className="bg-amber-600 hover:bg-amber-700 text-white py-3 px-8 rounded-lg transition-colors">
              Entre em Contato
            </Link>
            <Link href="/produtos" className="bg-white hover:bg-gray-50 text-amber-600 border-2 border-amber-600 py-3 px-8 rounded-lg transition-colors">
              Explore Nossos Produtos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Dados de exemplo (fallback)
const artesaosExemplo: Artesao[] = [
  {
    _id: '1',
    nome: 'Maria Silva',
    especialidade: 'Cerâmica Artesanal',
    descricao: 'Com mais de 20 anos de experiência, Maria cria peças únicas de cerâmica inspiradas na cultura nordestina.',
    imagem: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=300&h=300&fit=crop',
    estado: 'Pernambuco',
    cidade: 'Recife',
    ativo: true
  },
  {
    _id: '2',
    nome: 'João Santos',
    especialidade: 'Tecelagem Manual',
    descricao: 'João aprendeu a tecer com sua avó e hoje mantém viva a tradição da tecelagem manual em teares tradicionais.',
    imagem: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
    estado: 'Minas Gerais',
    cidade: 'Belo Horizonte',
    ativo: true
  },
  {
    _id: '3',
    nome: 'Ana Costa',
    especialidade: 'Esculturas em Madeira',
    descricao: 'Utilizando técnicas ancestrais, Ana transforma madeiras nativas em esculturas que contam histórias brasileiras.',
    imagem: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    estado: 'Amazonas',
    cidade: 'Manaus',
    ativo: true
  },
  {
    _id: '4',
    nome: 'Pedro Oliveira',
    especialidade: 'Couro Trançado',
    descricao: 'Pedro é reconhecido por suas técnicas de trançado em couro, criando peças utilitárias e decorativas de alta qualidade.',
    imagem: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    estado: 'Rio Grande do Sul',
    cidade: 'Porto Alegre',
    ativo: true
  }
]; 