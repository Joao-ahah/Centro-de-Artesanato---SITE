import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UsuarioModel from '@/models/usuario';
import { hashPassword } from '@/lib/auth';

// Rota para buscar um cliente específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Obter ID do cliente dos parâmetros
    const id = params.id;
    
    // Validar ID
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do cliente é obrigatório' 
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

    // Buscar cliente
    const cliente = await UsuarioModel.findById(id).select('-senha');
    
    if (!cliente) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cliente não encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      cliente
    });
  } catch (error: any) {
    console.error(`Erro ao buscar cliente ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar cliente',
      error: error.message
    }, { status: 500 });
  }
}

// Rota para atualizar um cliente específico
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Obter ID do cliente dos parâmetros
    const id = params.id;
    
    // Validar ID
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do cliente é obrigatório' 
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

    // Verificar se o cliente existe
    const clienteExistente = await UsuarioModel.findById(id);
    if (!clienteExistente) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cliente não encontrado' 
      }, { status: 404 });
    }

    // Verificar se está tentando transformar em admin (não permitido nesta rota)
    if (dados.isAdmin === true || dados.tipo === 'admin') {
      return NextResponse.json({ 
        success: false, 
        message: 'Não é permitido transformar cliente em administrador por esta rota' 
      }, { status: 400 });
    }

    // Se estiver atualizando a senha, hash ela
    if (dados.senha) {
      dados.senha = await hashPassword(dados.senha);
    }

    // Atualizar cliente
    const clienteAtualizado = await UsuarioModel.findByIdAndUpdate(
      id,
      dados,
      { new: true }
    ).select('-senha');
    
    return NextResponse.json({
      success: true,
      message: 'Cliente atualizado com sucesso',
      cliente: clienteAtualizado
    });
  } catch (error: any) {
    console.error(`Erro ao atualizar cliente ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao atualizar cliente',
      error: error.message
    }, { status: 500 });
  }
}

// Rota para excluir um cliente
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Obter ID do cliente dos parâmetros
    const id = params.id;
    
    // Validar ID
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do cliente é obrigatório' 
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

    // Verificar se o cliente existe
    const clienteExistente = await UsuarioModel.findById(id);
    if (!clienteExistente) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cliente não encontrado' 
      }, { status: 404 });
    }

    // Opção 1: Exclusão real (remove completamente do banco)
    // const resultado = await UsuarioModel.findByIdAndDelete(id);

    // Opção 2: Exclusão lógica (apenas marca como inativo)
    const resultado = await UsuarioModel.findByIdAndUpdate(
      id,
      { ativo: false },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Cliente desativado com sucesso'
    });
  } catch (error: any) {
    console.error(`Erro ao excluir cliente ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao excluir cliente',
      error: error.message
    }, { status: 500 });
  }
} 