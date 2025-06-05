'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/24/solid';

export default function PagamentoPendente() {
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Ícone de pendente */}
          <div className="flex justify-center mb-6">
            <ClockIcon className="h-20 w-20 text-yellow-500" />
          </div>
          
          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ⏳ Pagamento Pendente
          </h1>
          
          {/* Mensagem */}
          <p className="text-lg text-gray-600 mb-8">
            Seu pagamento está sendo processado. Aguarde a confirmação, que pode levar alguns minutos.
          </p>
          
          {/* Dados do pagamento */}
          {dadosPagamento && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Detalhes do Pagamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {dadosPagamento.payment_id && (
                  <div>
                    <span className="font-medium text-gray-700">ID do Pagamento:</span>
                    <p className="text-gray-900">{dadosPagamento.payment_id}</p>
                  </div>
                )}
                
                {dadosPagamento.status && (
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <p className="text-yellow-600 font-medium capitalize">
                      {dadosPagamento.status === 'pending' ? 'Pendente' : 
                       dadosPagamento.status === 'in_process' ? 'Em Processamento' :
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
          
          {/* Informações sobre pagamento pendente */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              💡 Sobre Pagamentos Pendentes
            </h3>
            <ul className="text-left text-blue-800 space-y-2">
              <li>• <strong>Boleto:</strong> Pagamento será confirmado após compensação (1-2 dias úteis)</li>
              <li>• <strong>PIX:</strong> Confirmação pode levar até alguns minutos</li>
              <li>• <strong>Transferência:</strong> Análise pode levar até 24 horas</li>
              <li>• <strong>Cartão:</strong> Análise de crédito em andamento</li>
            </ul>
          </div>
          
          {/* Status de acompanhamento */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
              📧 Acompanhamento
            </h3>
            <ul className="text-left text-yellow-800 space-y-2">
              <li>• Você receberá um email assim que o pagamento for confirmado</li>
              <li>• Mantenha este comprovante para referência</li>
              <li>• Se tiver dúvidas, entre em contato conosco</li>
              <li>• Não é necessário fazer um novo pagamento</li>
            </ul>
          </div>
          
          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              🏠 Voltar ao Início
            </Link>
            
            <Link 
              href="/contato"
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              📞 Entrar em Contato
            </Link>
            
            <button 
              onClick={() => window.location.reload()}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              🔄 Atualizar Status
            </button>
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