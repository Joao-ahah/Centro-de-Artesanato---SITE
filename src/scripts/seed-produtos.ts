/**
 * Script para popular o banco de dados com produtos de exemplo
 * Execute com: npx ts-node -r tsconfig-paths/register src/scripts/seed-produtos.ts
 */
import mongoose from 'mongoose';
import { ProdutoModel as Produto, IProduto } from '../models/produto';
import dbConnect from '../lib/db';

// Produtos de exemplo para inserção
const produtosExemplo = [
  {
    nome: 'Vaso de Cerâmica Artesanal',
    descricao: 'Vaso de cerâmica feito à mão com técnicas tradicionais de olaria. Cada peça é única e possui variações sutis de cor e textura que destacam seu caráter artesanal. Ideal para decoração de ambientes internos.',
    preco: 89.90,
    categoria: 'Decoração',
    subcategoria: 'Vasos',
    estoque: 15,
    imagens: [
      'https://images.unsplash.com/photo-1612196808214-b40ab98d2efd',
    ],
    artesao: 'Maria Silva',
    tecnica: 'Cerâmica',
    material: ['Argila', 'Esmalte'],
    dimensoes: {
      altura: 25,
      largura: 15,
      comprimento: 15,
      peso: 1.2
    },
    tags: ['vaso', 'cerâmica', 'decoração', 'artesanal'],
    emDestaque: true,
    disponivel: true,
    avaliacoes: []
  },
  {
    nome: 'Tapete de Macramê',
    descricao: 'Tapete de macramê tecido à mão com cordas naturais de algodão. Design exclusivo inspirado em padrões geométricos brasileiros. Peça versátil que pode ser usada como tapete de centro ou peça decorativa de parede.',
    preco: 129.90,
    categoria: 'Têxteis',
    subcategoria: 'Tapetes',
    estoque: 8,
    imagens: [
      'https://images.unsplash.com/photo-1576782231082-d92e889a9823',
    ],
    artesao: 'João Pereira',
    tecnica: 'Macramê',
    material: ['Algodão'],
    dimensoes: {
      largura: 100,
      comprimento: 150,
      peso: 1.5
    },
    tags: ['tapete', 'macramê', 'têxtil', 'algodão', 'artesanal'],
    emDestaque: true,
    disponivel: true,
    avaliacoes: []
  },
  {
    nome: 'Colar de Miçangas Coloridas',
    descricao: 'Colar artesanal feito com miçangas de vidro coloridas, inspirado nas tradições indígenas brasileiras. Cada peça é montada manualmente com atenção aos detalhes e combinação harmônica de cores.',
    preco: 49.90,
    categoria: 'Acessórios',
    subcategoria: 'Colares',
    estoque: 20,
    imagens: [
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638',
    ],
    artesao: 'Ana Oliveira',
    tecnica: 'Enfiação',
    material: ['Miçangas de vidro', 'Fio de nylon'],
    dimensoes: {
      comprimento: 45,
      peso: 0.1
    },
    tags: ['colar', 'miçangas', 'acessórios', 'colorido', 'artesanal'],
    emDestaque: false,
    disponivel: true,
    avaliacoes: []
  },
  {
    nome: 'Cesto de Palha Trançado',
    descricao: 'Cesto de palha trançado à mão por artesãos locais, utilizando técnicas tradicionais passadas de geração em geração. Perfeito para organização e decoração, trazendo um toque natural e rústico para qualquer ambiente.',
    preco: 79.90,
    categoria: 'Utilidades',
    subcategoria: 'Cestos',
    estoque: 12,
    imagens: [
      'https://images.unsplash.com/photo-1595159278004-b91b1cdfcada',
    ],
    artesao: 'José Santos',
    tecnica: 'Trançado',
    material: ['Palha natural'],
    dimensoes: {
      altura: 20,
      largura: 30,
      comprimento: 30,
      peso: 0.8
    },
    tags: ['cesto', 'palha', 'trançado', 'organização', 'decoração', 'artesanal'],
    emDestaque: false,
    disponivel: true,
    avaliacoes: []
  },
  {
    nome: 'Escultura em Madeira',
    descricao: 'Escultura feita à mão em madeira de lei reciclada, representando a fauna brasileira. Cada peça é esculpida com ferramentas tradicionais e finalizada com óleos naturais que realçam a beleza dos veios da madeira.',
    preco: 159.90,
    precoPromocional: 129.90,
    categoria: 'Decoração',
    subcategoria: 'Esculturas',
    estoque: 4,
    imagens: [
      'https://images.unsplash.com/photo-1582131503261-fca1d1c0589f',
    ],
    artesao: 'Roberto Lima',
    tecnica: 'Entalhe',
    material: ['Madeira de lei'],
    dimensoes: {
      altura: 30,
      largura: 15,
      comprimento: 10,
      peso: 1.0
    },
    tags: ['escultura', 'madeira', 'decoração', 'arte', 'artesanal'],
    emDestaque: false,
    disponivel: true,
    avaliacoes: []
  },
  {
    nome: 'Manta Bordada',
    descricao: 'Manta artesanal em algodão cru com bordados feitos à mão que representam a flora brasileira. Peça decorativa versátil que pode ser usada como colcha leve, manta para sofá ou peça decorativa de parede.',
    preco: 219.90,
    categoria: 'Têxteis',
    subcategoria: 'Mantas',
    estoque: 0,
    imagens: [
      'https://images.unsplash.com/photo-1594040226829-7f251ab46d80',
    ],
    artesao: 'Tereza Souza',
    tecnica: 'Bordado à mão',
    material: ['Algodão', 'Linhas naturais'],
    dimensoes: {
      largura: 150,
      comprimento: 200,
      peso: 1.2
    },
    tags: ['manta', 'bordado', 'têxtil', 'decoração', 'algodão', 'artesanal'],
    emDestaque: false,
    disponivel: false,
    avaliacoes: []
  }
];

async function seedDatabase() {
  try {
    // Conectar ao banco de dados
    await dbConnect();
    console.log('Conectado ao MongoDB');
    
    // Verificar se já existem produtos
    const count = await Produto.countDocuments();
    
    if (count > 0) {
      console.log(`Já existem ${count} produtos no banco de dados. Deseja substituí-los? (s/n)`);
      // Como estamos em um script, vamos continuar mesmo com produtos existentes
      console.log('Continuando com a inserção de novos produtos...');
      
      // Em um ambiente interativo, você poderia perguntar ao usuário
      // e aguardar uma resposta antes de continuar
    }
    
    // Remover produtos existentes (opcional)
    // await Produto.deleteMany({});
    // console.log('Produtos existentes removidos');
    
    // Inserir novos produtos
    const result = await Produto.create(produtosExemplo);
    console.log(`${Array.isArray(result) ? result.length : 1} produtos inseridos com sucesso!`);
    
    // Exibir IDs dos produtos inseridos
    if (Array.isArray(result)) {
      result.forEach((produto, index) => {
        console.log(`${index + 1}. ${produto.nome} - ID: ${produto._id}`);
      });
    } else if (result) {
      console.log(`1. ${(result as IProduto).nome} - ID: ${(result as IProduto)._id}`);
    }
    
    // Desconectar do banco de dados
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
    
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
    // Certificar-se de desconectar em caso de erro
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

// Executar o script
seedDatabase(); 