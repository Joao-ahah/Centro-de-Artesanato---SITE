import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ProdutoModel } from '@/models/produto';
import UsuarioModel from '@/models/usuario';
import PedidoModel from '@/models/pedido';
import { ArtesaoModel } from '@/models/artesao';

export async function GET(req: NextRequest) {
  try {
    // Tentar conectar ao banco de dados
    const db = await dbConnect();
    
    // Se não conseguir conectar ao banco de dados, retornar dados simulados
    if (!db) {
      return NextResponse.json({
        success: true,
        data: {
          totalProdutos: 35,
          produtosEmDestaque: 6,
          produtosEsgotados: 3,
          totalPedidos: 124,
          pedidosPendentes: 12,
          vendasHoje: 780,
          vendasMes: 12450,
          clientesNovos: 28,
          totalArtesaos: 12,
          artesaosAtivos: 10,
          statusPedidos: {
            aguardandoPagamento: 5,
            pagamentoAprovado: 7,
            emPreparacao: 10,
            enviado: 15,
            entregue: 82,
            cancelado: 5
          }
        }
      });
    }
    
    // Se conectar ao banco de dados, obter dados reais
    // Contar o total de produtos
    const totalProdutos = await ProdutoModel.countDocuments();
    
    // Contar produtos em destaque
    const produtosEmDestaque = await ProdutoModel.countDocuments({ destaque: true });
    
    // Contar produtos sem estoque
    const produtosEsgotados = await ProdutoModel.countDocuments({ quantidade: 0 });
    
    // Contar total de usuários
    const totalUsuarios = await UsuarioModel.countDocuments();
    
    // Contar usuários registrados no último mês
    const umMesAtras = new Date();
    umMesAtras.setMonth(umMesAtras.getMonth() - 1);
    
    const clientesNovos = await UsuarioModel.countDocuments({
      createdAt: { $gte: umMesAtras }
    });
    
    // Contar total de pedidos
    const totalPedidos = await PedidoModel.countDocuments();
    
    // Contar pedidos pendentes
    const pedidosPendentes = await PedidoModel.countDocuments({
      status: { $in: ['aguardando_pagamento', 'pagamento_aprovado', 'em_preparacao'] }
    });
    
    // Calcular vendas de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const pedidosHoje = await PedidoModel.find({
      dataRegistro: { $gte: hoje },
      status: { $ne: 'cancelado' }
    });
    
    const vendasHoje = pedidosHoje.reduce((total, pedido) => total + pedido.valorTotal, 0);
    
    // Calcular vendas do mês
    const inicioDeMes = new Date();
    inicioDeMes.setDate(1);
    inicioDeMes.setHours(0, 0, 0, 0);
    
    const pedidosDoMes = await PedidoModel.find({
      dataRegistro: { $gte: inicioDeMes },
      status: { $ne: 'cancelado' }
    });
    
    const vendasMes = pedidosDoMes.reduce((total, pedido) => total + pedido.valorTotal, 0);
    
    // Contar total de artesãos
    const totalArtesaos = await ArtesaoModel.countDocuments();
    
    // Contar artesãos ativos
    const artesaosAtivos = await ArtesaoModel.countDocuments({ ativo: true });
    
    // Contar pedidos por status
    const aguardandoPagamento = await PedidoModel.countDocuments({ status: 'aguardando_pagamento' });
    const pagamentoAprovado = await PedidoModel.countDocuments({ status: 'pagamento_aprovado' });
    const emPreparacao = await PedidoModel.countDocuments({ status: 'em_preparacao' });
    const enviado = await PedidoModel.countDocuments({ status: 'enviado' });
    const entregue = await PedidoModel.countDocuments({ status: 'entregue' });
    const cancelado = await PedidoModel.countDocuments({ status: 'cancelado' });
    
    return NextResponse.json({
      success: true,
      data: {
        totalProdutos,
        produtosEmDestaque,
        produtosEsgotados,
        totalPedidos,
        pedidosPendentes,
        vendasHoje,
        vendasMes,
        totalUsuarios,
        clientesNovos,
        totalArtesaos,
        artesaosAtivos,
        statusPedidos: {
          aguardandoPagamento,
          pagamentoAprovado,
          emPreparacao,
          enviado,
          entregue,
          cancelado
        }
      }
    });
    
  } catch (error: any) {
    console.error('Erro ao obter dados do dashboard:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao obter dados do dashboard',
      error: error.message
    }, { status: 500 });
  }
} 