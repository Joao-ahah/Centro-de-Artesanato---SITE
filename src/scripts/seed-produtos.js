/**
 * Script simplificado para popular o banco de dados com produtos de exemplo
 * Execute com: node src/scripts/seed-produtos.js
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/centro-artesanato';

// Definir o esquema do produto
const produtoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, index: true },
    descricao: { type: String, required: true },
    preco: { type: Number, required: true },
    precoPromocional: { type: Number },
    categoria: { type: String, required: true, index: true },
    subcategoria: { type: String },
    estoque: { type: Number, required: true, default: 0 },
    imagens: [{ type: String }],
    artesao: { type: String, required: true },
    tecnica: { type: String, required: true },
    material: [{ type: String, required: true }],
    dimensoes: {
      altura: { type: Number },
      largura: { type: Number },
      comprimento: { type: Number },
      peso: { type: Number }
    },
    tags: [{ type: String, index: true }],
    emDestaque: { type: Boolean, default: false, index: true },
    disponivel: { type: Boolean, default: true, index: true },
    avaliacoes: [
      {
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
        nome: { type: String, required: true },
        nota: { type: Number, required: true, min: 1, max: 5 },
        comentario: { type: String },
        data: { type: Date, default: Date.now }
      }
    ],
    dataRegistro: { type: Date, default: Date.now },
    dataAtualizacao: { type: Date, default: Date.now }
  },
  {
    timestamps: { createdAt: 'dataRegistro', updatedAt: 'dataAtualizacao' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

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
  }
];

async function seedDatabase() {
  try {
    console.log('Tentando conectar ao MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB');
    
    // Registrar modelo de Produto
    const Produto = mongoose.models.Produto || mongoose.model('Produto', produtoSchema);
    
    // Verificar se já existem produtos
    const count = await Produto.countDocuments();
    console.log(`Encontrados ${count} produtos no banco de dados.`);
    
    // Inserir novos produtos
    const result = await Produto.create(produtosExemplo);
    console.log(`${Array.isArray(result) ? result.length : 1} produtos inseridos com sucesso!`);
    
    // Exibir IDs dos produtos inseridos
    if (Array.isArray(result)) {
      result.forEach((produto, index) => {
        console.log(`${index + 1}. ${produto.nome} - ID: ${produto._id}`);
      });
    } else {
      console.log(`1. ${result.nome} - ID: ${result._id}`);
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