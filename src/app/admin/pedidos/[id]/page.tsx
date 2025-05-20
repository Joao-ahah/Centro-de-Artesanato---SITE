'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';

interface Produto {
  _id: string;
  nome: string;
}

interface ItemPedido {
  produto: string | Produto;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  imagem?: string;
}

interface Usuario {
  _id: string;
  nome: string;
  email: string;
  telefone?: string;
}

interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface Pagamento {
  metodo: 'pix' | 'cartao' | 'boleto';
  status: 'pendente' | 'aprovado' | 'recusado' | 'estornado';
  valor: number;
  dataPagamento?: string;
}

interface Pedido {
  _id: string;
  numero: string;
  usuario: string | Usuario;
  nomeCliente: string;
  emailCliente: string;
  items: ItemPedido[];
  endereco: Endereco;
  valorFrete: number;
  valorTotal: number;
  valorProdutos: number;
  status: 'aguardando_pagamento' | 'pagamento_aprovado' | 'em_preparacao' | 'enviado' | 'entregue' | 'cancelado';
  pagamento: Pagamento;
  rastreamento?: string;
  observacoes?: string;
  dataRegistro: string;
  dataAtualizacao: string;
  dataEnvio?: string;
  dataEntrega?: string;
  dataCancelamento?: string;
}

