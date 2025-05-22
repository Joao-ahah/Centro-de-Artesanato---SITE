import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UsuarioModel from '@/models/usuario';

// Rota para buscar todos os clientes (com paginação opcional)
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Conectar ao banco de dados
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ao banco de dados' 
      }, { status: 500 });
    }

    // Obter parâmetros de paginação e filtros da URL
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // Construir query de filtro
    const filtro: any = { 
      isAdmin: false, 
      tipo: 'cliente'
    };
    
    // Se houver termo de busca, adicionar filtro de nome ou email
    if (search) {
      filtro.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Buscar clientes
    const clientes = await UsuarioModel.find(filtro)
      .select('-senha') // Excluir a senha dos resultados
      .sort({ nome: 1 })
      .skip(skip)
      .limit(limit);

    // Contar total de clientes para paginação
    const total = await UsuarioModel.countDocuments(filtro);

    return NextResponse.json({
      success: true,
      clientes,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar clientes',
      error: error.message
    }, { status: 500 });
  }
}

// Rota para criar um novo cliente (normalmente usado apenas por admin)
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
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
    if (!data.nome || !data.email || !data.senha) {
      return NextResponse.json({ 
        success: false, 
        message: 'Nome, email e senha são obrigatórios' 
      }, { status: 400 });
    }

    // Verificar se o email já está em uso
    const clienteExistente = await UsuarioModel.findOne({ email: data.email });
    if (clienteExistente) {
      return NextResponse.json({ 
        success: false, 
        message: 'Este email já está cadastrado' 
      }, { status: 409 });
    }

    // Definir o tipo como cliente e não administrador
    data.tipo = 'cliente';
    data.isAdmin = false;
    data.ativo = true;
    
    // Criar novo cliente
    const novoCliente = await UsuarioModel.create(data);

    // Remover a senha do objeto de resposta
    const clienteResponse = novoCliente.toObject();
    delete clienteResponse.senha;

    return NextResponse.json({
      success: true,
      message: 'Cliente criado com sucesso',
      cliente: clienteResponse
    }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao criar cliente',
      error: error.message
    }, { status: 500 });
  }
} 