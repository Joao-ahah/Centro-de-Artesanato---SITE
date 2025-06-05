import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { NoticiaModel } from '@/models/noticia';

// Notícias simuladas para desenvolvimento (quando sem banco de dados)
export const noticiasSimuladas = [
  {
    _id: '1',
    titulo: 'Feira de Artesanato de Primavera: Conheça os Destaques',
    slug: 'feira-artesanato-primavera',
    resumo: 'A Feira de Artesanato de Primavera traz o melhor do artesanato nacional com foco em peças que celebram a estação das flores.',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.',
    imagem: 'https://images.unsplash.com/photo-1555639594-48ba11f2c095',
    autor: 'Maria Oliveira',
    categorias: ['Eventos', 'Feira'],
    publicado: true,
    dataPublicacao: new Date('2023-09-05'),
    dataCriacao: new Date('2023-09-05'),
    dataAtualizacao: new Date('2023-09-05'),
    visualizacoes: 150,
    tags: ['feira', 'primavera', 'artesanato']
  },
  {
    _id: '2',
    titulo: 'Workshop de Cerâmica Tradicional com Mestre Artesão',
    slug: 'workshop-ceramica-tradicional',
    resumo: 'Aprenda técnicas ancestrais de cerâmica com o renomado mestre artesão José da Silva em um workshop exclusivo.',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.',
    imagem: 'https://images.unsplash.com/photo-1565193566173-7a0af771d71a',
    autor: 'Carlos Santos',
    categorias: ['Workshop', 'Cerâmica'],
    publicado: true,
    dataPublicacao: new Date('2023-08-20'),
    dataCriacao: new Date('2023-08-20'),
    dataAtualizacao: new Date('2023-08-20'),
    visualizacoes: 89,
    tags: ['workshop', 'ceramica', 'tradicional']
  }
];

// GET - Obter todas as notícias ou notícia específica por ID/slug
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const categoria = searchParams.get('categoria');
    const tag = searchParams.get('tag');
    const publicado = searchParams.get('publicado');
    const busca = searchParams.get('busca');
    const limite = parseInt(searchParams.get('limite') || '10');
    const pagina = parseInt(searchParams.get('pagina') || '1');
    
    // Tentar conectar ao banco de dados
    try {
      await dbConnect();
      
      // Buscar notícia específica por ID
      if (id) {
        const noticia = await NoticiaModel.findById(id);
        
        if (!noticia) {
          return NextResponse.json({
            success: false,
            message: 'Notícia não encontrada'
          }, { status: 404 });
        }
        
        return NextResponse.json({
          success: true,
          noticia
        });
      }
      
      // Buscar notícia específica por slug
      if (slug) {
        const noticia = await NoticiaModel.findOne({ slug });
        
        if (!noticia) {
          return NextResponse.json({
            success: false,
            message: 'Notícia não encontrada'
          }, { status: 404 });
        }
        
        // Incrementar visualizações
        await noticia.incrementarVisualizacoes();
        
        return NextResponse.json({
          success: true,
          noticia
        });
      }
      
      // Construir query para busca
      let query: any = {};
      
      // Filtrar apenas publicadas por padrão (a menos que especificado)
      if (publicado !== 'false') {
        query.publicado = true;
        query.dataPublicacao = { $lte: new Date() };
      }
      
      // Filtrar por categoria
      if (categoria) {
        query.categorias = categoria;
      }
      
      // Filtrar por tag
      if (tag) {
        query.tags = tag;
      }
      
      // Busca por texto
      if (busca) {
        query.$text = { $search: busca };
      }
      
      // Calcular paginação
      const skip = (pagina - 1) * limite;
      
      // Executar consulta
      const noticias = await NoticiaModel.find(query)
        .sort({ dataPublicacao: -1 })
        .skip(skip)
        .limit(limite);
      
      // Contar total para paginação
      const total = await NoticiaModel.countDocuments(query);
      
      return NextResponse.json({
        success: true,
        noticias,
        paginacao: {
          total,
          pagina,
          limite,
          paginas: Math.ceil(total / limite)
        }
      });
      
    } catch (dbError) {
      console.warn('Falha ao conectar ao banco de dados. Usando dados simulados.');
      console.error(dbError);
      
      // Usar dados simulados
      let noticiasFiltradas = [...noticiasSimuladas];
      
      // Buscar por ID
      if (id) {
        const noticia = noticiasFiltradas.find(n => n._id === id);
        if (!noticia) {
          return NextResponse.json({
            success: false,
            message: 'Notícia não encontrada'
          }, { status: 404 });
        }
        
        return NextResponse.json({
          success: true,
          noticia
        });
      }
      
      // Buscar por slug
      if (slug) {
        const noticia = noticiasFiltradas.find(n => n.slug === slug);
        if (!noticia) {
          return NextResponse.json({
            success: false,
            message: 'Notícia não encontrada'
          }, { status: 404 });
        }
        
        return NextResponse.json({
          success: true,
          noticia
        });
      }
      
      // Aplicar filtros
      if (categoria) {
        noticiasFiltradas = noticiasFiltradas.filter(n => 
          n.categorias.includes(categoria)
        );
      }
      
      if (tag) {
        noticiasFiltradas = noticiasFiltradas.filter(n => 
          n.tags.includes(tag)
        );
      }
      
      if (busca) {
        const termoBusca = busca.toLowerCase();
        noticiasFiltradas = noticiasFiltradas.filter(n =>
          n.titulo.toLowerCase().includes(termoBusca) ||
          n.resumo.toLowerCase().includes(termoBusca) ||
          n.conteudo.toLowerCase().includes(termoBusca)
        );
      }
      
      // Aplicar paginação
      const total = noticiasFiltradas.length;
      const inicio = (pagina - 1) * limite;
      const fim = inicio + limite;
      const noticiasPaginadas = noticiasFiltradas.slice(inicio, fim);
      
      return NextResponse.json({
        success: true,
        noticias: noticiasPaginadas,
        paginacao: {
          total,
          pagina,
          limite,
          paginas: Math.ceil(total / limite)
        }
      });
    }
    
  } catch (error: any) {
    console.error('Erro ao processar requisição GET para notícias:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar notícias',
      error: error.message
    }, { status: 500 });
  }
}

