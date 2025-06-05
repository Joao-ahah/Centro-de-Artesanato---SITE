'use client';

import { useState } from 'react';
import { MP_PUBLIC_KEY } from '@/lib/mercadopago';

export interface PagamentoItem {
  title: string;
  description?: string;
  unit_price: number;
  quantity: number;
}

export interface DadosPagador {
  name?: string;
  surname?: string;
  email?: string;
  phone?: {
    area_code?: string;
    number?: string;
  };
  identification?: {
    type?: string;
    number?: string;
  };
  address?: {
    street_name?: string;
    street_number?: number;
    zip_code?: string;
  };
}

export interface UseMercadoPagoResponse {
  criarPreferencia: (items: PagamentoItem[], payer?: DadosPagador, external_reference?: string) => Promise<any>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useMercadoPago(): UseMercadoPagoResponse {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const criarPreferencia = async (
    items: PagamentoItem[], 
    payer?: DadosPagador, 
    external_reference?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      console.log('useMercadoPago: Criando preferência de pagamento');
      console.log('Items:', items);
      console.log('Payer:', payer);
      console.log('External Reference:', external_reference);

      // Validar itens
      if (!items || items.length === 0) {
        throw new Error('É necessário fornecer pelo menos um item para pagamento');
      }

      // Validar cada item
      for (const item of items) {
        if (!item.title || !item.unit_price || !item.quantity) {
          throw new Error('Cada item deve ter título, preço unitário e quantidade');
        }
        if (item.unit_price <= 0) {
          throw new Error('O preço unitário deve ser maior que zero');
        }
        if (item.quantity <= 0) {
          throw new Error('A quantidade deve ser maior que zero');
        }
      }

      // Chamar API para criar preferência
      const response = await fetch('/api/pagamento/criar-preferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          payer,
          external_reference
        }),
      });

      const data = await response.json();
      console.log('useMercadoPago: Resposta da API:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar preferência de pagamento');
      }

      if (!data.success) {
        throw new Error(data.message || 'Falha na criação da preferência');
      }

      console.log('useMercadoPago: Preferência criada com sucesso');
      return data.data;

    } catch (err: any) {
      console.error('useMercadoPago: Erro:', err);
      setError(err.message || 'Erro ao processar pagamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    criarPreferencia,
    loading,
    error,
    clearError
  };
}

// Hook para carregar o SDK do Mercado Pago
export function useMercadoPagoSDK() {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loadingSDK, setLoadingSDK] = useState(false);

  const loadSDK = async () => {
    if (sdkLoaded || loadingSDK) return;

    setLoadingSDK(true);
    
    try {
      // Verificar se o SDK já foi carregado
      if (typeof window !== 'undefined' && (window as any).MercadoPago) {
        setSdkLoaded(true);
        setLoadingSDK(false);
        return;
      }

      // Carregar SDK via script tag
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      
      script.onload = () => {
        if ((window as any).MercadoPago) {
          // Inicializar o Mercado Pago com a chave pública
          (window as any).mp = new (window as any).MercadoPago(MP_PUBLIC_KEY);
          setSdkLoaded(true);
          console.log('MercadoPago SDK carregado com sucesso');
        }
        setLoadingSDK(false);
      };

      script.onerror = () => {
        console.error('Erro ao carregar o SDK do MercadoPago');
        setLoadingSDK(false);
      };

      document.head.appendChild(script);

    } catch (error) {
      console.error('Erro ao carregar SDK do MercadoPago:', error);
      setLoadingSDK(false);
    }
  };

  return {
    sdkLoaded,
    loadingSDK,
    loadSDK
  };
}

// Utilitários para formatação
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const calculateTotal = (items: PagamentoItem[]): number => {
  return items.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
}; 