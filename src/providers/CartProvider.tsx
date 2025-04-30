'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Interface para os itens do carrinho
export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
  artesao: string;
}

// Interface para o contexto do carrinho
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  frete: number;
  total: number;
  isGiftWrapping: boolean;
  toggleGiftWrapping: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
  discount: number;
}

// Criação do contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider do carrinho
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Estado para os itens do carrinho
  const [items, setItems] = useState<CartItem[]>([]);
  // Estado para embrulho de presente
  const [isGiftWrapping, setIsGiftWrapping] = useState(false);
  // Estado para código de cupom
  const [couponCode, setCouponCode] = useState('');
  // Estado para desconto aplicado
  const [discount, setDiscount] = useState(0);

  // Carregar itens do carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
    
    const savedGiftWrap = localStorage.getItem('giftWrap');
    if (savedGiftWrap) {
      setIsGiftWrapping(savedGiftWrap === 'true');
    }
    
    const savedDiscount = localStorage.getItem('discount');
    if (savedDiscount) {
      setDiscount(Number(savedDiscount));
    }
  }, []);

  // Salvar carrinho no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Salvar status de embrulho para presente
  useEffect(() => {
    localStorage.setItem('giftWrap', String(isGiftWrapping));
  }, [isGiftWrapping]);

  // Salvar valor do desconto
  useEffect(() => {
    localStorage.setItem('discount', String(discount));
  }, [discount]);

  // Adicionar item ao carrinho
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // Verificar se o item já existe no carrinho
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Se existe, aumentar a quantidade
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantidade += item.quantidade;
        return updatedItems;
      } else {
        // Se não existe, adicionar novo item
        return [...prevItems, item];
      }
    });
  };

  // Remover item do carrinho
  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Atualizar quantidade de um item
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantidade: quantity } : item
      )
    );
  };

  // Limpar carrinho
  const clearCart = () => {
    setItems([]);
    setDiscount(0);
    setCouponCode('');
  };

  // Alternar embrulho para presente
  const toggleGiftWrapping = () => {
    setIsGiftWrapping(prev => !prev);
  };

  // Aplicar cupom de desconto (simulado)
  const applyCoupon = () => {
    // Simulação de cupons válidos
    const validCoupons: Record<string, number> = {
      'ARTESANATO10': 10,
      'PROMO20': 20,
      'DESCONTO15': 15
    };
    
    if (couponCode && validCoupons[couponCode]) {
      setDiscount(validCoupons[couponCode]);
      // Mensagem de sucesso (poderia ser um toast)
      alert(`Cupom aplicado! ${validCoupons[couponCode]}% de desconto.`);
    } else {
      setDiscount(0);
      // Mensagem de erro (poderia ser um toast)
      alert('Cupom inválido ou expirado!');
    }
  };

  // Calcular número total de itens
  const itemCount = items.reduce((count, item) => count + item.quantidade, 0);
  
  // Calcular subtotal
  const subtotal = items.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  
  // Valor do frete (fixo para simplificar)
  const frete = items.length > 0 ? 15.90 : 0;
  
  // Valor do embrulho para presente
  const giftWrapValue = isGiftWrapping ? 10 : 0;
  
  // Calcular desconto
  const discountValue = (subtotal * discount) / 100;
  
  // Calcular total
  const total = subtotal + frete + giftWrapValue - discountValue;

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    frete,
    total,
    isGiftWrapping,
    toggleGiftWrapping,
    couponCode,
    setCouponCode,
    applyCoupon,
    discount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook personalizado para usar o contexto do carrinho
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
} 