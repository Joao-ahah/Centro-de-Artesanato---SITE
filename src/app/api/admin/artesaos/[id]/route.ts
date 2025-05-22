import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ArtesaoModel } from '@/models/artesao';

// Rota para buscar um artesão específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Obter ID do artesão dos parâmetros
    const id = params.id;
    
    // Validar ID
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do artesão é obrigatório' 
      }, { status: 400 });
    }

    // Conectar ao banco de dados
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ao banco de dados' 
      }, { status: 500 });
    }

    // Buscar artesão
    const artesao = await ArtesaoModel.findById(id);
    
    if (!artesao) {
      return NextResponse.json({ 
        success: false, 
        message: 'Artesão não encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      artesao
    });
  } catch (error: any) {
    console.error(`Erro ao buscar artesão ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar artesão',
      error: error.message
    }, { status: 500 });
  }
}

// Rota para atualizar um artesão específico
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Obter ID do artesão dos parâmetros
    const id = params.id;
    
    // Validar ID
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do artesão é obrigatório' 
      }, { status: 400 });
    }

    // Conectar ao banco de dados
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ao banco de dados' 
      }, { status: 500 });
    }

    // Obter dados para atualização
    const dados = await req.json();

    // Verificar se o artesão existe
    const artesaoExistente = await ArtesaoModel.findById(id);
    if (!artesaoExistente) {
      return NextResponse.json({ 
        success: false, 
        message: 'Artesão não encontrado' 
      }, { status: 404 });
    }

    // Atualizar artesão
    const artesaoAtualizado = await ArtesaoModel.findByIdAndUpdate(
      id,
      dados,
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Artesão atualizado com sucesso',
      artesao: artesaoAtualizado
    });
  } catch (error: any) {
    console.error(`Erro ao atualizar artesão ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao atualizar artesão',
      error: error.message
    }, { status: 500 });
  }
}

// Rota para excluir um artesão
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Obter ID do artesão dos parâmetros
    const id = params.id;
    
    // Validar ID
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do artesão é obrigatório' 
      }, { status: 400 });
    }

    // Conectar ao banco de dados
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ao banco de dados' 
      }, { status: 500 });
    }

    // Verificar se o artesão existe
    const artesaoExistente = await ArtesaoModel.findById(id);
    if (!artesaoExistente) {
      return NextResponse.json({ 
        success: false, 
        message: 'Artesão não encontrado' 
      }, { status: 404 });
    }

    // Opção 1: Exclusão real (remove completamente do banco)
    // const resultado = await ArtesaoModel.findByIdAndDelete(id);

    // Opção 2: Exclusão lógica (apenas marca como inativo)
    const resultado = await ArtesaoModel.findByIdAndUpdate(
      id,
      { ativo: false },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Artesão desativado com sucesso'
    });
  } catch (error: any) {
    console.error(`Erro ao excluir artesão ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao excluir artesão',
      error: error.message
    }, { status: 500 });
  }
} 