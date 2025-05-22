import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ProdutoModel from '@/models/produto';
import { getServerSession } from 'next-auth';

// Rota para enviar uma avaliação de produto
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    // TODO: Implementar verificação de sessão
    
    // Obter dados da requisição
    const body = await req.json();
    const { produtoId, avaliacao, comentario } = body;
    
    // Validar dados necessários
    if (!produtoId || !avaliacao) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do produto e avaliação são obrigatórios' 
      }, { status: 400 });
    }
    
    // Validar que a avaliação está entre 1 e 5
    if (avaliacao < 1 || avaliacao > 5) {
      return NextResponse.json({ 
        success: false, 
        message: 'A avaliação deve ser um número entre 1 e 5' 
      }, { status: 400 });
    }
    
    try {
      // Conectar ao banco de dados
      await dbConnect();
      
      // Buscar produto
      const produto = await ProdutoModel.findById(produtoId);
      
      if (!produto) {
        return NextResponse.json({ 
          success: false, 
          message: 'Produto não encontrado' 
        }, { status: 404 });
      }
      
      // Adicionar avaliação ao produto
      const novaAvaliacao = {
        usuario: 'usuario-temporario', // Temporário, substituir por ID real
        nome: 'Cliente', // Temporário, substituir por nome real
        nota: avaliacao,
        comentario: comentario || '',
        data: new Date()
      };
      
      // Verificar se o produto já tem avaliações
      if (!produto.avaliacoes) {
        produto.avaliacoes = [];
      }
      
      // Adicionar avaliação
      produto.avaliacoes.push(novaAvaliacao);
      
      // Calcular nova média de avaliações
      const notas = produto.avaliacoes.map(a => a.nota);
      const media = notas.reduce((a, b) => a + b, 0) / notas.length;
      
      // Atualizar estatísticas do produto
      produto.avaliacao = parseFloat(media.toFixed(1)); // Arredondar para 1 casa decimal
      produto.totalAvaliacoes = produto.avaliacoes.length;
      
      // Salvar produto atualizado
      await produto.save();
      
      return NextResponse.json({
        success: true,
        message: 'Avaliação enviada com sucesso',
        avaliacao: novaAvaliacao
      });
    } catch (dbError: any) {
      console.error('Erro ao salvar avaliação no banco de dados:', dbError);
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao processar avaliação',
        error: dbError.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Erro ao processar avaliação:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao processar avaliação',
      error: error.message
    }, { status: 500 });
  }
}

// Rota para buscar avaliações de um produto
export async function GET(req: NextRequest) {
  try {
    // Obter ID do produto da URL
    const { searchParams } = new URL(req.url);
    const produtoId = searchParams.get('produtoId');
    
    if (!produtoId) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do produto é obrigatório' 
      }, { status: 400 });
    }
    
    try {
      // Conectar ao banco de dados
      await dbConnect();
      
      // Buscar produto
      const produto = await ProdutoModel.findById(produtoId);
      
      if (!produto) {
        return NextResponse.json({ 
          success: false, 
          message: 'Produto não encontrado' 
        }, { status: 404 });
      }
      
      // Retornar avaliações
      return NextResponse.json({
        success: true,
        avaliacoes: produto.avaliacoes || [],
        estatisticas: {
          media: produto.avaliacao || 0,
          total: produto.totalAvaliacoes || 0
        }
      });
    } catch (dbError: any) {
      console.error('Erro ao buscar avaliações:', dbError);
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao buscar avaliações',
        error: dbError.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Erro ao processar requisição GET para avaliações:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar avaliações',
      error: error.message
    }, { status: 500 });
  }
} 