// POST - Criar nova notícia
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validar dados básicos
    if (!body.titulo || !body.resumo || !body.conteudo || !body.autor) {
      return NextResponse.json({
        success: false,
        message: 'Dados incompletos. Título, resumo, conteúdo e autor são obrigatórios.'
      }, { status: 400 });
    }
    
    try {
      await dbConnect();
      
      // Verificar se já existe uma notícia com o mesmo slug
      if (body.slug) {
        const noticiaExistente = await NoticiaModel.findOne({ slug: body.slug });
        if (noticiaExistente) {
          return NextResponse.json({
            success: false,
            message: 'Já existe uma notícia com este slug'
          }, { status: 409 });
        }
      }
      
      // Criar nova notícia
      const novaNoticia = await NoticiaModel.create(body);
      
      return NextResponse.json({
        success: true,
        message: 'Notícia criada com sucesso',
        noticia: novaNoticia
      }, { status: 201 });
      
    } catch (dbError) {
      console.error('Erro ao conectar ao banco de dados:', dbError);
      return NextResponse.json({
        success: false,
        message: 'Erro ao conectar ao banco de dados'
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Erro ao criar notícia:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar notícia',
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Atualizar notícia existente
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID da notícia é obrigatório'
      }, { status: 400 });
    }
    
    const body = await req.json();
    
    try {
      await dbConnect();
      
      // Verificar se a notícia existe
      const noticiaExistente = await NoticiaModel.findById(id);
      if (!noticiaExistente) {
        return NextResponse.json({
          success: false,
          message: 'Notícia não encontrada'
        }, { status: 404 });
      }
      
      // Verificar slug único (se estiver sendo alterado)
      if (body.slug && body.slug !== noticiaExistente.slug) {
        const slugExistente = await NoticiaModel.findOne({ 
          slug: body.slug, 
          _id: { $ne: id } 
        });
        if (slugExistente) {
          return NextResponse.json({
            success: false,
            message: 'Já existe uma notícia com este slug'
          }, { status: 409 });
        }
      }
      
      // Atualizar notícia
      const noticiaAtualizada = await NoticiaModel.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Notícia atualizada com sucesso',
        noticia: noticiaAtualizada
      });
      
    } catch (dbError) {
      console.error('Erro ao conectar ao banco de dados:', dbError);
      return NextResponse.json({
        success: false,
        message: 'Erro ao conectar ao banco de dados'
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Erro ao atualizar notícia:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao atualizar notícia',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Excluir notícia
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID da notícia é obrigatório'
      }, { status: 400 });
    }
    
    try {
      await dbConnect();
      
      // Verificar se a notícia existe
      const noticia = await NoticiaModel.findById(id);
      if (!noticia) {
        return NextResponse.json({
          success: false,
          message: 'Notícia não encontrada'
        }, { status: 404 });
      }
      
      // Excluir notícia
      await NoticiaModel.findByIdAndDelete(id);
      
      return NextResponse.json({
        success: true,
        message: 'Notícia excluída com sucesso'
      });
      
    } catch (dbError) {
      console.error('Erro ao conectar ao banco de dados:', dbError);
      return NextResponse.json({
        success: false,
        message: 'Erro ao conectar ao banco de dados'
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Erro ao excluir notícia:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao excluir notícia',
      error: error.message
    }, { status: 500 });
  }
} 