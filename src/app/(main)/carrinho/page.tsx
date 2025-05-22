'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { FaTrash, FaArrowLeft, FaTag } from 'react-icons/fa';
import { formatarMoeda } from '@/utils/formatters';

export default function CarrinhoPage() {
  const router = useRouter();
  const { 
    itens, 
    removerItem, 
    atualizarQuantidade, 
    subtotal, 
    frete, 
    total, 
    embrulhoPresente, 
    alternarEmbrulhoPresente, 
    codigoCupom, 
    setCodigoCupom, 
    aplicarCupom,
    desconto
  } = useCarrinho();

  // Estado para controle de loading quando aplicar cupom
  const [aplicandoCupom, setAplicandoCupom] = useState(false);

  // Função para aplicar cupom com loading
  const handleAplicarCupom = () => {
    setAplicandoCupom(true);
    // Simular delay de rede
    setTimeout(() => {
      aplicarCupom();
      setAplicandoCupom(false);
    }, 800);
  };

  // Valor do embrulho para presente
  const valorEmbrulhoPresente = embrulhoPresente ? 10 : 0;
  
  // Valor do desconto
  const valorDesconto = (subtotal * desconto) / 100;

  // Ir para checkout
  const irParaCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="bg-amber-50 min-h-screen py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Meu Carrinho</h1>
        
        {itens.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Lista de itens */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-amber-900">Produtos ({itens.length})</h2>
                </div>
                
                <ul className="divide-y divide-gray-200">
                  {itens.map((item) => (
                    <li key={item.produtoId} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-center">
                        {/* Imagem do produto */}
                        <div className="w-24 h-24 sm:mr-6 mb-4 sm:mb-0 flex-shrink-0">
                          {item.imagem ? (
                            <div className="relative w-full h-full rounded-md overflow-hidden">
                              <Image
                                src={item.imagem}
                                alt={item.nome}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                              <span className="text-gray-400">Sem imagem</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Informações do produto */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                <Link href={`/produtos/${item.produtoId}`} className="hover:text-amber-700">
                                  {item.nome}
                                </Link>
                              </h3>
                            </div>
                            <p className="text-lg font-bold text-amber-900 sm:ml-4">
                              {formatarMoeda(item.preco * item.quantidade)}
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
                            <div className="flex items-center mb-4 sm:mb-0">
                              <span className="text-gray-700 mr-3">Quantidade:</span>
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button 
                                  onClick={() => item.quantidade > 1 && atualizarQuantidade(item.produtoId, item.quantidade - 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                  aria-label="Diminuir quantidade"
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 border-l border-r border-gray-300">{item.quantidade}</span>
                                <button 
                                  onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                  aria-label="Aumentar quantidade"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => removerItem(item.produtoId)}
                              className="flex items-center text-red-600 hover:text-red-800"
                            >
                              <FaTrash className="mr-2" />
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="p-4 border-t border-gray-200">
                  <Link 
                    href="/produtos" 
                    className="inline-flex items-center text-amber-600 hover:text-amber-800"
                  >
                    <FaArrowLeft className="mr-2" /> Continuar comprando
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Resumo do pedido */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-amber-900">Resumo do Pedido</h2>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatarMoeda(subtotal)}</span>
                    </div>
                    
                    {/* Frete */}
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span>{formatarMoeda(frete)}</span>
                    </div>
                    
                    {/* Embrulho para presente */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="giftWrap"
                          checked={embrulhoPresente}
                          onChange={alternarEmbrulhoPresente}
                          className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor="giftWrap" className="text-gray-700">Embrulho para presente</label>
                      </div>
                      <span>{embrulhoPresente ? formatarMoeda(valorEmbrulhoPresente) : 'R$ 0,00'}</span>
                    </div>
                    
                    {/* Desconto */}
                    {desconto > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto ({desconto}%):</span>
                        <span>-{formatarMoeda(valorDesconto)}</span>
                      </div>
                    )}
                    
                    {/* Linha divisória */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-amber-900">{formatarMoeda(total)}</span>
                      </div>
                    </div>
                    
                    {/* Código promocional */}
                    <div className="pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Código promocional</p>
                      <div className="flex">
                        <input
                          type="text"
                          value={codigoCupom}
                          onChange={(e) => setCodigoCupom(e.target.value)}
                          placeholder="Insira seu cupom"
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleAplicarCupom}
                          disabled={aplicandoCupom || !codigoCupom}
                          className="bg-amber-600 text-white px-4 py-2 rounded-r-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {aplicandoCupom ? (
                            <span className="inline-block animate-spin">⟳</span>
                          ) : (
                            <FaTag />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Use os cupons ARTESANATO10, PROMO20 ou DESCONTO15 para obter descontos.
                      </p>
                    </div>
                    
                    {/* Botão finalizar compra */}
                    <button
                      onClick={irParaCheckout}
                      className="w-full bg-amber-600 text-white py-3 px-4 rounded-md hover:bg-amber-700 transition-colors font-medium"
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos para continuar suas compras.</p>
            <Link
              href="/produtos"
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors"
            >
              Explorar Produtos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 