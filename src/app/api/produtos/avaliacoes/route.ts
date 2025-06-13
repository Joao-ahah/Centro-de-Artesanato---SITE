import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ProdutoModel } from '@/models/produto';
import { produtosSimulados } from '../route';

// POST /api/produtos/avaliacoes - Adicionar nova avaliação
export async function POST(req: NextRequest) {
  try {
    const { produtoId, avaliacao, comentario, nomeUsuario } = await req.json();

    // Validações básicas
    if (!produtoId || !avaliacao) {
      return NextResponse.json(
        { success: false, message: 'ID do produto e avaliação são obrigatórios' },
        { status: 400 }
      );
    }

    if (avaliacao < 1 || avaliacao > 5) {
      return NextResponse.json(
        { success: false, message: 'Avaliação deve estar entre 1 e 5' },
        { status: 400 }
      );
    }

    // Tentar conectar ao banco de dados primeiro
    try {
      await dbConnect();
      
      // Buscar produto no banco
      const produto = await ProdutoModel.findById(produtoId).exec();
      
      if (!produto) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      // Adicionar nova avaliação
      const novaAvaliacao = {
        usuario: 'usuário-anonimo', // TODO: Integrar com autenticação
        nome: nomeUsuario || 'Usuário Anônimo',
        nota: avaliacao,
        comentario: comentario || '',
        data: new Date()
      };

      // Atualizar produto com nova avaliação
      produto.avaliacoes = produto.avaliacoes || [];
      produto.avaliacoes.push(novaAvaliacao);
      
      // Recalcular média de avaliações
      const totalAvaliacoes = produto.avaliacoes.length;
      const somaAvaliacoes = produto.avaliacoes.reduce((soma, av) => soma + av.nota, 0);
      produto.avaliacao = somaAvaliacoes / totalAvaliacoes;
      produto.totalAvaliacoes = totalAvaliacoes;

      await produto.save();

      return NextResponse.json({
        success: true,
        message: 'Avaliação adicionada com sucesso',
        produto: {
          _id: produto._id,
          avaliacao: produto.avaliacao,
          totalAvaliacoes: produto.totalAvaliacoes,
          avaliacoes: produto.avaliacoes
        }
      });
      
    } catch (dbError) {
      console.warn('Falha ao conectar ao banco de dados. Usando dados simulados.');
      console.error(dbError);
      
      // Fallback para produtos simulados
      const produtoIndex = produtosSimulados.findIndex((p: any) => p._id === produtoId);
      
      if (produtoIndex === -1) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      const produto = produtosSimulados[produtoIndex];
      
      // Adicionar nova avaliação aos dados simulados
      const novaAvaliacao = {
        usuario: 'usuário-anonimo',
        nome: nomeUsuario || 'Usuário Anônimo',
        nota: avaliacao,
        comentario: comentario || '',
        data: new Date()
      };

      // Inicializar avaliacoes se não existir
      if (!produto.avaliacoes) {
        produto.avaliacoes = [];
      }
      
      produto.avaliacoes.push(novaAvaliacao);
      
      // Recalcular média
      const totalAvaliacoes = produto.avaliacoes.length;
      const somaAvaliacoes = produto.avaliacoes.reduce((soma: number, av: any) => soma + av.nota, 0);
      produto.avaliacao = somaAvaliacoes / totalAvaliacoes;
      produto.totalAvaliacoes = totalAvaliacoes;

      return NextResponse.json({
        success: true,
        message: 'Avaliação adicionada com sucesso',
        produto: {
          _id: produto._id,
          avaliacao: produto.avaliacao,
          totalAvaliacoes: produto.totalAvaliacoes,
          avaliacoes: produto.avaliacoes
        }
      });
    }

  } catch (error: any) {
    console.error('Erro ao adicionar avaliação:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao adicionar avaliação', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/produtos/avaliacoes - Buscar avaliações de um produto
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const produtoId = searchParams.get('produtoId');

    if (!produtoId) {
      return NextResponse.json(
        { success: false, message: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }

    // Tentar conectar ao banco de dados primeiro
    try {
      await dbConnect();
      
      // Buscar produto no banco
      const produto = await ProdutoModel.findById(produtoId).select('avaliacoes avaliacao totalAvaliacoes').exec();
      
      if (!produto) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        avaliacoes: produto.avaliacoes || [],
        avaliacao: produto.avaliacao || 0,
        totalAvaliacoes: produto.totalAvaliacoes || 0
      });
      
    } catch (dbError) {
      console.warn('Falha ao conectar ao banco de dados. Usando dados simulados.');
      console.error(dbError);
      
      // Fallback para produtos simulados
      const produto = produtosSimulados.find((p: any) => p._id === produtoId);
      
      if (!produto) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        avaliacoes: produto.avaliacoes || [],
        avaliacao: produto.avaliacao || 0,
        totalAvaliacoes: produto.totalAvaliacoes || 0
      });
    }

  } catch (error: any) {
    console.error('Erro ao buscar avaliações:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar avaliações', error: error.message },
      { status: 500 }
    );
  }
} 