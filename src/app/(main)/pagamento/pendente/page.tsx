'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FaClock, FaHome, FaEnvelope, FaInfoCircle } from 'react-icons/fa';

export default function PagamentoPendentePage() {
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

    console.log('Pagamento pendente:', {
      collection_id,
      payment_id,
      status,
      external_reference,
      payment_type
    });

    toast.info('Seu pagamento está sendo processado.');
  }, [collection_id, payment_id, status, external_reference, payment_type]);

  const getStatusMessage = () => {
    if (payment_type === 'ticket' || payment_type === 'boleto') {
      return {
        title: 'Boleto Bancário Gerado',
        message: 'Seu boleto foi gerado com sucesso. Efetue o pagamento para confirmar seu pedido.',
        instructions: [
          'Acesse seu internet banking ou aplicativo do banco',
          'Vá na opção "Pagar Boleto" ou "Código de Barras"',
          'Digite o código ou escaneie o código de barras',
          'Confirme o pagamento',
          'O prazo para pagamento é de até 3 dias úteis'
        ]
      };
    } else if (payment_type === 'bank_transfer' || payment_type === 'pix') {
      return {
        title: 'PIX Gerado',
        message: 'Seu código PIX foi gerado. Escaneie o QR Code ou copie o código para finalizar o pagamento.',
        instructions: [
          'Abra o aplicativo do seu banco',
          'Escolha a opção PIX',
          'Escaneie o QR Code ou cole o código PIX',
          'Confirme os dados e finalize o pagamento',
          'O pagamento PIX é processado instantaneamente'
        ]
      };
    } else {
      return {
        title: 'Pagamento em Análise',
        message: 'Seu pagamento está sendo analisado. Aguarde a confirmação.',
        instructions: [
          'O pagamento está passando por análise de segurança',
          'Você receberá um email com a confirmação',
          'O processo pode levar até algumas horas',
          'Não é necessário fazer um novo pagamento',
          'Em caso de dúvidas, entre em contato conosco'
        ]
      };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="bg-amber-50 min-h-screen py-10">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header pendente */}
            <div className="bg-yellow-500 text-white text-center py-8">
              <FaClock className="mx-auto text-6xl mb-4" />
              <h1 className="text-3xl font-bold mb-2">{statusInfo.title}</h1>
              <p className="text-yellow-100">{statusInfo.message}</p>
            </div>

            {/* Informações do pagamento */}
            <div className="p-6 space-y-6">
              {/* Detalhes do pagamento */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-3">💳 Detalhes do Pagamento</h3>
                <div className="space-y-2 text-sm">
                  {payment_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID do Pagamento:</span>
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
                      <span className="text-gray-600">Método de Pagamento:</span>
                      <span className="capitalize">
                        {payment_type === 'ticket' ? 'Boleto Bancário' :
                         payment_type === 'bank_transfer' ? 'PIX' :
                         payment_type === 'pix' ? 'PIX' :
                         payment_type}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-yellow-600 font-medium">Pendente</span>
                  </div>
                </div>
              </div>

              {/* Instruções */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <FaInfoCircle className="mr-2" />
                  Como finalizar o pagamento
                </h3>
                <ol className="space-y-2 text-sm text-blue-700">
                  {statusInfo.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="font-bold mr-2">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Resumo do pedido */}
              {pedidoData && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">📦 Resumo do Pedido</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cliente:</span>
                      <span>{pedidoData.cliente.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{pedidoData.cliente.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entrega:</span>
                      <span>{pedidoData.metodoEntrega === 'entrega' ? 'Entrega em domicílio' : 'Retirada na loja'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold text-amber-600">
                        R$ {pedidoData.valores.total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  {/* Lista de itens */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-800 mb-2">Itens do Pedido:</h4>
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

              {/* Importante */}
              <div className="border rounded-lg p-4 bg-amber-50 border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-3">⚠️ Importante</h3>
                <ul className="space-y-2 text-sm text-amber-700">
                  <li>• Seu pedido será processado somente após a confirmação do pagamento</li>
                  <li>• Você receberá um email de confirmação quando o pagamento for aprovado</li>
                  <li>• Mantenha o comprovante de pagamento para consultas futuras</li>
                  <li>• Em caso de problemas, entre em contato com nosso suporte</li>
                </ul>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/"
                  className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <FaHome />
                  Voltar ao Início
                </Link>
                
                <Link
                  href="/conta/pedidos"
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <FaEnvelope />
                  Meus Pedidos
                </Link>
              </div>

              {/* Suporte */}
              <div className="text-center pt-6 border-t">
                <p className="text-gray-600 text-sm mb-2">
                  Precisa de ajuda com seu pagamento?
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