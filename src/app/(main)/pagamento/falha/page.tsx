'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FaTimesCircle, FaArrowLeft, FaCreditCard, FaExclamationTriangle } from 'react-icons/fa';

export default function PagamentoFalhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [pedidoData, setPedidoData] = useState<any>(null);

  // Parâmetros retornados pelo Mercado Pago
  const collection_id = searchParams.get('collection_id');
  const collection_status = searchParams.get('collection_status');
  const payment_id = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const external_reference = searchParams.get('external_reference');
  const payment_type = searchParams.get('payment_type');

  useEffect(() => {
    // Recuperar dados do pedido do localStorage
    const dadosPedidoPendente = localStorage.getItem('pedido_pendente');
    
    if (dadosPedidoPendente) {
      const dadosPedido = JSON.parse(dadosPedidoPendente);
      setPedidoData(dadosPedido);
    }

    console.log('Pagamento falhou:', {
      collection_id,
      payment_id,
      status,
      external_reference,
      payment_type
    });

    toast.error('Não foi possível processar seu pagamento.');
  }, [collection_id, payment_id, status, external_reference, payment_type]);

  const tentarNovamente = () => {
    // Voltar para a página de checkout na etapa de pagamento
    router.push('/checkout');
  };

  const voltarCarrinho = () => {
    router.push('/carrinho');
  };

  return (
    <div className="bg-amber-50 min-h-screen py-10">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header de falha */}
            <div className="bg-red-500 text-white text-center py-8">
              <FaTimesCircle className="mx-auto text-6xl mb-4" />
              <h1 className="text-3xl font-bold mb-2">Pagamento Não Aprovado</h1>
              <p className="text-red-100">Não foi possível processar seu pagamento</p>
            </div>

            {/* Informações do erro */}
            <div className="p-6 space-y-6">
              {/* Motivos possíveis */}
              <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  Possíveis motivos para a recusa
                </h3>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li>• Dados do cartão incorretos ou inválidos</li>
                  <li>• Limite de crédito insuficiente</li>
                  <li>• Cartão bloqueado ou vencido</li>
                  <li>• Problemas de conectividade durante o pagamento</li>
                  <li>• Falha na validação de segurança</li>
                </ul>
              </div>

              {/* Detalhes do pagamento */}
              {(payment_id || collection_id || status) && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 mb-3">💳 Detalhes da Tentativa</h3>
                  <div className="space-y-2 text-sm">
                    {payment_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID da Tentativa:</span>
                        <span className="font-mono">{payment_id}</span>
                      </div>
                    )}
                    {collection_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID da Cobrança:</span>
                        <span className="font-mono">{collection_id}</span>
                      </div>
                    )}
                    {payment_type && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Método Tentado:</span>
                        <span className="capitalize">{payment_type}</span>
                      </div>
                    )}
                    {status && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="text-red-600 font-medium capitalize">
                          {status === 'rejected' ? 'Rejeitado' : 
                           status === 'cancelled' ? 'Cancelado' : 
                           status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resumo do pedido */}
              {pedidoData && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">🛒 Seus Itens Estão Salvos</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Não se preocupe! Seus itens continuam no carrinho e seus dados estão salvos.
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cliente:</span>
                      <span>{pedidoData.cliente.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total a Pagar:</span>
                      <span className="font-semibold text-amber-600">
                        R$ {pedidoData.valores.total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  {/* Lista de itens */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-800 mb-2">Itens:</h4>
                    <ul className="space-y-1 text-sm">
                      {pedidoData.items.map((item: any, index: number) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.quantidade}x {item.nome}</span>
                          <span>R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* O que fazer agora */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="font-semibold text-blue-800 mb-3">🔄 O que fazer agora?</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Verifique os dados do seu cartão</li>
                  <li>• Confirme se há limite disponível</li>
                  <li>• Tente usar outro cartão ou método de pagamento</li>
                  <li>• Entre em contato com seu banco se necessário</li>
                  <li>• Tente novamente em alguns minutos</li>
                </ul>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={tentarNovamente}
                  className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCreditCard />
                  Tentar Novamente
                </button>
                
                <button
                  onClick={voltarCarrinho}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaArrowLeft />
                  Voltar ao Carrinho
                </button>
              </div>

              {/* Suporte */}
              <div className="text-center pt-6 border-t">
                <p className="text-gray-600 text-sm mb-2">
                  Continua com problemas? Entre em contato:
                </p>
                <div className="space-y-1 text-sm">
                  <p>📧 contato@centroartesanato.com</p>
                  <p>📱 (11) 99999-9999</p>
                  <p>🕒 Segunda a Sexta, 9h às 18h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 