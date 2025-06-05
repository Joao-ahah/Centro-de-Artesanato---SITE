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
      console.log('BotaoPagamento: Iniciando processo de pagamento');
      
      // Criar preferência
      const preferenceData = await criarPreferencia(items, payer, external_reference);
      
      console.log('BotaoPagamento: Preferência criada:', preferenceData);

      // Redirecionar para o checkout do Mercado Pago
      const checkoutUrl = preferenceData.init_point || preferenceData.sandbox_init_point;
      
      if (checkoutUrl) {
        console.log('BotaoPagamento: Redirecionando para checkout:', checkoutUrl);
        
        // Chamar callback de sucesso se fornecido
        if (onSuccess) {
          onSuccess(preferenceData);
        }
        
        // Redirecionar para o checkout
        window.location.href = checkoutUrl;
      } else {
        throw new Error('URL de checkout não recebida');
      }

    } catch (err: any) {
      console.error('BotaoPagamento: Erro:', err);
      const errorMessage = err.message || 'Erro ao processar pagamento';
      
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
          <div className="flex items-center">
            <div className="text-red-600 text-sm">
              <strong>Erro:</strong> {error}
            </div>
            <button 
              onClick={clearError}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Botão de pagamento */}
      <button
        onClick={handlePagamento}
        disabled={disabled || isLoading || items.length === 0}
        className={`
          w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold text-white
          transition-all duration-200 transform
          ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : disabled 
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

      {/* Debug em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
            🔧 Debug (Desenvolvimento)
          </summary>
          <div className="mt-2 bg-gray-100 p-3 rounded text-xs">
            <p><strong>Items:</strong> {items.length}</p>
            <p><strong>Total:</strong> {formatCurrency(total)}</p>
            <p><strong>External Reference:</strong> {external_reference || 'N/A'}</p>
            <p><strong>Payer:</strong> {payer?.email || 'N/A'}</p>
            <pre className="mt-2 text-xs">
              {JSON.stringify({ items, payer }, null, 2)}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
} 