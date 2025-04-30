import Image from 'next/image';
import Link from 'next/link';

export default function SobrePage() {
  // Dados de exemplo para artesãos em destaque
  const artesaosDestaque = [
    {
      id: 1,
      nome: 'Maria Silva',
      especialidade: 'Cerâmica Artesanal',
      descricao: 'Com mais de 20 anos de experiência, Maria cria peças únicas de cerâmica inspiradas na cultura nordestina.',
      imagem: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=300&h=300&fit=crop',
      estado: 'Pernambuco'
    },
    {
      id: 2,
      nome: 'João Santos',
      especialidade: 'Tecelagem Manual',
      descricao: 'João aprendeu a tecer com sua avó e hoje mantém viva a tradição da tecelagem manual em teares tradicionais.',
      imagem: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
      estado: 'Minas Gerais'
    },
    {
      id: 3,
      nome: 'Ana Costa',
      especialidade: 'Esculturas em Madeira',
      descricao: 'Utilizando técnicas ancestrais, Ana transforma madeiras nativas em esculturas que contam histórias brasileiras.',
      imagem: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
      estado: 'Amazonas'
    },
    {
      id: 4,
      nome: 'Pedro Oliveira',
      especialidade: 'Couro Trançado',
      descricao: 'Pedro é reconhecido por suas técnicas de trançado em couro, criando peças utilitárias e decorativas de alta qualidade.',
      imagem: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      estado: 'Rio Grande do Sul'
    }
  ];
  
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {artesaosDestaque.map((artesao) => (
              <div key={artesao.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="relative h-64">
                  <img
                    src={artesao.imagem}
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
                  <Link href={`/artesaos/${artesao.id}`} className="text-amber-700 hover:text-amber-900 font-medium">
                    Ver perfil completo →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/artesaos" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md transition-colors">
              Conheça todos os nossos artesãos
            </Link>
          </div>
        </div>
      </section>
      
      {/* Nossa Equipe */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-amber-900">Nossa Equipe</h2>
          <p className="text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Conheça as pessoas apaixonadas por artesanato que trabalham todos os dias para valorizar 
            e promover a arte manual brasileira.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {equipe.map((membro, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden text-center">
                <div className="h-64 relative">
                  <img
                    src={membro.imagem}
                    alt={membro.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800">{membro.nome}</h3>
                  <p className="text-amber-600">{membro.cargo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-amber-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Junte-se a Nós</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Seja como artesão, parceiro ou apoiador, você pode fazer parte dessa 
            jornada de valorização do artesanato brasileiro.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contato" className="bg-white text-amber-700 hover:bg-gray-100 px-6 py-3 rounded-md font-semibold transition-colors">
              Entre em Contato
            </Link>
            <Link href="/artesaos/cadastro" className="bg-amber-900 hover:bg-amber-950 text-white px-6 py-3 rounded-md font-semibold transition-colors">
              Cadastre-se como Artesão
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 