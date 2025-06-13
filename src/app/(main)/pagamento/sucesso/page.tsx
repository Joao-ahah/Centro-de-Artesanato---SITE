'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import { useCarrinho } from '@/contexts/CarrinhoContext';

export default function PagamentoSucessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { limparCarrinho } = useCarrinho();
  
  const [pedidoData, setPedidoData] = useState<any>(null);
  const [processando, setProcessando] = useState(true);

  // Parâmetros retornados pelo Mercado Pago
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
    const processarPagamentoSucesso = async () => {
      try {
        // Recuperar dados do pedido salvos no localStorage
        const dadosPedidoPendente = localStorage.getItem('pedido_pendente');
        
        if (dadosPedidoPendente) {
          const dadosPedido = JSON.parse(dadosPedidoPendente);
          setPedidoData(dadosPedido);
          
          console.log('Dados do pagamento bem-sucedido:', {
            collection_id,
            payment_id,
            status,
            external_reference,
            payment_type,
            dadosPedido
          });

          // Criar pedido no banco de dados
          const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nomeCliente: dadosPedido.cliente.nome,
              emailCliente: dadosPedido.cliente.email,
              telefone: dadosPedido.cliente.telefone,
              metodoEntrega: dadosPedido.metodoEntrega,
              endereco: dadosPedido.endereco,
              items: dadosPedido.items.map((item: any) => ({
                produtoId: item.produtoId,
                nomeProduto: item.nome,
                quantidade: item.quantidade,
                precoUnitario: item.preco,
                subtotal: item.preco * item.quantidade,
                imagem: item.imagem
              })),
              valorFrete: dadosPedido.valores.frete,
              valorTotal: dadosPedido.valores.total,
              valorProdutos: dadosPedido.valores.subtotal,
              embrulhoPresente: dadosPedido.valores.embrulho > 0,
              observacoes: dadosPedido.observacoes,
              metodoPagamento: payment_type || 'mercadopago',
              mercadopago: {
                payment_id,
                collection_id,
                status,
                external_reference,
                preference_id: dadosPedido.mercadopago.preference_id
              }
            })
          });

          const result = await response.json();

          if (result.success) {
            // Limpar carrinho e dados pendentes
            limparCarrinho();
            localStorage.removeItem('pedido_pendente');
            
            // Salvar ID do pedido criado
            localStorage.setItem('ultimo_pedido_id', result.pedido._id);
            
            toast.success('Pagamento confirmado e pedido criado com sucesso!');
          } else {
            console.error('Erro ao criar pedido:', result.message);
            toast.error('Pagamento confirmado, mas houve um erro ao processar seu pedido. Entre em contato conosco.');
          }
        } else {
          console.warn('Dados do pedido não encontrados no localStorage');
          toast.warning('Pagamento confirmado, mas não encontramos os dados do pedido. Entre em contato conosco.');
        }
      } catch (error) {
        console.error('Erro ao processar pagamento sucesso:', error);
        toast.error('Erro ao processar confirmação do pagamento. Entre em contato conosco.');
      } finally {
        setProcessando(false);
      }
    };

    if (collection_id || payment_id) {
      processarPagamentoSucesso();
    } else {
      setProcessando(false);
    }
  }, [collection_id, payment_id, status, external_reference, payment_type, limparCarrinho]);

  if (processando) {
    return (
      <div className="bg-amber-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Processando pagamento...
          </h2>
          <p className="text-gray-600">
            Por favor, aguarde enquanto confirmamos seu pagamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen py-10">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header de sucesso */}
            <div className="bg-green-500 text-white text-center py-8">
              <FaCheckCircle className="mx-auto text-6xl mb-4" />
              <h1 className="text-3xl font-bold mb-2">Pagamento Confirmado!</h1>
              <p className="text-green-100">Seu pedido foi processado com sucesso</p>
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
                      <span className="capitalize">{payment_type}</span>
                    </div>
                  )}
                  {status && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`capitalize font-medium ${
                        status === 'approved' ? 'text-green-600' : 
                        status === 'pending' ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {status === 'approved' ? 'Aprovado' : 
                         status === 'pending' ? 'Pendente' : 
                         status}
                      </span>
                    </div>
                  )}
                </div>
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
                      <span className="font-semibold text-green-600">
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

              {/* Próximos passos */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="font-semibold text-blue-800 mb-3">📋 Próximos Passos</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Você receberá um email de confirmação em instantes</li>
                  <li>• Seu pedido será processado em até 24 horas</li>
                  {pedidoData?.metodoEntrega === 'entrega' ? (
                    <li>• A entrega será realizada em até 5 dias úteis</li>
                  ) : (
                    <li>• Você será notificado quando o pedido estiver pronto para retirada</li>
                  )}
                  <li>• Acompanhe o status do seu pedido na sua conta</li>
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
                  href="/produtos"
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <FaShoppingBag />
                  Continuar Comprando
                </Link>
              </div>

              {/* Suporte */}
              <div className="text-center pt-6 border-t">
                <p className="text-gray-600 text-sm mb-2">
                  Precisa de ajuda? Entre em contato conosco:
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