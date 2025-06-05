'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

interface Artesao {
  _id: string;
  nome: string;
  especialidade: string;
  descricao: string;
  estado: string;
  cidade: string;
  imagem?: string;
  ativo: boolean;
  dataCriacao: string;
}

export default function ArtesaosPage() {
  const [artesaos, setArtesaos] = useState<Artesao[]>([]);
  const [artesaosFiltrados, setArtesaosFiltrados] = useState<Artesao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  
  // Estados dos filtros
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [especialidadeFiltro, setEspecialidadeFiltro] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Carregar artesãos da API
  useEffect(() => {
    carregarArtesaos();
  }, []);

  // Aplicar filtros quando os estados mudarem
  useEffect(() => {
    aplicarFiltros();
  }, [artesaos, termoPesquisa, estadoFiltro, especialidadeFiltro]);

  const carregarArtesaos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/artesaos?limit=50');
      
      if (response.data.success) {
        setArtesaos(response.data.artesaos.filter((artesao: Artesao) => artesao.ativo));
      } else {
        setErro('Erro ao carregar artesãos');
        setArtesaos(artesaosExemplo);
      }
    } catch (error) {
      console.error('Erro ao carregar artesãos:', error);
      setArtesaos(artesaosExemplo);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let artesaosFiltrados = [...artesaos];

    // Filtro por termo de pesquisa
    if (termoPesquisa) {
      artesaosFiltrados = artesaosFiltrados.filter(artesao =>
        artesao.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        artesao.especialidade.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        artesao.descricao.toLowerCase().includes(termoPesquisa.toLowerCase())
      );
    }

    // Filtro por estado
    if (estadoFiltro) {
      artesaosFiltrados = artesaosFiltrados.filter(artesao =>
        artesao.estado.toLowerCase() === estadoFiltro.toLowerCase()
      );
    }

    // Filtro por especialidade
    if (especialidadeFiltro) {
      artesaosFiltrados = artesaosFiltrados.filter(artesao =>
        artesao.especialidade.toLowerCase().includes(especialidadeFiltro.toLowerCase())
      );
    }

    setArtesaosFiltrados(artesaosFiltrados);
  };

  const limparFiltros = () => {
    setTermoPesquisa('');
    setEstadoFiltro('');
    setEspecialidadeFiltro('');
  };

  // Obter listas únicas para os filtros
  const estadosUnicos = Array.from(new Set(artesaos.map(artesao => artesao.estado))).sort();
  const especialidadesUnicas = Array.from(new Set(artesaos.map(artesao => artesao.especialidade))).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando artesãos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <div className="bg-amber-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossos Artesãos</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Conheça os talentosos artesãos que fazem parte do nosso centro, 
            cada um com sua especialidade e história única.
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
                placeholder="Pesquisar artesãos..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Todos os Estados</option>
                  {estadosUnicos.map(estado => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por especialidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidade
                </label>
                <select
                  value={especialidadeFiltro}
                  onChange={(e) => setEspecialidadeFiltro(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Todas as Especialidades</option>
                  {especialidadesUnicas.map(especialidade => (
                    <option key={especialidade} value={especialidade}>
                      {especialidade}
                    </option>
                  ))}
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
                {artesaosFiltrados.length} artesão(ãos) encontrado(s)
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{artesaos.length}</div>
            <div className="text-gray-600">Artesãos Cadastrados</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{estadosUnicos.length}</div>
            <div className="text-gray-600">Estados Representados</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{especialidadesUnicas.length}</div>
            <div className="text-gray-600">Especialidades</div>
          </div>
        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {erro}
          </div>
        )}

        {/* Listagem de artesãos */}
        {artesaosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              Nenhum artesão encontrado com os filtros aplicados.
            </div>
            <button
              onClick={limparFiltros}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artesaosFiltrados.map((artesao) => (
              <Link 
                key={artesao._id} 
                href={`/artesaos/${artesao._id}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={artesao.imagem || `https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=300&h=300&fit=crop&seed=${artesao._id}`}
                      alt={artesao.nome}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 bg-amber-600 text-white px-3 py-1 text-sm">
                      {artesao.estado}
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                        {artesao.nome}
                      </h3>
                      <p className="text-amber-600 font-medium mb-3">{artesao.especialidade}</p>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{artesao.descricao}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="text-sm text-gray-500">
                        {artesao.cidade}
                      </div>
                      <div className="text-amber-600 font-medium text-sm group-hover:text-amber-800">
                        Ver perfil →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-amber-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Seja um Artesão Parceiro</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Você é um artesão e gostaria de fazer parte do nosso centro? 
            Entre em contato conosco e descubra como podemos ajudar a divulgar seu trabalho.
          </p>
          <Link 
            href="/contato" 
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg transition-colors inline-block"
          >
            Entre em Contato
          </Link>
        </div>
      </div>
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
    estado: 'Pernambuco',
    cidade: 'Recife',
    imagem: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=300&h=300&fit=crop',
    ativo: true,
    dataCriacao: '2020-01-15'
  },
  {
    _id: '2',
    nome: 'João Santos',
    especialidade: 'Tecelagem Manual',
    descricao: 'João aprendeu a tecer com sua avó e hoje mantém viva a tradição da tecelagem manual em teares tradicionais.',
    estado: 'Minas Gerais',
    cidade: 'Belo Horizonte',
    imagem: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
    ativo: true,
    dataCriacao: '2019-03-22'
  },
  {
    _id: '3',
    nome: 'Ana Costa',
    especialidade: 'Esculturas em Madeira',
    descricao: 'Utilizando técnicas ancestrais, Ana transforma madeiras nativas em esculturas que contam histórias brasileiras.',
    estado: 'Amazonas',
    cidade: 'Manaus',
    imagem: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    ativo: true,
    dataCriacao: '2021-07-10'
  },
  {
    _id: '4',
    nome: 'Pedro Oliveira',
    especialidade: 'Couro Trançado',
    descricao: 'Pedro é reconhecido por suas técnicas de trançado em couro, criando peças utilitárias e decorativas de alta qualidade.',
    estado: 'Rio Grande do Sul',
    cidade: 'Porto Alegre',
    imagem: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    ativo: true,
    dataCriacao: '2018-11-05'
  },
  {
    _id: '5',
    nome: 'Carla Mendes',
    especialidade: 'Bordados Tradicionais',
    descricao: 'Especialista em bordados tradicionais brasileiros, Carla preserva técnicas centenárias em suas criações.',
    estado: 'Ceará',
    cidade: 'Fortaleza',
    imagem: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
    ativo: true,
    dataCriacao: '2020-09-18'
  },
  {
    _id: '6',
    nome: 'Roberto Lima',
    especialidade: 'Instrumentos Musicais',
    descricao: 'Roberto constrói instrumentos musicais tradicionais brasileiros, mantendo viva a cultura musical do país.',
    estado: 'Bahia',
    cidade: 'Salvador',
    imagem: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    ativo: true,
    dataCriacao: '2017-04-12'
  }
]; 