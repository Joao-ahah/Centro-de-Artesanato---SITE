'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { FaShoppingCart, FaHeart, FaShare, FaArrowLeft, FaStar, FaEnvelope, FaTimes } from 'react-icons/fa';
import { formatarMoeda } from '@/utils/formatters';
import { Produto } from '@/models/produto';
import Estrelas from '@/components/Estrelas';
import Loading from '@/components/Loading';
import AvaliacaoModal from '@/components/AvaliacaoModal';

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
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
  const [showEncomendaModal, setShowEncomendaModal] = useState(false);
  const [encomendaData, setEncomendaData] = useState({
    nome: '',
    email: '',
    telefone: '',
    quantidade: '',
    observacoes: '',
    prazoDesejado: ''
  });
  const [enviandoEncomenda, setEnviandoEncomenda] = useState(false);

  // Função para recarregar o produto após uma avaliação
  const recarregarProduto = async () => {
    try {
      const response = await axios.get(`/api/produtos/${params.id}`);
      if (response.data.success) {
        setProduto(response.data.produto);
      }
    } catch (error) {
      console.error('Erro ao recarregar produto:', error);
    }
  };

  useEffect(() => {
    // Fetch do produto
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

  // Função para decrementar a quantidade
  const handleDecrementarQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  // Função para incrementar a quantidade
  const handleIncrementarQuantidade = () => {
    if (produto && quantidade < produto.quantidade) {
      setQuantidade(quantidade + 1);
    } else {
      toast.error('Quantidade máxima disponível em estoque atingida.');
    }
  };

  // Função para adicionar ao carrinho
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
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar produto ao carrinho.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Função para comprar agora
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
      router.push('/carrinho');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar produto ao carrinho.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Função para abrir modal de encomenda
  const handleSolicitarEncomenda = () => {
    setShowEncomendaModal(true);
  };

  // Função para lidar com mudanças no formulário de encomenda
  const handleEncomendaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEncomendaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para enviar solicitação de encomenda
  const handleEnviarEncomenda = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!encomendaData.nome || !encomendaData.email || !encomendaData.quantidade) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setEnviandoEncomenda(true);

    try {
      const response = await axios.post('/api/encomendas', {
        produtoId: produto?._id,
        produtoNome: produto?.nome,
        ...encomendaData
      });

      if (response.data.success) {
        toast.success('Solicitação de encomenda enviada com sucesso! Entraremos em contato em breve.');
        setShowEncomendaModal(false);
        setEncomendaData({
          nome: '',
          email: '',
          telefone: '',
          quantidade: '',
          observacoes: '',
          prazoDesejado: ''
        });
      } else {
        throw new Error(response.data.message || 'Erro ao enviar solicitação');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao enviar solicitação de encomenda.');
      console.error('Erro ao enviar encomenda:', error);
    } finally {
      setEnviandoEncomenda(false);
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
      {/* Modal de Encomenda */}
      {showEncomendaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Solicitar Encomenda</h2>
                <button
                  onClick={() => setShowEncomendaModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">Produto: {produto.nome}</h3>
                <p className="text-amber-700 text-sm">
                  Para grandes quantidades ou produtos personalizados, solicite um orçamento.
                  Entraremos em contato em até 24 horas.
                </p>
              </div>

              <form onSubmit={handleEnviarEncomenda}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={encomendaData.nome}
                      onChange={handleEncomendaChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={encomendaData.email}
                      onChange={handleEncomendaChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={encomendaData.telefone}
                      onChange={handleEncomendaChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade desejada <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="quantidade"
                      name="quantidade"
                      min="1"
                      value={encomendaData.quantidade}
                      onChange={handleEncomendaChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="prazoDesejado" className="block text-sm font-medium text-gray-700 mb-1">
                      Prazo desejado
                    </label>
                    <input
                      type="text"
                      id="prazoDesejado"
                      name="prazoDesejado"
                      value={encomendaData.prazoDesejado}
                      onChange={handleEncomendaChange}
                      placeholder="Ex: 15 dias, 1 mês..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
                    Observações e personalizações
                  </label>
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    rows={4}
                    value={encomendaData.observacoes}
                    onChange={handleEncomendaChange}
                    placeholder="Descreva detalhes específicos, cores, tamanhos, personalizações..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowEncomendaModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviandoEncomenda}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {enviandoEncomenda ? 'Enviando...' : 'Solicitar Orçamento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Avaliação */}
      {showAvaliacaoModal && produto && (
        <AvaliacaoModal
          produtoId={produto._id}
          produtoNome={produto.nome}
          onClose={() => setShowAvaliacaoModal(false)}
          onAvaliacaoEnviada={recarregarProduto}
        />
      )}

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
      
      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Botão voltar */}
        <Link href="/produtos" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6">
          <FaArrowLeft className="mr-2" /> Voltar para produtos
        </Link>

        {/* Detalhes do produto */}
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
                  <button 
                    onClick={() => setShowAvaliacaoModal(true)}
                    className="ml-4 text-sm text-amber-600 hover:text-amber-800 flex items-center"
                  >
                    <FaStar className="mr-1" /> Avaliar produto
                  </button>
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
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row gap-3">
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

                      {/* Botão de Encomenda */}
                      <button
                        onClick={handleSolicitarEncomenda}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors"
                      >
                        <FaEnvelope className="mr-2" />
                        Solicitar Encomenda (Grandes Quantidades)
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-100 text-red-800 p-4 rounded-md text-center">
                      <p className="font-medium">Este produto está esgotado no momento.</p>
                      <p className="text-sm mt-1">Confira outros produtos semelhantes abaixo.</p>
                    </div>
                    
                    {/* Mesmo com produto esgotado, permitir encomenda */}
                    <button
                      onClick={handleSolicitarEncomenda}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors"
                    >
                      <FaEnvelope className="mr-2" />
                      Solicitar Encomenda
                    </button>
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
        
        {/* Produtos relacionados */}
        {produtosRelacionados.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Relacionados</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {produtosRelacionados.map((produtoRelacionado) => (
                <Link key={produtoRelacionado._id} href={`/produtos/${produtoRelacionado._id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      {produtoRelacionado.imagens && produtoRelacionado.imagens.length > 0 ? (
                        <Image 
                          src={produtoRelacionado.imagens[0]}
                          alt={produtoRelacionado.nome}
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
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                        {produtoRelacionado.nome}
                      </h3>
                      <p className="text-amber-600 font-bold">
                        {formatarMoeda(produtoRelacionado.preco)}
                      </p>
                      <div className="flex items-center mt-2">
                        <Estrelas 
                          avaliacao={produtoRelacionado.avaliacao || 0} 
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
    </div>
  );
} 