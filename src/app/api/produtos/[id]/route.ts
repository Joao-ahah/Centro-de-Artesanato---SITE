import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ProdutoModel } from '@/models/produto';

// Importar produtos simulados diretamente
import { produtosSimulados } from '../route';

// GET /api/produtos/[id] - Obter um produto específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Tentar conectar ao banco de dados primeiro
    try {
      await dbConnect();
      
      // Buscar produto no banco
      const produto = await ProdutoModel.findById(id).exec();
      
      if (!produto) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        produto
      });
      
    } catch (dbError) {
      console.warn('Falha ao conectar ao banco de dados. Usando dados simulados.');
      console.error(dbError);
      
      // Fallback para produtos simulados
      const produto = produtosSimulados.find((p: any) => p._id === id);

      if (!produto) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        produto
      });
    }
  } catch (error: any) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar produto', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/produtos/[id] - Atualizar um produto
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const dadosAtualizados = await req.json();
    
    // Tentar conectar ao banco de dados primeiro
    try {
      await dbConnect();
      
      // Atualizar produto no banco
      const produto = await ProdutoModel.findByIdAndUpdate(
        id, 
        { ...dadosAtualizados, dataAtualizacao: new Date() },
        { new: true, runValidators: true }
      ).exec();

      if (!produto) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Produto atualizado com sucesso',
        produto
      });
      
    } catch (dbError) {
      console.warn('Falha ao conectar ao banco de dados. Usando dados simulados.');
      console.error(dbError);
      
      // Fallback para produtos simulados
      const produtoIndex = produtosSimulados.findIndex((p: any) => p._id === id);

      if (produtoIndex === -1) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      // Atualizar apenas os campos fornecidos
      const produtoAtual = produtosSimulados[produtoIndex];
      const produtoAtualizado = { ...produtoAtual, ...dadosAtualizados, updatedAt: new Date() };
      
      // Substituir o produto na lista
      produtosSimulados[produtoIndex] = produtoAtualizado;

      return NextResponse.json({
        success: true,
        message: 'Produto atualizado com sucesso',
        produto: produtoAtualizado
      });
    }
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao atualizar produto', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/produtos/[id] - Excluir um produto
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Tentar conectar ao banco de dados primeiro
    try {
      await dbConnect();
      
      // Excluir produto do banco
      const produto = await ProdutoModel.findByIdAndDelete(id).exec();

      if (!produto) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Produto excluído com sucesso',
        produto
      });
      
    } catch (dbError) {
      console.warn('Falha ao conectar ao banco de dados. Usando dados simulados.');
      console.error(dbError);
      
      // Fallback para produtos simulados
      const produtoIndex = produtosSimulados.findIndex((p: any) => p._id === id);

      if (produtoIndex === -1) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      // Remover o produto da lista
      const produtoRemovido = produtosSimulados[produtoIndex];
      produtosSimulados.splice(produtoIndex, 1);

      return NextResponse.json({
        success: true,
        message: 'Produto excluído com sucesso',
        produto: produtoRemovido
      });
    }
  } catch (error: any) {
    console.error('Erro ao excluir produto:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao excluir produto', error: error.message },
      { status: 500 }
    );
  }
} 