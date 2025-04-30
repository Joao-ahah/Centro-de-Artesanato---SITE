'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/providers/CartProvider';
import { useState } from 'react';

export default function CarrinhoPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    subtotal, 
    frete, 
    total, 
    isGiftWrapping, 
    toggleGiftWrapping, 
    couponCode, 
    setCouponCode, 
    applyCoupon,
    discount
  } = useCart();

  // Estado para controle de loading quando aplicar cupom
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Função para aplicar cupom com loading
  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true);
    // Simular delay de rede
    setTimeout(() => {
      applyCoupon();
      setIsApplyingCoupon(false);
    }, 800);
  };

  // Valor do embrulho para presente
  const giftWrapValue = isGiftWrapping ? 10 : 0;
  
  // Valor do desconto
  const discountValue = (subtotal * discount) / 100;

  return (
    <div className="bg-amber-50 min-h-screen py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Meu Carrinho</h1>
        
        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Lista de itens */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-amber-900">Produtos ({items.length})</h2>
                </div>
                
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row">
                        {/* Imagem do produto */}
                        <div className="h-32 w-32 flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 flex items-center justify-center relative overflow-hidden rounded-md bg-amber-100">
                          {item.imagem ? (
                            <Image 
                              src={item.imagem} 
                              alt={item.nome} 
                              fill
                              sizes="128px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="text-5xl">🏺</div>
                          )}
                        </div>
                        
                        {/* Detalhes do produto */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                <Link href={`/produtos/${item.id}`} className="hover:text-amber-700">
                                  {item.nome}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">Artesão: {item.artesao}</p>
                            </div>
                            <p className="text-lg font-bold text-amber-900 sm:ml-4">
                              R$ {(item.preco * item.quantidade).toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
                            <div className="flex items-center mb-4 sm:mb-0">
                              <label htmlFor={`quantidade-${item.id}`} className="mr-2 text-sm text-gray-600">
                                Quantidade:
                              </label>
                              <div className="flex border border-gray-300 rounded">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                  disabled={item.quantidade <= 1}
                                >
                                  -
                                </button>
                                <input 
                                  type="number" 
                                  id={`quantidade-${item.id}`}
                                  value={item.quantidade}
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  min="1"
                                  className="w-12 text-center border-x border-gray-300"
                                />
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex space-x-4">
                              <button className="text-amber-700 hover:text-amber-900 text-sm font-medium">
                                Salvar para depois
                              </button>
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="p-4 border-t border-gray-200">
                  <Link href="/produtos" className="text-amber-700 hover:text-amber-900 flex items-center">
                    <span>← Continuar comprando</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Resumo do pedido */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-amber-900 mb-6">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800 font-medium">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({discount}%)</span>
                      <span>-R$ {discountValue.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {isGiftWrapping && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Embrulho para presente</span>
                      <span className="text-gray-800 font-medium">R$ {giftWrapValue.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span className="text-gray-800 font-medium">R$ {frete.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-gray-800 font-semibold">Total</span>
                    <span className="text-amber-900 font-bold text-xl">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="embrulharPresente"
                      checked={isGiftWrapping}
                      onChange={toggleGiftWrapping}
                      className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="embrulharPresente" className="ml-2 text-sm text-gray-700">
                      Embrulhar para presente (+R$ 10,00)
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="cupom" className="block text-sm font-medium text-gray-700 mb-2">
                    Cupom de desconto
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="cupom"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 rounded-r-none border border-gray-300 rounded-l-md shadow-sm px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Digite seu código"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode}
                      className={`bg-amber-600 text-white rounded-l-none rounded-r-md px-4 py-2 font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isApplyingCoupon ? 'Aplicando...' : 'Aplicar'}
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="mt-2 text-sm text-green-600">
                      Cupom aplicado com sucesso! {discount}% de desconto.
                    </p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md px-4 py-3 w-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                    Finalizar Compra
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Ao finalizar a compra, você concorda com nossos <Link href="/termos" className="text-amber-700">Termos e Condições</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold text-amber-900 mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-8">
              Parece que você ainda não adicionou nenhum produto ao carrinho.
            </p>
            <Link href="/produtos" className="bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md px-8 py-3 inline-block transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
              Explorar Produtos
            </Link>
          </div>
        )}
        
        {/* Produtos recomendados */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Você também pode gostar</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-amber-100">
                  {/* Placeholder para imagem - em produção, substituir por imagens reais */}
                  <div className="w-full h-full flex items-center justify-center text-amber-500 text-5xl">
                    🎁
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Produto Recomendado {id}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-900">R$ 59,90</span>
                    <button className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md px-3 py-1 transition-colors">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 