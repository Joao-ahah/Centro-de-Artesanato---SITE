'use client';

import React, { useState } from 'react';
import { useMercadoPago, PagamentoItem, DadosPagador, formatCurrency, calculateTotal } from '@/hooks/useMercadoPago';
import { CreditCardIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface BotaoPagamentoProps {
  items: PagamentoItem[];
  payer?: DadosPagador;
  external_reference?: string;
  className?: string;
  children?: React.ReactNode;
  onSuccess?: (preferenceData: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export default function BotaoPagamento({ 
  items, 
  payer, 
  external_reference,
  className = '',
  children,
  onSuccess,
  onError,
  disabled = false
}: BotaoPagamentoProps) {
  const { criarPreferencia, loading, error, clearError } = useMercadoPago();
  const [processando, setProcessando] = useState(false);

  const total = calculateTotal(items);

  const handlePagamento = async () => {
    if (disabled || loading || processando) return;

    setProcessando(true);
    clearError();

    try {
      console.log('🚀 BotaoPagamento: Iniciando processo de pagamento');
      console.log('📦 Items:', items);
      console.log('👤 Payer:', payer);
      console.log('🔗 External Reference:', external_reference);
      
      // Validações básicas
      if (!items || items.length === 0) {
        throw new Error('Nenhum item para pagamento encontrado');
      }

      if (total <= 0) {
        throw new Error('Valor total deve ser maior que zero');
      }
      
      // Criar preferência
      console.log('⚡ Chamando API para criar preferência...');
      const preferenceData = await criarPreferencia(items, payer, external_reference);
      
      console.log('✅ Preferência criada:', preferenceData);

      // Verificar se recebemos uma URL válida
      const checkoutUrl = preferenceData.init_point || preferenceData.sandbox_init_point;
      
      if (!checkoutUrl) {
        console.error('❌ URL de checkout não recebida:', preferenceData);
        throw new Error('URL de checkout não foi gerada. Verifique as configurações do Mercado Pago.');
      }

      console.log('🔗 URL de checkout:', checkoutUrl);
      
      // Chamar callback de sucesso se fornecido
      if (onSuccess) {
        console.log('📞 Chamando callback de sucesso');
        onSuccess(preferenceData);
      }
      
      // Pequeno delay para garantir que o callback execute
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirecionar para o checkout
      console.log('🌐 Redirecionando para Mercado Pago...');
      window.location.href = checkoutUrl;

    } catch (err: any) {
      console.error('💥 BotaoPagamento: Erro detalhado:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        fullError: err
      });
      
      const errorMessage = err.message || 'Erro desconhecido ao processar pagamento';
      
      console.error('📨 Reportando erro:', errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setProcessando(false);
    }
  };

  const isLoading = loading || processando;

  return (
    <div className="space-y-4">
      {/* Resumo do pedido */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">📋 Resumo do Pedido</h3>
        
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div>
                <span className="font-medium">{item.title}</span>
                {item.description && (
                  <p className="text-gray-600 text-xs">{item.description}</p>
                )}
                <p className="text-gray-500 text-xs">
                  {formatCurrency(item.unit_price)} x {item.quantity}
                </p>
              </div>
              <span className="font-medium">
                {formatCurrency(item.unit_price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span className="text-green-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-red-600 text-sm flex-1">
              <strong>Erro no pagamento:</strong> 
              <div className="mt-1">{error}</div>
              <div className="mt-2 text-xs text-red-500">
                Verifique se todas as configurações estão corretas e tente novamente.
              </div>
            </div>
            <button 
              onClick={clearError}
              className="ml-2 text-red-600 hover:text-red-800 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Botão de pagamento */}
      <button
        onClick={handlePagamento}
        disabled={disabled || isLoading || items.length === 0 || total <= 0}
        className={`
          w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold text-white
          transition-all duration-200 transform
          ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : disabled || total <= 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
          }
          ${className}
        `}
      >
        {isLoading ? (
          <>
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
            <span>Processando...</span>
          </>
        ) : (
          <>
            <CreditCardIcon className="h-5 w-5" />
            <span>
              {children || `Pagar ${formatCurrency(total)}`}
            </span>
          </>
        )}
      </button>

      {/* Informações de segurança */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>🔒 Pagamento seguro com Mercado Pago</p>
        <p>Aceitamos cartão de crédito, débito, PIX e boleto</p>
      </div>

      {/* Status de validação */}
      {items.length === 0 && (
        <div className="text-center text-sm text-red-600 bg-red-50 p-2 rounded">
          ⚠️ Nenhum item encontrado para pagamento
        </div>
      )}

      {total <= 0 && items.length > 0 && (
        <div className="text-center text-sm text-red-600 bg-red-50 p-2 rounded">
          ⚠️ Valor total inválido: {formatCurrency(total)}
        </div>
      )}

      {/* Debug em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
            🔧 Debug (Desenvolvimento)
          </summary>
          <div className="mt-2 bg-gray-100 p-3 rounded text-xs">
            <p><strong>Items:</strong> {items.length}</p>
            <p><strong>Total:</strong> {formatCurrency(total)}</p>
            <p><strong>Total válido:</strong> {total > 0 ? '✅' : '❌'}</p>
            <p><strong>External Reference:</strong> {external_reference || 'N/A'}</p>
            <p><strong>Payer:</strong> {payer?.email || 'N/A'}</p>
            <p><strong>Estado:</strong> {isLoading ? 'Carregando' : 'Pronto'}</p>
            <p><strong>Erro:</strong> {error || 'Nenhum'}</p>
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
              {JSON.stringify({ items, payer, total, disabled, isLoading }, null, 2)}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
} 