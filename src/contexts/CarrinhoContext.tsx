'use client';

import { useCart } from '@/providers/CartProvider';

// Interface para os itens do carrinho
export interface ItemCarrinho {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
}

// Hook adaptador para usar o contexto do carrinho com nomes em português
export function useCarrinho() {
  const { 
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
  } = useCart();

  // Adaptar as funções para funcionarem com os novos nomes de campos
  const adicionarItem = (item: ItemCarrinho) => {
    addItem({
      id: item.produtoId,
      nome: item.nome,
      preco: item.preco,
      quantidade: item.quantidade,
      imagem: item.imagem,
      artesao: "Artesão" // Valor padrão já que não é fornecido na interface ItemCarrinho
    });
  };

  const removerItem = (produtoId: string) => {
    removeItem(produtoId);
  };

  const atualizarQuantidade = (produtoId: string, quantidade: number) => {
    updateQuantity(produtoId, quantidade);
  };

  const limparCarrinho = () => {
    clearCart();
  };

  return {
    itens: items.map(item => ({
      produtoId: item.id,
      nome: item.nome,
      preco: item.preco,
      quantidade: item.quantidade,
      imagem: item.imagem
    })),
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    totalItens: itemCount,
    subtotal,
    frete,
    total,
    embrulhoPresente: isGiftWrapping,
    alternarEmbrulhoPresente: toggleGiftWrapping,
    codigoCupom: couponCode,
    setCodigoCupom: setCouponCode,
    aplicarCupom: applyCoupon,
    desconto: discount
  };
} 