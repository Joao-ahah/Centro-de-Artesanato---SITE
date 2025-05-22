// Simple seeding script
const mongoose = require('mongoose');
const { Schema } = mongoose;
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Carregar variáveis de ambiente do arquivo .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('MongoDB URI:', process.env.MONGODB_URI);

// Definir o esquema de Produto
const produtoSchema = new Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
  precoPromocional: { type: Number },
  categoria: { type: String, required: true },
  subcategoria: { type: String },
  quantidade: { type: Number, default: 0 },
  destaque: { type: Boolean, default: false },
  disponivel: { type: Boolean, default: true },
  imagens: [{ type: String }],
  artesao: { type: String },
  tecnica: { type: String },
  material: [{ type: String }],
  dimensoes: {
    altura: { type: Number },
    largura: { type: Number },
    comprimento: { type: Number },
    peso: { type: Number }
  },
  tags: [{ type: String }],
  dataRegistro: { type: Date, default: Date.now }
});

// Definir o esquema de Usuário
const enderecoSchema = new Schema({
  rua: { type: String, required: true },
  numero: { type: String, required: true },
  complemento: { type: String },
  bairro: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
  cep: { type: String, required: true }
});

const usuarioSchema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  senha: { type: String, required: true },
  telefone: { type: String },
  isAdmin: { type: Boolean, default: false },
  tipo: { type: String, enum: ['admin', 'cliente', 'artesao'], default: 'cliente' },
  ativo: { type: Boolean, default: true },
  endereco: enderecoSchema,
  ultimoLogin: { type: Date },
  dataRegistro: { type: Date, default: Date.now }
});

// Método para cifrar a senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Definir o esquema de Pedido
const itemPedidoSchema = new Schema({
  produto: { type: Schema.Types.ObjectId, ref: 'Produto', required: true },
  nomeProduto: { type: String, required: true },
  quantidade: { type: Number, required: true, min: 1 },
  precoUnitario: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const pagamentoSchema = new Schema({
  metodo: { type: String, enum: ['pix', 'cartao', 'boleto'], required: true },
  status: { type: String, enum: ['pendente', 'aprovado', 'recusado', 'estornado'], default: 'pendente', required: true },
  valor: { type: Number, required: true },
  detalhes: { type: Schema.Types.Mixed },
  dataPagamento: { type: Date }
});

const enderecoEntregaSchema = new Schema({
  cep: { type: String, required: true },
  logradouro: { type: String, required: true },
  numero: { type: String, required: true },
  complemento: { type: String },
  bairro: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true }
});

const pedidoSchema = new Schema({
  numero: { type: String, required: true, unique: true, index: true },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  nomeCliente: { type: String, required: true },
  emailCliente: { type: String, required: true },
  items: [itemPedidoSchema],
  endereco: enderecoEntregaSchema,
  valorFrete: { type: Number, required: true, default: 0 },
  valorTotal: { type: Number, required: true },
  valorProdutos: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['aguardando_pagamento', 'pagamento_aprovado', 'em_preparacao', 'enviado', 'entregue', 'cancelado'], 
    default: 'aguardando_pagamento', 
    required: true,
    index: true 
  },
  pagamento: pagamentoSchema,
  dataRegistro: { type: Date, default: Date.now, index: true }
});

// Registrar os modelos
const ProdutoModel = mongoose.model('Produto', produtoSchema);
const UsuarioModel = mongoose.model('Usuario', usuarioSchema);
const PedidoModel = mongoose.model('Pedido', pedidoSchema);

