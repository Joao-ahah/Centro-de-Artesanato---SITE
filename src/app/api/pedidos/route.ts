import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/db';
import PedidoModel from '@/models/pedido';
import { ProdutoModel } from '@/models/produto';

// POST - Criar novo pedido
export async function POST(req: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Usuário não autenticado'
      }, { status: 401 });
    }

    // Obter dados do pedido
    const body = await req.json();

    // Validar dados básicos
    if (!body.nomeCliente || !body.emailCliente || !body.items || body.items.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Dados incompletos. Nome, email e itens são obrigatórios.'
      }, { status: 400 });
    }

    // Validar método de entrega
    if (body.metodoEntrega === 'entrega' && !body.endereco) {
      return NextResponse.json({
        success: false,
        message: 'Endereço é obrigatório para entregas.'
      }, { status: 400 });
    }

    try {
      // Conectar ao banco de dados
      await dbConnect();

      // Verificar disponibilidade dos produtos e atualizar estoque
      for (const item of body.items) {
        const produto = await ProdutoModel.findById(item.produtoId);

        if (!produto) {
          return NextResponse.json({
            success: false,
            message: `Produto ${item.nomeProduto} não encontrado.`
          }, { status: 404 });
        }

        if (produto.quantidade < item.quantidade) {
          return NextResponse.json({
            success: false,
            message: `Quantidade insuficiente em estoque para o produto ${produto.nome}. Disponível: ${produto.quantidade}.`
          }, { status: 400 });
        }

        // Atualizar estoque
        produto.quantidade -= item.quantidade;
        await produto.save();
      }

      // Criar novo pedido
      const novoPedido = new PedidoModel({
        usuario: userId,
        nomeCliente: body.nomeCliente,
        emailCliente: body.emailCliente,
        items: body.items.map(item => ({
          produto: item.produtoId,
          nomeProduto: item.nomeProduto,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
          imagem: item.imagem
        })),
        metodoEntrega: body.metodoEntrega || 'entrega',
        endereco: body.metodoEntrega === 'entrega' ? body.endereco : undefined,
        valorFrete: body.valorFrete || 0,
        valorTotal: body.valorTotal,
        valorProdutos: body.valorProdutos,
        status: 'aguardando_pagamento',
        pagamento: {
          metodo: body.metodoPagamento || 'pix',
          status: 'pendente',
          valor: body.valorTotal
        },
        observacoes: body.observacoes,
        cupomAplicado: body.cupomAplicado,
        dataRegistro: new Date()
      });

      // Salvar pedido
      const pedidoSalvo = await novoPedido.save();

      // Retornar sucesso
      return NextResponse.json({
        success: true,
        message: 'Pedido criado com sucesso',
        pedido: pedidoSalvo
      }, { status: 201 });

    } catch (dbError: any) {
      console.error('Erro ao salvar pedido no MongoDB:', dbError);
      return NextResponse.json({
        success: false,
        message: 'Erro ao salvar pedido no banco de dados',
        error: dbError.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Erro ao processar requisição POST para pedidos:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar pedido',
      error: error.message
    }, { status: 500 });
  }
}

// GET - Obter pedidos do usuário
export async function GET(req: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Usuário não autenticado'
      }, { status: 401 });
    }

    // Extrair parâmetros da query
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const metodoEntrega = searchParams.get('metodoEntrega');
    const limite = parseInt(searchParams.get('limite') || '10');
    const pagina = parseInt(searchParams.get('pagina') || '1');

    try {
      // Conectar ao banco de dados
      await dbConnect();

      // Buscar pedido específico por ID
      if (id) {
        const pedido = await PedidoModel.findOne({
          _id: id,
          usuario: userId
        });

        if (!pedido) {
          return NextResponse.json({
            success: false,
            message: 'Pedido não encontrado'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          pedido
        });
      }

      // Construir a query
      let query: any = { usuario: userId };

      // Filtrar por status
      if (status) {
        query.status = status;
      }

      // Filtrar por método de entrega
      if (metodoEntrega) {
        query.metodoEntrega = metodoEntrega;
      }

      // Calcular paginação
      const skip = (pagina - 1) * limite;

      // Buscar pedidos
      const pedidos = await PedidoModel.find(query)
        .sort({ dataRegistro: -1 })
        .skip(skip)
        .limit(limite);

      // Contar total para paginação
      const total = await PedidoModel.countDocuments(query);

      // Retornar pedidos
      return NextResponse.json({
        success: true,
        pedidos,
        paginacao: {
          total,
          pagina,
          limite,
          paginas: Math.ceil(total / limite)
        }
      });

    } catch (dbError: any) {
      console.error('Erro ao buscar pedidos no MongoDB:', dbError);
      return NextResponse.json({
        success: false,
        message: 'Erro ao buscar pedidos no banco de dados',
        error: dbError.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Erro ao processar requisição GET para pedidos:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar pedidos',
      error: error.message
    }, { status: 500 });
  }
} 