import Image from 'next/image';
import Link from 'next/link';
import Slideshow, { SlideType } from '../components/Slideshow';

export default function Home() {
  // Slides para o slideshow
  const slides: SlideType[] = [
    {
      id: 1,
      imagem: '/slides/slide1.jpg',
      titulo: 'Centro de Artesanato',
      subtitulo: 'Descubra peças únicas feitas à mão com carinho e tradição por artesãos brasileiros',
      link: '/produtos',
      linkTexto: 'Explorar Produtos'
    },
    {
      id: 2,
      imagem: '/slides/slide1.jpg',
      titulo: 'Promoção de Inverno',
      subtitulo: 'Toda a linha de produtos em lã com 20% de desconto',
      link: '/produtos?categoria=texteis',
      linkTexto: 'Ver Ofertas'
    },
    {
      id: 3,
      imagem: 'https://images.unsplash.com/photo-1604006852748-903fccbc4019?q=80&w=1920&auto=format&fit=crop',
      titulo: 'Mês do Artesanato',
      subtitulo: 'Celebramos os artesãos brasileiros com produtos exclusivos',
      link: '/sobre',
      linkTexto: 'Conheça Nossa História'
    },
    {
      id: 4,
      imagem: 'https://images.unsplash.com/photo-1605883705077-8d3d73afef57?q=80&w=1920&auto=format&fit=crop',
      titulo: 'Peças Exclusivas',
      subtitulo: 'Decoração que transforma sua casa com a riqueza do artesanato brasileiro',
      link: '/produtos?categoria=decoracao',
      linkTexto: 'Ver Coleção'
    }
  ];

  // Produtos em destaque (simulados)
  const destaques = [
    {
      id: 1,
      nome: 'Vaso de Cerâmica Artesanal',
      preco: 89.90,
      imagem: '/produtos/vaso-ceramica.jpg',
      descricao: 'Vaso de cerâmica feito à mão com técnicas tradicionais.',
      categoria: 'Decoração'
    },
    {
      id: 2,
      nome: 'Tapete de Macramê',
      preco: 129.90,
      imagem: '/produtos/tapete-macrame.jpg',
      descricao: 'Tapete de macramê tecido à mão com cordas naturais.',
      categoria: 'Têxteis'
    },
    {
      id: 3,
      nome: 'Colar de Miçangas Coloridas',
      preco: 49.90,
      imagem: '/produtos/colar-micanga.jpg',
      descricao: 'Colar artesanal feito com miçangas coloridas.',
      categoria: 'Acessórios'
    },
    {
      id: 4,
      nome: 'Cesto de Palha Trançado',
      preco: 79.90,
      imagem: '/produtos/cesto-palha.jpg',
      descricao: 'Cesto de palha trançado à mão por artesãos locais.',
      categoria: 'Utilidades'
    }
  ];

  return (
    <div>
      {/* Slideshow principal */}
      <section className="relative h-screen">
        <Slideshow slides={slides} height="h-screen" />
      </section>

      {/* Categorias */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-amber-900">Nossas Categorias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {['Decoração', 'Têxteis', 'Acessórios', 'Utilidades'].map((categoria) => (
              <div key={categoria} className="card bg-white hover:bg-amber-100 p-6 text-center cursor-pointer">
                <div className="w-20 h-20 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-amber-800 text-2xl">🖼️</span>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">{categoria}</h3>
                <p className="text-amber-700">Explore nossa coleção de {categoria.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-2 text-amber-900">Produtos em Destaque</h2>
          <p className="text-center text-amber-700 mb-12">Conheça nossos produtos mais amados</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {destaques.map((produto) => (
              <div key={produto.id} className="card flex flex-col">
                <div className="relative h-64 bg-amber-100">
                  {/* Placeholder para imagem - em produção, substituir por imagens reais */}
                  <div className="w-full h-full flex items-center justify-center text-amber-500 text-6xl">
                    🏺
                  </div>
                  {/* <Image 
                    src={produto.imagem} 
                    alt={produto.nome} 
                    fill 
                    style={{objectFit: 'cover'}}
                  /> */}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <span className="text-sm text-amber-600 mb-1">{produto.categoria}</span>
                  <h3 className="text-lg font-semibold mb-2">{produto.nome}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{produto.descricao}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-amber-900">R$ {produto.preco.toFixed(2)}</span>
                    <button className="btn-primary text-sm">Adicionar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/produtos" className="btn-secondary">
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-amber-800 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Nossa História</h2>
            <div className="bg-amber-900/30 p-8 rounded-lg">
              <p className="text-lg mb-4">
                O Centro de Artesanato nasceu da paixão por preservar as técnicas tradicionais brasileiras e valorizar o trabalho dos artesãos locais.
              </p>
              <p className="text-lg mb-4">
                Desde 2010, reunimos os melhores artesãos do país para trazer até você peças únicas, feitas com materiais sustentáveis e técnicas passadas de geração em geração.
              </p>
              <p className="text-lg">
                Cada produto que você encontra em nossa loja carrega uma história, um pedaço da rica cultura brasileira e o talento incrível dos nossos artesãos.
              </p>
              <div className="mt-8 text-center">
                <Link href="/sobre" className="inline-block border-2 border-white text-white hover:bg-white hover:text-amber-900 font-semibold py-2 px-6 rounded-full transition duration-300">
                  Conheça Nossa História Completa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-amber-900">O Que Nossos Clientes Dizem</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                nome: 'Maria Silva',
                texto: 'As peças são maravilhosas! Comprei um vaso de cerâmica e ficou perfeito na minha sala. A qualidade é impressionante.',
                avaliacao: 5
              },
              {
                nome: 'João Oliveira',
                texto: 'Presente entregue no prazo e muito bem embalado. Minha esposa adorou o colar artesanal. Com certeza voltarei a comprar!',
                avaliacao: 5
              },
              {
                nome: 'Ana Pereira',
                texto: 'Adoro a história por trás de cada peça. Saber que estou ajudando artesãos brasileiros torna cada compra ainda mais especial.',
                avaliacao: 5
              }
            ].map((depoimento, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold">
                    {depoimento.nome.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{depoimento.nome}</h4>
                    <div className="flex text-amber-500">
                      {'★'.repeat(depoimento.avaliacao)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{depoimento.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-amber-100">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-amber-900">Fique por dentro das novidades</h2>
            <p className="text-amber-800 mb-8">Assine nossa newsletter e receba em primeira mão nossos lançamentos, promoções exclusivas e dicas de decoração.</p>
            
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="input-field flex-grow px-4 py-3"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap px-6">
                Inscrever-se
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
} 