// Dados de exemplo para inserir
const produtosExemplo = [
  {
    nome: 'Vaso de Cerâmica Artesanal',
    descricao: 'Vaso de cerâmica feito à mão com técnicas tradicionais de olaria.',
    preco: 89.90,
    categoria: 'Decoração',
    subcategoria: 'Vasos',
    quantidade: 15,
    destaque: true,
    disponivel: true,
    imagens: ['https://images.unsplash.com/photo-1612196808214-b40ab98d2efd'],
    artesao: 'Maria Silva',
    tecnica: 'Cerâmica',
    material: ['Argila', 'Esmalte'],
    dimensoes: {
      altura: 25,
      largura: 15,
      comprimento: 15,
      peso: 1.2
    },
    tags: ['vaso', 'cerâmica', 'decoração', 'artesanal']
  },
  {
    nome: 'Tapete de Macramê',
    descricao: 'Tapete de macramê tecido à mão com cordas naturais de algodão.',
    preco: 129.90,
    categoria: 'Têxteis',
    subcategoria: 'Tapetes',
    quantidade: 8,
    destaque: true,
    disponivel: true,
    imagens: ['https://images.unsplash.com/photo-1576782231082-d92e889a9823'],
    tags: ['tapete', 'macramê', 'têxtil', 'artesanal']
  }
];

const usuariosExemplo = [
  {
    nome: 'Administrador',
    email: 'admin@centroartesanato.com.br',
    senha: 'senha123',
    telefone: '(11) 98765-4321',
    isAdmin: true,
    tipo: 'admin',
    ativo: true,
    endereco: {
      rua: 'Rua das Artes',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    }
  },
  {
    nome: 'Cliente Teste',
    email: 'cliente@email.com',
    senha: 'senha123',
    telefone: '(11) 91234-5678',
    isAdmin: false,
    tipo: 'cliente',
    ativo: true,
    endereco: {
      rua: 'Avenida Brasil',
      numero: '789',
      bairro: 'Jardim América',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '04567-890'
    }
  }
];

async function seedDatabase() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/centro-artesanato');
    console.log('Conectado ao MongoDB');
    
    // Limpar coleções existentes
    await Promise.all([
      ProdutoModel.deleteMany({}),
      UsuarioModel.deleteMany({}),
      PedidoModel.deleteMany({})
    ]);
    console.log('Coleções limpas com sucesso');
    
    // Inserir usuários
    const usuariosInseridos = await UsuarioModel.create(usuariosExemplo);
    console.log(`${usuariosInseridos.length} usuários inseridos com sucesso`);
    
    // Inserir produtos
    const produtosInseridos = await ProdutoModel.create(produtosExemplo);
    console.log(`${produtosInseridos.length} produtos inseridos com sucesso`);
    
    // Criar um pedido de exemplo
    const pedido = new PedidoModel({
      numero: `ART${Date.now().toString().slice(-6)}`,
      usuario: usuariosInseridos[1]._id, // Cliente
      nomeCliente: usuariosInseridos[1].nome,
      emailCliente: usuariosInseridos[1].email,
      items: [
        {
          produto: produtosInseridos[0]._id,
          nomeProduto: produtosInseridos[0].nome,
          quantidade: 1,
          precoUnitario: produtosInseridos[0].preco,
          subtotal: produtosInseridos[0].preco
        }
      ],
      endereco: {
        cep: usuariosInseridos[1].endereco.cep,
        logradouro: usuariosInseridos[1].endereco.rua,
        numero: usuariosInseridos[1].endereco.numero,
        complemento: usuariosInseridos[1].endereco.complemento,
        bairro: usuariosInseridos[1].endereco.bairro,
        cidade: usuariosInseridos[1].endereco.cidade,
        estado: usuariosInseridos[1].endereco.estado
      },
      valorFrete: 15.90,
      valorTotal: produtosInseridos[0].preco + 15.90,
      valorProdutos: produtosInseridos[0].preco,
      status: 'pagamento_aprovado',
      pagamento: {
        metodo: 'pix',
        status: 'aprovado',
        valor: produtosInseridos[0].preco + 15.90,
        dataPagamento: new Date()
      }
    });
    
    await pedido.save();
    console.log('1 pedido inserido com sucesso');
    
    console.log('Banco de dados populado com sucesso!');
    console.log('\nCredenciais de acesso:');
    console.log('Admin: admin@centroartesanato.com.br / senha123');
    console.log('Cliente: cliente@email.com / senha123');
    
    // Desconectar do banco de dados
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
    process.exit(0);
    
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