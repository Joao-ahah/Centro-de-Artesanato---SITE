export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: { id: string } }) {
  // Encontrar o produto pelo ID para gerar metadata dinâmica
  const produto = produtosExemplo.find(p => p.id === params.id);
  
  return {
    title: produto ? `${produto.nome} | Centro de Artesanato` : 'Produto | Centro de Artesanato',
    description: produto ? produto.descricao.substring(0, 160) : 'Detalhes do produto artesanal',
  };
}

export const generateStaticParams = async () => {
  // Gerar parâmetros para todos os produtos de exemplo
  return produtosExemplo.map(produto => ({
    id: produto.id,
  }));
};

import Image from 'next/image';
import Link from 'next/link';

// Produtos de exemplo
const produtosExemplo = [
  {
    id: '1',
    nome: 'Cerâmica Marajoara',
    preco: 149.90,
    descricao: 'Vaso decorativo inspirado na arte marajoara, produzido por artesãos da região do Marajó, no Pará. Cada peça carrega a tradição ancestral desta arte que remonta a mais de 1000 anos.',
    imagens: [
      'https://images.unsplash.com/photo-1565193566173-7a0af771d71a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      'https://images.unsplash.com/photo-1577979749830-f1d742b96791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80'
    ],
    categoria: 'ceramica',
    categoriaNome: 'Cerâmica',
    emEstoque: 15,
    artesao: 'Maria da Silva',
    origem: 'Ilha de Marajó, Pará',
    dimensoes: '25cm x 15cm',
    peso: '1.2kg',
    materiais: ['Argila', 'Tinta natural', 'Verniz']
  },
  {
    id: '2',
    nome: 'Rede Artesanal',
    preco: 239.90,
    descricao: 'Rede tradicional nordestina em algodão natural, tecida à mão por artesãs do interior do Ceará. Ideal para relaxar e trazer um toque de regionalismo ao seu espaço.',
    imagens: [
      'https://images.unsplash.com/photo-1583260146211-0ee249945ad8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      'https://images.unsplash.com/photo-1617713964959-d9a36bbc7b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80'
    ],
    categoria: 'texteis',
    categoriaNome: 'Têxteis',
    emEstoque: 8,
    artesao: 'Associação de Artesãs do Sertão',
    origem: 'Quixadá, Ceará',
    dimensoes: '2.2m x 1.4m',
    peso: '0.9kg',
    materiais: ['Algodão natural', 'Corantes naturais']
  },
  {
    id: '3',
    nome: 'Cesto de Palha',
    preco: 89.90,
    descricao: 'Cesto de palha trançado à mão por artesãs do Vale do Ribeira, utilizando técnicas tradicionais passadas de geração em geração. Perfeito para organização e decoração.',
    imagens: [
      'https://images.unsplash.com/photo-1635431726133-253809e9db5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
      'https://images.unsplash.com/photo-1632121541471-92a8e6336fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80'
    ],
    categoria: 'trancados',
    categoriaNome: 'Trançados',
    emEstoque: 22,
    artesao: 'Comunidade Quilombola do Vale do Ribeira',
    origem: 'Vale do Ribeira, São Paulo',
    dimensoes: '30cm x 25cm x 20cm',
    peso: '0.5kg',
    materiais: ['Palha de bananeira', 'Fibras naturais']
  },
  {
    id: '4',
    nome: 'Escultura em Madeira',
    preco: 299.90,
    descricao: 'Escultura feita à mão em madeira de lei reciclada por artesãos do interior de Minas Gerais. Cada peça é única, com entalhes que destacam a beleza natural da madeira.',
    imagens: [
      'https://images.unsplash.com/photo-1635363638580-c2809d049eee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      'https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80'
    ],
    categoria: 'madeira',
    categoriaNome: 'Madeira',
    emEstoque: 5,
    artesao: 'João de Barro Ateliê',
    origem: 'São João del-Rei, Minas Gerais',
    dimensoes: '40cm x 15cm x 12cm',
    peso: '2.3kg',
    materiais: ['Madeira de demolição', 'Cera natural', 'Verniz']
  }
];

// Função para formatar preço
const formatarPreco = (preco: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(preco);
};

export default function ProdutoDetalhePage({ params }: { params: { id: string } }) {
  const id = params.id;
  
  // Encontrar o produto com base no ID
  const produto = produtosExemplo.find(p => p.id === id);
  
  // Encontrar produtos relacionados
  const produtosRelacionados = produto 
    ? produtosExemplo.filter(p => p.id !== id && p.categoria === produto.categoria).slice(0, 3)
    : [];
    
  if (!produto) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
          <Link href="/produtos" className="text-amber-600 hover:text-amber-700">
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Navegação de migalhas de pão */}
        <div className="mb-8">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-amber-600">
              Início
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/produtos" className="text-gray-500 hover:text-amber-600">
              Produtos
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href={`/produtos?categoria=${produto.categoria}`} className="text-gray-500 hover:text-amber-600">
              {produto.categoriaNome}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{produto.nome}</span>
          </nav>
        </div>
        
        {/* Informações do produto */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Galeria de imagens */}
            <div className="md:w-1/2 p-6">
              <div className="relative h-80 sm:h-96 md:h-[500px] rounded-lg overflow-hidden mb-4">
                <Image 
                  src={produto.imagens[0]}
                  alt={produto.nome}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              
              {produto.imagens.length > 1 && (
                <div className="flex space-x-2 justify-center">
                  {produto.imagens.map((imagem: string, index: number) => (
                    <div
                      key={index}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                        index === 0 
                          ? 'border-amber-600 opacity-100 scale-105' 
                          : 'border-gray-200 opacity-70'
                      }`}
                    >
                      <Image 
                        src={imagem}
                        alt={`${produto.nome} - imagem ${index + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Informações e compra */}
            <div className="md:w-1/2 p-6 md:border-l border-gray-200">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{produto.nome}</h1>
              
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-amber-600 mr-4">
                  {formatarPreco(produto.preco)}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  produto.emEstoque > 10 
                    ? 'bg-green-100 text-green-800' 
                    : produto.emEstoque > 0 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                }`}>
                  {produto.emEstoque > 10 
                    ? 'Em estoque' 
                    : produto.emEstoque > 0 
                      ? `Apenas ${produto.emEstoque} ${produto.emEstoque === 1 ? 'unidade' : 'unidades'}`
                      : 'Esgotado'
                  }
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">{produto.descricao}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500">Artesão:</span>
                    <span className="text-gray-800 font-medium">{produto.artesao}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Origem:</span>
                    <span className="text-gray-800 font-medium">{produto.origem}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Dimensões:</span>
                    <span className="text-gray-800 font-medium">{produto.dimensoes}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Peso:</span>
                    <span className="text-gray-800 font-medium">{produto.peso}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="text-gray-500 text-sm">Materiais:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {produto.materiais.map((material: string, index: number) => (
                      <span 
                        key={index}
                        className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <Link 
                  href="#"
                  className="block w-full py-3 px-6 text-center rounded-md font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                  Adicionar ao Carrinho
                </Link>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Os recursos do carrinho estão disponíveis apenas no cliente
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Produtos relacionados */}
        {produtosRelacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Relacionados</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtosRelacionados.map((relacionado) => (
                <Link 
                  key={relacionado.id} 
                  href={`/produtos/${relacionado.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 overflow-hidden">
                      <Image 
                        src={relacionado.imagens[0]}
                        alt={relacionado.nome}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">{relacionado.nome}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-700 font-bold">
                          {formatarPreco(relacionado.preco)}
                        </span>
                        <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                          {relacionado.categoriaNome}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 