'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { FaShoppingCart, FaHeart, FaShare, FaArrowLeft } from 'react-icons/fa';
import { formatarMoeda } from '@/utils/formatters';
import { Produto } from '@/models/produto';
import Estrelas from '@/components/Estrelas';
import Loading from '@/components/Loading';

export default function DetalhesProduto() {
  const params = useParams();
  const router = useRouter();
  const { adicionarItem } = useCarrinho();
  const [loading, setLoading] = useState(true);
  const [produto, setProduto] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [produtosRelacionados, setProdutosRelacionados] = useState<Produto[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduto = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/produtos/${params.id}`);
        if (response.data.success) {
          setProduto(response.data.produto);
          
          // Buscar produtos relacionados
          const responseRelacionados = await axios.get(`/api/produtos?categoria=${response.data.produto.categoria}&limit=4`);
          if (responseRelacionados.data.success) {
            // Filtrar o produto atual dos relacionados
            const relacionadosFiltrados = responseRelacionados.data.produtos.filter(
              (p: Produto) => p._id !== response.data.produto._id
            ).slice(0, 4);
            setProdutosRelacionados(relacionadosFiltrados);
          }
        } else {
          toast.error('Erro ao carregar produto.');
          router.push('/produtos');
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        toast.error('Não foi possível carregar o produto.');
        router.push('/produtos');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduto();
    }
  }, [params.id, router]);

  const handleDecrementarQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  const handleIncrementarQuantidade = () => {
    if (produto && quantidade < produto.quantidade) {
      setQuantidade(quantidade + 1);
    } else {
      toast.error('Quantidade máxima disponível em estoque atingida.');
    }
  };

  const handleAdicionarAoCarrinho = async () => {
    if (!produto) return;
    
    setAddingToCart(true);
    
    try {
      adicionarItem({
        produtoId: produto._id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0] : '',
        quantidade
      });
      
      toast.success('Produto adicionado ao carrinho!');
      
      // Não redirecionar após adicionar ao carrinho
      // Apenas manter o usuário na página atual
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar produto ao carrinho.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleComprarAgora = async () => {
    if (!produto) return;
    
    setAddingToCart(true);
    
    try {
      adicionarItem({
        produtoId: produto._id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0] : '',
        quantidade
      });
      
      toast.success('Produto adicionado ao carrinho!');
  
      // Redirecionar para o carrinho
      router.push('/carrinho');
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar produto ao carrinho.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
    
  if (!produto) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
        <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
        <Link href="/produtos" className="inline-block bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700">
          Voltar para a loja
          </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navegação de Migalhas */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/produtos" className="hover:text-amber-600">Produtos</Link>
            <span className="mx-2">/</span>
            <Link href={`/produtos?categoria=${produto.categoria}`} className="hover:text-amber-600">
              {produto.categoria}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{produto.nome}</span>
          </div>
        </div>
      </div>
        
      {/* Detalhes do produto */}
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/produtos" 
          className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Voltar para produtos
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Galeria de imagens */}
            <div className="md:w-1/2 p-6">
              <div className="relative h-96 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                {produto.imagens && produto.imagens.length > 0 ? (
                <Image 
                    src={produto.imagens[imagemAtiva]}
                  alt={produto.nome}
                  fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">Imagem não disponível</span>
                  </div>
                )}

                {produto.quantidade === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-red-600 text-white px-6 py-2 rounded-full text-lg font-bold transform rotate-45">
                      Esgotado
                    </div>
                  </div>
                )}
              </div>
              
              {produto.imagens && produto.imagens.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {produto.imagens.map((imagem, index) => (
                    <button
                      key={index}
                      onClick={() => setImagemAtiva(index)}
                      className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                        imagemAtiva === index ? 'border-amber-500' : 'border-transparent'
                      }`}
                    >
                      <div className="relative w-full h-full">
                      <Image 
                        src={imagem}
                        alt={`${produto.nome} - imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Informações do produto */}
            <div className="md:w-1/2 p-6 flex flex-col">
              <div className="flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{produto.nome}</h1>
                
                {produto.artesao && (
                  <p className="text-gray-600 mb-4">
                    Artesão: <span className="font-medium">{produto.artesao}</span>
                  </p>
                )}
              
              <div className="flex items-center mb-4">
                  <Estrelas 
                    avaliacao={produto.avaliacao || 0} 
                    tamanho={20} 
                    espacamento={2}
                  />
                  <span className="text-gray-600 ml-2">
                    ({produto.totalAvaliacoes || 0} avaliações)
                </span>
              </div>
              
              <div className="mb-6">
                  <p className="text-3xl font-bold text-amber-600">
                    {formatarMoeda(produto.preco)}
                  </p>
                  {produto.precoOriginal && produto.precoOriginal > produto.preco && (
                    <p className="text-gray-500 line-through mt-1">
                      {formatarMoeda(produto.precoOriginal)}
                    </p>
                  )}
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Descrição</h2>
                  <p className="text-gray-700">{produto.descricao}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Categoria</h3>
                    <p>{produto.categoria}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Disponibilidade</h3>
                    <p>
                      {produto.quantidade > 0 
                        ? `${produto.quantidade} em estoque` 
                        : 'Fora de estoque'}
                    </p>
                  </div>
                  {produto.material && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Material</h3>
                      <p>{produto.material}</p>
                    </div>
                  )}
                  {produto.dimensoes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Dimensões</h3>
                      <p>{produto.dimensoes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                {produto.quantidade > 0 ? (
                  <>
                    <div className="flex items-center mb-6">
                      <span className="text-gray-700 mr-4">Quantidade:</span>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={handleDecrementarQuantidade}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Diminuir quantidade"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-l border-r border-gray-300">{quantidade}</span>
                        <button 
                          onClick={handleIncrementarQuantidade}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleAdicionarAoCarrinho}
                        disabled={addingToCart}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors"
                >
                        {addingToCart ? (
                          <span className="inline-block animate-spin mr-2">⟳</span>
                        ) : (
                          <FaShoppingCart className="mr-2" />
                        )}
                  Adicionar ao Carrinho
                      </button>
                      
                      <button
                        onClick={handleComprarAgora}
                        disabled={addingToCart}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors"
                      >
                        Comprar Agora
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="bg-red-100 text-red-800 p-4 rounded-md text-center">
                    <p className="font-medium">Este produto está esgotado no momento.</p>
                    <p className="text-sm mt-1">Confira outros produtos semelhantes abaixo.</p>
                  </div>
                )}
                
                <div className="mt-6 flex items-center justify-between">
                  <button className="flex items-center text-gray-600 hover:text-amber-600">
                    <FaHeart className="mr-2" />
                    Adicionar aos Favoritos
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-amber-600">
                    <FaShare className="mr-2" />
                    Compartilhar
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Produtos relacionados */}
        {produtosRelacionados.length > 0 && (
        <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Relacionados</h2>
            
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtosRelacionados.map((produto) => (
              <Link key={produto._id} href={`/produtos/${produto._id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    {produto.imagens && produto.imagens.length > 0 ? (
                      <Image 
                        src={produto.imagens[0]}
                        alt={produto.nome}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">Sem imagem</span>
                      </div>
                    )}
                    </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{produto.nome}</h3>
                    <p className="text-amber-600 font-bold">{formatarMoeda(produto.preco)}</p>
                    <div className="flex items-center mt-2">
                      <Estrelas 
                        avaliacao={produto.avaliacao || 0} 
                        tamanho={16} 
                        espacamento={1}
                      />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
    </div>
  );
} 