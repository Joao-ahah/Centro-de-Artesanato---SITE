import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PedidoModel from '@/models/pedido';

// Rota para buscar um pedido específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar a autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Obter ID do pedido dos parâmetros
    const id = params.id;
    
    // Validar ID
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do pedido é obrigatório' 
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

    // Buscar pedido
    const pedido = await PedidoModel.findById(id)
      .populate('usuario', 'nome email telefone'); // Popular dados do usuário que fez o pedido
    
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
  } catch (error: any) {
    console.error(`Erro ao buscar pedido ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar pedido',
      error: error.message
    }, { status: 500 });
  }
}

// Rota para atualizar um pedido específico (parcialmente)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar a autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Obter ID do pedido dos parâmetros
    const id = params.id;
    
    // Validar ID
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do pedido é obrigatório' 
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

    // Validar se o status é válido se estiver sendo atualizado
    if (dados.status) {
      const statusPermitidos = [
        'aguardando_pagamento', 
        'pagamento_aprovado', 
        'em_preparacao', 
        'enviado', 
        'entregue', 
        'cancelado'
      ];
      
      if (!statusPermitidos.includes(dados.status)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Status do pedido inválido' 
        }, { status: 400 });
      }
    }

    // Buscar e atualizar pedido
    const pedidoAtualizado = await PedidoModel.findByIdAndUpdate(
      id,
      { 
        ...dados,
        dataAtualizacao: new Date()
      },
      { new: true } // Retornar documento atualizado
    );
    
    if (!pedidoAtualizado) {
      return NextResponse.json({ 
        success: false, 
        message: 'Pedido não encontrado' 
      }, { status: 404 });
    }

    // Registrar atualizações específicas no histórico
    if (dados.status === 'entregue' && !pedidoAtualizado.dataEntrega) {
      pedidoAtualizado.dataEntrega = new Date();
      await pedidoAtualizado.save();
    }
    
    if (dados.status === 'enviado' && !pedidoAtualizado.dataEnvio) {
      pedidoAtualizado.dataEnvio = new Date();
      await pedidoAtualizado.save();
    }
    
    if (dados.status === 'cancelado' && !pedidoAtualizado.dataCancelamento) {
      pedidoAtualizado.dataCancelamento = new Date();
      await pedidoAtualizado.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Pedido atualizado com sucesso',
      pedido: pedidoAtualizado
    });
  } catch (error: any) {
    console.error(`Erro ao atualizar pedido ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao atualizar pedido',
      error: error.message
    }, { status: 500 });
  }
}

// Rota para excluir um pedido (operação pouco comum, normalmente apenas cancelamos)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar a autenticação
    // Implementação posterior: adicionar verificação de sessão e permissão de administrador

    // Obter ID do pedido dos parâmetros
    const id = params.id;
    
    // Validar ID
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do pedido é obrigatório' 
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

    // Excluir pedido
    const resultado = await PedidoModel.findByIdAndDelete(id);
    
    if (!resultado) {
      return NextResponse.json({ 
        success: false, 
        message: 'Pedido não encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pedido excluído com sucesso'
    });
  } catch (error: any) {
    console.error(`Erro ao excluir pedido ${params.id}:`, error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao excluir pedido',
      error: error.message
    }, { status: 500 });
  }
} 