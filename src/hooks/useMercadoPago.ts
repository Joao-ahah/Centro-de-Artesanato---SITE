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
      console.log('🚀 useMercadoPago: Iniciando criação de preferência');
      console.log('📦 Items recebidos:', items);
      console.log('👤 Payer recebido:', payer);
      console.log('🔗 External Reference:', external_reference);

      // Validações mais rigorosas
      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('É necessário fornecer pelo menos um item para pagamento');
      }

      // Validar cada item com mais detalhes
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`🔍 Validando item ${i + 1}:`, item);
        
        if (!item.title || typeof item.title !== 'string' || item.title.trim().length === 0) {
          throw new Error(`Item ${i + 1}: título é obrigatório e deve ser uma string não vazia`);
        }
        
        if (!item.unit_price || typeof item.unit_price !== 'number' || isNaN(item.unit_price)) {
          throw new Error(`Item ${i + 1}: preço unitário deve ser um número válido`);
        }
        
        if (item.unit_price <= 0) {
          throw new Error(`Item ${i + 1}: preço unitário deve ser maior que zero (recebido: ${item.unit_price})`);
        }
        
        if (!item.quantity || typeof item.quantity !== 'number' || isNaN(item.quantity)) {
          throw new Error(`Item ${i + 1}: quantidade deve ser um número válido`);
        }
        
        if (item.quantity <= 0) {
          throw new Error(`Item ${i + 1}: quantidade deve ser maior que zero (recebido: ${item.quantity})`);
        }
        
        console.log(`✅ Item ${i + 1} validado com sucesso`);
      }

      // Validar valor total
      const total = calculateTotal(items);
      console.log('💰 Valor total calculado:', total);
      
      if (total <= 0) {
        throw new Error(`Valor total inválido: R$ ${total.toFixed(2)}`);
      }

      // Preparar dados para a API
      const requestBody = {
        items,
        payer,
        external_reference: external_reference || `ref_${Date.now()}_${Math.random().toString(36).substring(7)}`
      };

      console.log('📤 Enviando para API:', JSON.stringify(requestBody, null, 2));

      // Chamar API para criar preferência
      const response = await fetch('/api/pagamento/criar-preferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Resposta da API - Status:', response.status);
      console.log('📥 Resposta da API - Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Resposta de erro da API:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `Erro HTTP ${response.status}: ${response.statusText}`);
        } catch (parseError) {
          throw new Error(`Erro HTTP ${response.status}: ${response.statusText}. Resposta: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('📥 Dados recebidos da API:', data);

      if (!data.success) {
        console.error('❌ API retornou falha:', data);
        throw new Error(data.message || 'Falha na criação da preferência - resposta da API indica erro');
      }

      if (!data.data) {
        console.error('❌ Dados da preferência não encontrados:', data);
        throw new Error('Dados da preferência não foram retornados pela API');
      }

      // Validar dados retornados
      const preferenceData = data.data;
      if (!preferenceData.id) {
        console.error('❌ ID da preferência não encontrado:', preferenceData);
        throw new Error('ID da preferência não foi gerado');
      }

      if (!preferenceData.init_point && !preferenceData.sandbox_init_point) {
        console.error('❌ URLs de checkout não encontradas:', preferenceData);
        throw new Error('URLs de checkout não foram geradas');
      }

      console.log('🎉 useMercadoPago: Preferência criada com sucesso!');
      console.log('🆔 ID da preferência:', preferenceData.id);
      console.log('🔗 URL de produção:', preferenceData.init_point);
      console.log('🧪 URL de sandbox:', preferenceData.sandbox_init_point);
      
      return preferenceData;

    } catch (err: any) {
      console.error('💥 useMercadoPago: Erro detalhado:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        cause: err.cause
      });
      
      const errorMessage = err.message || 'Erro desconhecido ao processar pagamento';
      setError(errorMessage);
      throw new Error(errorMessage);
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
  if (typeof value !== 'number' || isNaN(value)) {
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const calculateTotal = (items: PagamentoItem[]): number => {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  
  return items.reduce((total, item) => {
    if (!item || typeof item.unit_price !== 'number' || typeof item.quantity !== 'number') {
      return total;
    }
    return total + (item.unit_price * item.quantity);
  }, 0);
}; 