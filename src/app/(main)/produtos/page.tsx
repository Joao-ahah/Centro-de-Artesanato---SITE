export const dynamic = 'force-static';

import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Produtos | Centro de Artesanato',
  description: 'Descubra peças únicas feitas à mão por artesãos de todo o Brasil.',
};

// Categorias disponíveis
const categorias = [
  { id: 'ceramica', nome: 'Cerâmica' },
  { id: 'texteis', nome: 'Têxteis' },
  { id: 'madeira', nome: 'Madeira' },
  { id: 'trancados', nome: 'Trançados' },
  { id: 'adornos', nome: 'Adornos' },
  { id: 'decoracao', nome: 'Decoração' }
];

// Função para formatar preço
const formatarPreco = (preco: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(preco);
};

// Dados de exemplo dos produtos
const produtosExemplo = [
  {
    id: 1,
    nome: 'Cerâmica Marajoara',
    preco: 149.90,
    descricao: 'Vaso decorativo inspirado na arte marajoara',
    imagem: 'https://images.unsplash.com/photo-1565193566173-7a0af771d71a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    categoria: 'ceramica',
    categoriaNome: 'Cerâmica',
    emDestaque: true,
    dataAdicionado: '2023-10-15'
  },
  {
    id: 2,
    nome: 'Rede Artesanal',
    preco: 239.90,
    descricao: 'Rede tradicional nordestina em algodão natural',
    imagem: 'https://images.unsplash.com/photo-1583260146211-0ee249945ad8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    categoria: 'texteis',
    categoriaNome: 'Têxteis',
    emDestaque: true,
    dataAdicionado: '2023-10-12'
  },
  {
    id: 3,
    nome: 'Cesto de Palha',
    preco: 89.90,
    descricao: 'Cesto de palha trançado à mão por artesãs do Vale do Ribeira',
    imagem: 'https://images.unsplash.com/photo-1635431726133-253809e9db5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
    categoria: 'trancados',
    categoriaNome: 'Trançados',
    emDestaque: true,
    dataAdicionado: '2023-10-10'
  },
  {
    id: 4,
    nome: 'Escultura em Madeira',
    preco: 299.90,
    descricao: 'Escultura feita à mão em madeira de lei reciclada',
    imagem: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    categoria: 'madeira',
    categoriaNome: 'Madeira',
    emDestaque: true,
    dataAdicionado: '2023-10-05'
  },
  {
    id: 5,
    nome: 'Bordado Nordestino',
    preco: 199.90,
    descricao: 'Kit com almofadas bordadas à mão por artesãs pernambucanas',
    imagem: 'https://images.unsplash.com/photo-1576096616585-f336dfa910ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
    categoria: 'texteis',
    categoriaNome: 'Têxteis',
    emDestaque: true,
    dataAdicionado: '2023-09-28'
  },
  {
    id: 6,
    nome: 'Colares Indígenas',
    preco: 79.90,
    descricao: 'Colar de sementes naturais da Amazônia, feito por comunidades indígenas',
    imagem: 'https://images.unsplash.com/photo-1644306014741-3dfef1d3bbcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    categoria: 'adornos',
    categoriaNome: 'Adornos',
    emDestaque: true,
    dataAdicionado: '2023-09-20'
  },
  {
    id: 7,
    nome: 'Bonecos de Barro',
    preco: 129.90,
    descricao: 'Conjunto de bonecos decorativos de barro, inspirados no Mestre Vitalino',
    imagem: 'https://images.unsplash.com/photo-1594971077507-4b9f6b2832b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
    categoria: 'ceramica',
    categoriaNome: 'Cerâmica',
    emDestaque: false,
    dataAdicionado: '2023-09-15'
  },
  {
    id: 8,
    nome: 'Centro de Mesa em Macramê',
    preco: 159.90,
    descricao: 'Centro de mesa trançado à mão em macramê com fios naturais',
    imagem: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
    categoria: 'decoracao',
    categoriaNome: 'Decoração',
    emDestaque: false,
    dataAdicionado: '2023-09-10'
  },
  {
    id: 9,
    nome: 'Escultura em Capim Dourado',
    preco: 289.90,
    descricao: 'Escultura decorativa feita de capim dourado do Jalapão',
    imagem: 'https://images.unsplash.com/photo-1471666875520-c75081f42081?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    categoria: 'decoracao',
    categoriaNome: 'Decoração',
    emDestaque: false,
    dataAdicionado: '2023-09-05'
  },
  {
    id: 10,
    nome: 'Tábua de Madeira Rústica',
    preco: 119.90,
    descricao: 'Tábua para servir alimentos feita de madeira de demolição',
    imagem: 'https://images.unsplash.com/photo-1584589012423-471357901089?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    categoria: 'madeira',
    categoriaNome: 'Madeira',
    emDestaque: false,
    dataAdicionado: '2023-09-01'
  },
  {
    id: 11,
    nome: 'Brincos de Sementes',
    preco: 49.90,
    descricao: 'Brincos artesanais feitos com sementes naturais da Floresta Amazônica',
    imagem: 'https://images.unsplash.com/photo-1583316250284-20e801932d5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    categoria: 'adornos',
    categoriaNome: 'Adornos',
    emDestaque: false,
    dataAdicionado: '2023-08-25'
  },
  {
    id: 12,
    nome: 'Manta de Lã Natural',
    preco: 259.90,
    descricao: 'Manta artesanal tecida em tear manual com lã de ovelha natural',
    imagem: 'https://images.unsplash.com/photo-1612363148951-15f16817648f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
    categoria: 'texteis',
    categoriaNome: 'Têxteis',
    emDestaque: false,
    dataAdicionado: '2023-08-20'
  }
];

export default function ProdutosPage() {
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
        {/* Listagem de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {produtosExemplo.map((produto) => (
            <Link 
              key={produto.id} 
              href={`/produtos/${produto.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={produto.imagem}
                    alt={produto.nome}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">{produto.nome}</h3>
                    <p className="text-gray-600 text-sm mb-4">{produto.descricao}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700 font-bold">
                      {formatarPreco(produto.preco)}
                    </span>
                    <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                      {produto.categoriaNome}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 