export default function DetalhesPedidoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [rastreamento, setRastreamento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [atualizandoRastreamento, setAtualizandoRastreamento] = useState(false);

  useEffect(() => {
    const buscarPedido = async () => {
      try {
        setCarregando(true);
        setErro(null);
        
        const response = await axios.get(`/api/admin/pedidos/${params.id}`);
        
        if (response.data.success) {
          setPedido(response.data.pedido);
          setRastreamento(response.data.pedido.rastreamento || '');
          setObservacoes(response.data.pedido.observacoes || '');
        } else {
          throw new Error(response.data.message || 'Falha ao carregar pedido');
        }
      } catch (error: any) {
        console.error('Erro ao buscar pedido:', error);
        setErro(error.message || 'Falha ao buscar pedido. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    };
    
    buscarPedido();
  }, [params.id]);

  const atualizarStatusPedido = async (novoStatus: string) => {
    try {
      const response = await axios.patch(`/api/admin/pedidos/${params.id}`, {
        status: novoStatus
      });
      
      if (response.data.success) {
        setPedido(response.data.pedido);
        toast.success('Status do pedido atualizado com sucesso!');
      } else {
        throw new Error(response.data.message || 'Falha ao atualizar status');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error(error.message || 'Erro ao atualizar status do pedido');
    }
  };

  const salvarRastreamento = async () => {
    try {
      setAtualizandoRastreamento(true);
      
      const response = await axios.patch(`/api/admin/pedidos/${params.id}`, {
        rastreamento,
        observacoes
      });
      
      if (response.data.success) {
        setPedido(response.data.pedido);
        toast.success('Informações de rastreamento atualizadas!');
      } else {
        throw new Error(response.data.message || 'Falha ao atualizar rastreamento');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar rastreamento:', error);
      toast.error(error.message || 'Erro ao atualizar rastreamento');
    } finally {
      setAtualizandoRastreamento(false);
    }
  };

  const cancelarPedido = async () => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.')) {
      try {
        const response = await axios.patch(`/api/admin/pedidos/${params.id}`, {
          status: 'cancelado'
        });
        
        if (response.data.success) {
          setPedido(response.data.pedido);
          toast.success('Pedido cancelado com sucesso!');
        } else {
          throw new Error(response.data.message || 'Falha ao cancelar pedido');
        }
      } catch (error: any) {
        console.error('Erro ao cancelar pedido:', error);
        toast.error(error.message || 'Erro ao cancelar pedido');
      }
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aguardando_pagamento':
        return { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800' };
      case 'pagamento_aprovado':
        return { label: 'Pagamento Aprovado', color: 'bg-green-100 text-green-800' };
      case 'em_preparacao':
        return { label: 'Em Preparação', color: 'bg-blue-100 text-blue-800' };
      case 'enviado':
        return { label: 'Enviado', color: 'bg-indigo-100 text-indigo-800' };
      case 'entregue':
        return { label: 'Entregue', color: 'bg-purple-100 text-purple-800' };
      case 'cancelado':
        return { label: 'Cancelado', color: 'bg-red-100 text-red-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatarData = (dataString: string | undefined) => {
    if (!dataString) return 'N/A';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderDadosCliente = () => {
    if (!pedido) return null;
    
    const cliente = typeof pedido.usuario === 'object' ? pedido.usuario : { 
      nome: pedido.nomeCliente, 
      email: pedido.emailCliente,
      telefone: 'Não informado'
    };
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Dados do Cliente</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Nome:</span> {cliente.nome}</p>
          <p><span className="font-medium">Email:</span> {cliente.email}</p>
          <p><span className="font-medium">Telefone:</span> {cliente.telefone || 'Não informado'}</p>
        </div>
      </div>
    );
  };

  const renderEnderecoEntrega = () => {
    if (!pedido) return null;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Endereço de Entrega</h3>
        <div className="space-y-2">
          <p>{pedido.endereco.logradouro}, {pedido.endereco.numero}</p>
          {pedido.endereco.complemento && <p>{pedido.endereco.complemento}</p>}
          <p>{pedido.endereco.bairro}</p>
          <p>{pedido.endereco.cidade} - {pedido.endereco.estado}</p>
          <p>CEP: {pedido.endereco.cep}</p>
        </div>
      </div>
    );
  };

  const renderDadosPagamento = () => {
    if (!pedido) return null;
    
    const metodosPagamento: any = {
      'pix': 'PIX',
      'cartao': 'Cartão de Crédito',
      'boleto': 'Boleto Bancário'
    };
    
    const statusPagamento: any = {
      'pendente': { text: 'Pendente', color: 'text-yellow-600' },
      'aprovado': { text: 'Aprovado', color: 'text-green-600' },
      'recusado': { text: 'Recusado', color: 'text-red-600' },
      'estornado': { text: 'Estornado', color: 'text-orange-600' }
    };
    
    const status = statusPagamento[pedido.pagamento.status] || { text: pedido.pagamento.status, color: 'text-gray-600' };
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Dados de Pagamento</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Método:</span> {metodosPagamento[pedido.pagamento.metodo] || pedido.pagamento.metodo}</p>
          <p>
            <span className="font-medium">Status:</span> 
            <span className={`ml-2 ${status.color} font-medium`}>
              {status.text}
            </span>
          </p>
          {pedido.pagamento.dataPagamento && (
            <p><span className="font-medium">Data:</span> {formatarData(pedido.pagamento.dataPagamento)}</p>
          )}
          <p><span className="font-medium">Valor:</span> {formatarValor(pedido.pagamento.valor)}</p>
        </div>
      </div>
    );
  };

  const renderProdutos = () => {
    if (!pedido) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b">Produtos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço Unitário
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedido.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      {item.imagem && (
                        <img 
                          src={item.imagem} 
                          alt={item.nomeProduto} 
                          className="w-12 h-12 object-cover rounded-md mr-4" 
                        />
                      )}
                      <div>
                        <div className="font-medium">{item.nomeProduto}</div>
                        <div className="text-gray-500 text-xs">
                          {typeof item.produto === 'object' ? item.produto._id : item.produto}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {item.quantidade}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {formatarValor(item.precoUnitario)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                    {formatarValor(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Produtos:
                </td>
                <td className="px-6 py-3 text-right text-sm font-medium">
                  {formatarValor(pedido.valorProdutos)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Frete:
                </td>
                <td className="px-6 py-3 text-right text-sm font-medium">
                  {formatarValor(pedido.valorFrete)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td colSpan={3} className="px-6 py-3 text-right text-base font-bold text-gray-800">
                  Total:
                </td>
                <td className="px-6 py-3 text-right text-base font-bold text-amber-700">
                  {formatarValor(pedido.valorTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderRastreamento = () => {
    if (!pedido) return null;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Rastreamento e Anotações</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="rastreamento" className="block text-sm font-medium text-gray-700 mb-1">
              Código de Rastreamento
            </label>
            <input
              type="text"
              id="rastreamento"
              value={rastreamento}
              onChange={(e) => setRastreamento(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ex: BR123456789BR"
            />
          </div>
          
          <div>
            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Adicione observações sobre o pedido..."
            ></textarea>
          </div>
          
          <button
            onClick={salvarRastreamento}
            disabled={atualizandoRastreamento}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
          >
            {atualizandoRastreamento ? 'Salvando...' : 'Salvar Informações'}
          </button>
        </div>
      </div>
    );
  };

  const renderHistorico = () => {
    if (!pedido) return null;
    
    const eventos = [];
    
    eventos.push({
      data: pedido.dataRegistro,
      titulo: 'Pedido Realizado',
      descricao: `Pedido #${pedido.numero} foi registrado`
    });
    
    if (pedido.dataAtualizacao !== pedido.dataRegistro) {
      eventos.push({
        data: pedido.dataAtualizacao,
        titulo: 'Pedido Atualizado',
        descricao: 'Informações do pedido foram atualizadas'
      });
    }
    
    if (pedido.dataEnvio) {
      eventos.push({
        data: pedido.dataEnvio,
        titulo: 'Pedido Enviado',
        descricao: pedido.rastreamento 
          ? `Pedido enviado com código de rastreamento: ${pedido.rastreamento}`
          : 'Pedido enviado para entrega'
      });
    }
    
    if (pedido.dataEntrega) {
      eventos.push({
        data: pedido.dataEntrega,
        titulo: 'Pedido Entregue',
        descricao: 'Pedido foi entregue ao cliente'
      });
    }
    
    if (pedido.dataCancelamento) {
      eventos.push({
        data: pedido.dataCancelamento,
        titulo: 'Pedido Cancelado',
        descricao: 'Pedido foi cancelado'
      });
    }
    
    // Ordenar eventos do mais recente para o mais antigo
    eventos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Histórico do Pedido</h3>
        <div className="space-y-4">
          {eventos.map((evento, index) => (
            <div key={index} className="flex">
              <div className="mr-4 flex-shrink-0">
                <div className="h-4 w-4 rounded-full bg-amber-500 mt-1"></div>
                {index < eventos.length - 1 && (
                  <div className="h-full w-0.5 bg-amber-200 mx-auto mt-1"></div>
                )}
              </div>
              <div className="pb-4">
                <h4 className="text-sm font-medium">{evento.titulo}</h4>
                <p className="text-xs text-gray-500">{formatarData(evento.data)}</p>
                <p className="text-sm mt-1">{evento.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (carregando) {
    return (
      <AdminRoute>
        <div className="flex h-screen bg-gray-100">
          <AdminSidebar />
          <div className="flex-1 overflow-auto p-6">
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Carregando detalhes do pedido...</p>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (erro) {
    return (
      <AdminRoute>
        <div className="flex h-screen bg-gray-100">
          <AdminSidebar />
          <div className="flex-1 overflow-auto p-6">
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">{erro}</p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Tentar Novamente
                </button>
                <Link href="/admin/pedidos" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Voltar para Pedidos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (!pedido) {
    return (
      <AdminRoute>
        <div className="flex h-screen bg-gray-100">
          <AdminSidebar />
          <div className="flex-1 overflow-auto p-6">
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Pedido não encontrado</p>
              <Link href="/admin/pedidos" className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
                Voltar para Pedidos
              </Link>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  const statusInfo = getStatusLabel(pedido.status);

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <div className="flex items-center">
                  <Link href="/admin/pedidos" className="mr-2 text-amber-600 hover:text-amber-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Pedido #{pedido.numero}
                  </h1>
                  <span className={`ml-4 px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">
                  Realizado em {formatarData(pedido.dataRegistro)}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                {pedido.status !== 'cancelado' && (
                  <div className="relative group">
                    <button className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
                      Alterar Status
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      {pedido.status !== 'aguardando_pagamento' && (
                        <button
                          onClick={() => atualizarStatusPedido('aguardando_pagamento')}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Aguardando Pagamento
                        </button>
                      )}
                      {pedido.status !== 'pagamento_aprovado' && (
                        <button
                          onClick={() => atualizarStatusPedido('pagamento_aprovado')}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Pagamento Aprovado
                        </button>
                      )}
                      {pedido.status !== 'em_preparacao' && (
                        <button
                          onClick={() => atualizarStatusPedido('em_preparacao')}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Em Preparação
                        </button>
                      )}
                      {pedido.status !== 'enviado' && (
                        <button
                          onClick={() => atualizarStatusPedido('enviado')}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Enviado
                        </button>
                      )}
                      {pedido.status !== 'entregue' && (
                        <button
                          onClick={() => atualizarStatusPedido('entregue')}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Entregue
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {pedido.status !== 'cancelado' && (
                  <button
                    onClick={cancelarPedido}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                  >
                    Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {renderDadosCliente()}
              {renderEnderecoEntrega()}
              {renderDadosPagamento()}
            </div>
            
            <div className="mb-6">
              {renderProdutos()}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderRastreamento()}
              {renderHistorico()}
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 