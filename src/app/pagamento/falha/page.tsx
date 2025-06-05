'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function PagamentoFalha() {
  const searchParams = useSearchParams();
  const [dadosPagamento, setDadosPagamento] = useState<any>(null);
  
  const collection_id = searchParams.get('collection_id');
  const collection_status = searchParams.get('collection_status');
  const payment_id = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const external_reference = searchParams.get('external_reference');
  const payment_type = searchParams.get('payment_type');
  const merchant_order_id = searchParams.get('merchant_order_id');
  const preference_id = searchParams.get('preference_id');
  const site_id = searchParams.get('site_id');
  const processing_mode = searchParams.get('processing_mode');
  const merchant_account_id = searchParams.get('merchant_account_id');

  useEffect(() => {
    if (collection_id || payment_id) {
      setDadosPagamento({
        collection_id,
        collection_status,
        payment_id,
        status,
        external_reference,
        payment_type,
        merchant_order_id,
        preference_id,
        site_id,
        processing_mode,
        merchant_account_id
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Ícone de erro */}
          <div className="flex justify-center mb-6">
            <XCircleIcon className="h-20 w-20 text-red-500" />
          </div>
          
          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ❌ Problema no Pagamento
          </h1>
          
          {/* Mensagem */}
          <p className="text-lg text-gray-600 mb-8">
            Infelizmente, não foi possível processar seu pagamento. Não se preocupe, você pode tentar novamente.
          </p>
          
          {/* Dados do pagamento */}
          {dadosPagamento && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Detalhes da Tentativa
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {dadosPagamento.payment_id && (
                  <div>
                    <span className="font-medium text-gray-700">ID da Tentativa:</span>
                    <p className="text-gray-900">{dadosPagamento.payment_id}</p>
                  </div>
                )}
                
                {dadosPagamento.status && (
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <p className="text-red-600 font-medium capitalize">
                      {dadosPagamento.status === 'rejected' ? 'Rejeitado' : 
                       dadosPagamento.status === 'cancelled' ? 'Cancelado' : 
                       dadosPagamento.status}
                    </p>
                  </div>
                )}
                
                {dadosPagamento.payment_type && (
                  <div>
                    <span className="font-medium text-gray-700">Tipo de Pagamento:</span>
                    <p className="text-gray-900 capitalize">{dadosPagamento.payment_type}</p>
                  </div>
                )}
                
                {dadosPagamento.external_reference && (
                  <div>
                    <span className="font-medium text-gray-700">Referência:</span>
                    <p className="text-gray-900">{dadosPagamento.external_reference}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Possíveis motivos */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
              💡 Possíveis Motivos
            </h3>
            <ul className="text-left text-yellow-800 space-y-2">
              <li>• Dados do cartão incorretos ou vencido</li>
              <li>• Limite insuficiente ou cartão bloqueado</li>
              <li>• Problema temporário na operadora</li>
              <li>• Dados de cobrança incorretos</li>
            </ul>
          </div>
          
          {/* Próximos passos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              🔄 O que fazer agora?
            </h3>
            <ul className="text-left text-blue-800 space-y-2">
              <li>• Verifique os dados do cartão e tente novamente</li>
              <li>• Entre em contato com seu banco se necessário</li>
              <li>• Tente outro método de pagamento</li>
              <li>• Entre em contato conosco se o problema persistir</li>
            </ul>
          </div>
          
          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              🔙 Tentar Novamente
            </button>
            
            <Link 
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              🏠 Voltar ao Início
            </Link>
            
            <Link 
              href="/contato"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              📞 Preciso de Ajuda
            </Link>
          </div>
          
          {/* Dados técnicos para debug (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && dadosPagamento && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                🔧 Dados Técnicos (Desenvolvimento)
              </summary>
              <pre className="mt-2 bg-gray-100 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(dadosPagamento, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
} 