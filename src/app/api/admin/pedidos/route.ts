import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import PedidoModel from '@/models/pedido';

// Rota para buscar todos os pedidos (com paginação opcional)
export async function GET(req: NextRequest) {
  try {
    // Verificar a autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Conectar ao banco de dados
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ao banco de dados' 
      }, { status: 500 });
    }

    // Obter parâmetros de paginação da URL
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Buscar pedidos
    const pedidos = await PedidoModel.find({})
      .sort({ dataRegistro: -1 })
      .skip(skip)
      .limit(limit);

    // Contar total de pedidos para paginação
    const total = await PedidoModel.countDocuments({});

    return NextResponse.json({
      success: true,
      pedidos,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar pedidos',
      error: error.message
    }, { status: 500 });
  }
}

// Rota para criar um novo pedido (normalmente usado pelo checkout)
export async function POST(req: NextRequest) {
  try {
    // Verificar a autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Conectar ao banco de dados
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ao banco de dados' 
      }, { status: 500 });
    }

    // Obter dados do corpo da requisição
    const data = await req.json();

    // Validar dados necessários
    if (!data.usuario || !data.items || data.items.length === 0) {
      return NextResponse.json({ 
        success: false,

        message: 'Dados de pedido inválidos ou incompletos'
      }, { status: 400 });
    }

    // Criar novo pedido
    const novoPedido = await PedidoModel.create(data);

    return NextResponse.json({
      success: true,
      message: 'Pedido criado com sucesso',
      pedido: novoPedido
    }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao criar pedido',
      error: error.message
    }, { status: 500 });
  }
} 