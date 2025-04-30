'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  // Array de posts do blog (simulado)
  const blogPosts = [
    {
      id: '1',
      titulo: 'Feira de Artesanato de Primavera: Conheça os Destaques',
      slug: 'feira-artesanato-primavera',
      resumo: 'A Feira de Artesanato de Primavera traz o melhor do artesanato nacional com foco em peças que celebram a estação das flores.',
      conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.',
      imagem: 'https://images.unsplash.com/photo-1555639594-48ba11f2c095',
      data: '2023-09-05',
      autor: 'Maria Oliveira',
      categorias: ['Eventos', 'Feira']
    },
    {
      id: '2',
      titulo: 'Workshop de Cerâmica Tradicional com Mestre Artesão',
      slug: 'workshop-ceramica-tradicional',
      resumo: 'Aprenda técnicas ancestrais de cerâmica com o renomado mestre artesão José da Silva em um workshop exclusivo.',
      conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.',
      imagem: 'https://images.unsplash.com/photo-1565193566173-7a0af771d71a',
      data: '2023-08-20',
      autor: 'Carlos Santos',
      categorias: ['Workshop', 'Cerâmica']
    },
    {
      id: '3',
      titulo: 'Artesãos Selecionados para Programa de Mentoria 2023',
      slug: 'artesaos-programa-mentoria',
      resumo: 'Conheça os 15 artesãos de todo o Brasil selecionados para o programa de mentoria e apoio ao empreendedorismo artesanal.',
      conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.',
      imagem: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7',
      data: '2023-08-10',
      autor: 'Ana Pereira',
      categorias: ['Notícias', 'Capacitação']
    },
    {
      id: '4',
      titulo: 'Nova Coleção: Artesanato Contemporâneo do Nordeste',
      slug: 'colecao-artesanato-nordeste',
      resumo: 'Lançamos nossa nova coleção de artesanato contemporâneo com peças exclusivas produzidas por artesãos nordestinos.',
      conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.',
      imagem: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770',
      data: '2023-07-25',
      autor: 'Roberto Mendes',
      categorias: ['Lançamento', 'Coleção']
    },
    {
      id: '5',
      titulo: 'Parceria com Comunidades Quilombolas para Produção Sustentável',
      slug: 'parceria-comunidades-quilombolas',
      resumo: 'Nova iniciativa firma parceria com comunidades quilombolas para produção de artesanato sustentável com materiais nativos.',
      conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.',
      imagem: 'https://images.unsplash.com/photo-1617659258448-a782e85bd9e5',
      data: '2023-07-15',
      autor: 'Juliana Costa',
      categorias: ['Sustentabilidade', 'Comunidades']
    },
    {
      id: '6',
      titulo: 'Exposição Fotográfica: "Mãos que Transformam"',
      slug: 'exposicao-maos-que-transformam',
      resumo: 'Exposição de fotografias documenta o processo criativo de artesãos brasileiros e a transformação de materiais simples em arte.',
      conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.',
      imagem: 'https://images.unsplash.com/photo-1529066792305-5e4efa40fde9',
      data: '2023-07-01',
      autor: 'Marcelo Rocha',
      categorias: ['Exposição', 'Fotografia']
    }
  ];
  
  // Todas as categorias únicas
  const categoriasArray = blogPosts.flatMap(post => post.categorias);
  const todasCategorias = Array.from(new Set(categoriasArray));
  
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
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Publicações Recentes</h2>
            
            {/* Lista de posts */}
            <div className="space-y-10">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-64">
                      <img
                        src={post.imagem}
                        alt={post.titulo}
                        className="h-48 w-full object-cover md:h-full"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categorias.map((categoria) => (
                          <span key={categoria} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                            {categoria}
                          </span>
                        ))}
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-amber-700 transition-colors">
                          {post.titulo}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-4">{post.resumo}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{post.autor}</span>
                        <span className="mx-2">•</span>
                        <time dateTime={post.data}>
                          {new Date(post.data).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </time>
                      </div>
                      <div className="mt-4">
                        <Link href={`/blog/${post.slug}`} className="text-amber-600 hover:text-amber-800 font-medium">
                          Ler artigo completo →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {/* Paginação */}
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center space-x-2">
                <a href="#" className="px-4 py-2 text-gray-500 bg-white rounded-md border">
                  Anterior
                </a>
                <a href="#" className="px-4 py-2 text-white bg-amber-600 rounded-md">
                  1
                </a>
                <a href="#" className="px-4 py-2 text-gray-700 bg-white rounded-md border">
                  2
                </a>
                <a href="#" className="px-4 py-2 text-gray-700 bg-white rounded-md border">
                  3
                </a>
                <a href="#" className="px-4 py-2 text-gray-500 bg-white rounded-md border">
                  Próxima
                </a>
              </nav>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 mt-10 lg:mt-0">
            {/* Busca */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Buscar no Blog</h3>
              <form className="flex">
                <input
                  type="text"
                  placeholder="Buscar artigos..."
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
                {todasCategorias.map((categoria) => (
                  <li key={categoria}>
                    <Link href={`/blog/categoria/${categoria.toLowerCase()}`} className="text-gray-700 hover:text-amber-600 transition-colors flex items-center">
                      <span className="mr-2">•</span>
                      {categoria}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Inscrição Newsletter */}
            <div className="bg-amber-50 p-6 rounded-lg shadow-md mb-6 border border-amber-100">
              <h3 className="text-lg font-semibold mb-2">Receba Nossas Novidades</h3>
              <p className="text-gray-600 mb-4">
                Inscreva-se para receber as últimas notícias, eventos e conteúdo exclusivo.
              </p>
              <form>
                <input
                  type="email"
                  placeholder="Seu email"
                  className="px-4 py-2 border border-gray-300 rounded-md w-full mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Inscrever-se
                </button>
              </form>
            </div>
            
            {/* Eventos Próximos */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Próximos Eventos</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-medium">Feira de Primavera</h4>
                  <p className="text-sm text-gray-600">15 de Setembro, 2023</p>
                  <p className="text-sm text-gray-600">Centro Cultural São Paulo</p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-medium">Workshop de Macramê</h4>
                  <p className="text-sm text-gray-600">28 de Setembro, 2023</p>
                  <p className="text-sm text-gray-600">Sala de Oficinas - 2º andar</p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-medium">Exposição "Mãos que Criam"</h4>
                  <p className="text-sm text-gray-600">10-30 de Outubro, 2023</p>
                  <p className="text-sm text-gray-600">Galeria Central</p>
                </div>
              </div>
              <div className="mt-4">
                <a href="/eventos" className="text-amber-600 hover:text-amber-800 font-medium">
                  Ver todos os eventos →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 