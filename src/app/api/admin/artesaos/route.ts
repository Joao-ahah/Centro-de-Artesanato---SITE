import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ArtesaoModel } from '@/models/artesao';

// Rota para buscar todos os artesãos (com paginação opcional)
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
    const filtro: any = {};
    
    // Se houver termo de busca, adicionar filtro de nome ou especialidade
    if (search) {
      filtro.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { especialidade: { $regex: search, $options: 'i' } },
        { descricao: { $regex: search, $options: 'i' } }
      ];
    }

    // Buscar artesãos
    const artesaos = await ArtesaoModel.find(filtro)
      .sort({ nome: 1 })
      .skip(skip)
      .limit(limit);

    // Contar total de artesãos para paginação
    const total = await ArtesaoModel.countDocuments(filtro);

    return NextResponse.json({
      success: true,
      artesaos,
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        totalPaginas: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar artesãos:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar artesãos',
      error: error.message
    }, { status: 500 });
  }
}

// Rota para criar um novo artesão
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
    if (!data.nome || !data.especialidade || !data.descricao || !data.estado || !data.cidade) {
      return NextResponse.json({ 
        success: false, 
        message: 'Dados obrigatórios não fornecidos' 
      }, { status: 400 });
    }

    // Verificar se o artesão já existe (pelo nome)
    const artesaoExistente = await ArtesaoModel.findOne({ 
      nome: data.nome,
      especialidade: data.especialidade,
      estado: data.estado,
      cidade: data.cidade
    });

    if (artesaoExistente) {
      return NextResponse.json({ 
        success: false, 
        message: 'Já existe um artesão com esses dados cadastrados' 
      }, { status: 409 });
    }

    // Definir o status como ativo por padrão
    data.ativo = data.ativo !== undefined ? data.ativo : true;
    
    // Criar novo artesão
    const novoArtesao = await ArtesaoModel.create(data);

    return NextResponse.json({
      success: true,
      message: 'Artesão criado com sucesso',
      artesao: novoArtesao
    }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar artesão:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao criar artesão',
      error: error.message
    }, { status: 500 });
  }
} 