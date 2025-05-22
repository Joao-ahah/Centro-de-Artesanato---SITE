import mongoose from 'mongoose';
import { ProdutoModel, IProduto } from '../models/produto';
import UsuarioModel, { IUsuario } from '../models/usuario';
import PedidoModel, { IPedido, IItemPedido } from '../models/pedido';
import dbConnect from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

// Produtos de exemplo para inserção
const produtosExemplo = [
  {
    nome: 'Vaso de Cerâmica Artesanal',
    descricao: 'Vaso de cerâmica feito à mão com técnicas tradicionais de olaria. Cada peça é única e possui variações sutis de cor e textura que destacam seu caráter artesanal. Ideal para decoração de ambientes internos.',
    preco: 89.90,
    categoria: 'Decoração',
    subcategoria: 'Vasos',
    quantidade: 15,
    destaque: true,
    disponivel: true,
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
    tags: ['vaso', 'cerâmica', 'decoração', 'artesanal']
  },
  {
    nome: 'Tapete de Macramê',
    descricao: 'Tapete de macramê tecido à mão com cordas naturais de algodão. Design exclusivo inspirado em padrões geométricos brasileiros. Peça versátil que pode ser usada como tapete de centro ou peça decorativa de parede.',
    preco: 129.90,
    categoria: 'Têxteis',
    subcategoria: 'Tapetes',
    quantidade: 8,
    destaque: true,
    disponivel: true,
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
    tags: ['tapete', 'macramê', 'têxtil', 'algodão', 'artesanal']
  },
  {
    nome: 'Colar de Miçangas Coloridas',
    descricao: 'Colar artesanal feito com miçangas de vidro coloridas, inspirado nas tradições indígenas brasileiras. Cada peça é montada manualmente com atenção aos detalhes e combinação harmônica de cores.',
    preco: 49.90,
    categoria: 'Acessórios',
    subcategoria: 'Colares',
    quantidade: 20,
    destaque: false,
    disponivel: true,
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
    tags: ['colar', 'miçangas', 'acessórios', 'colorido', 'artesanal']
  },
  {
    nome: 'Cesto de Palha Trançado',
    descricao: 'Cesto de palha trançado à mão por artesãos locais, utilizando técnicas tradicionais passadas de geração em geração. Perfeito para organização e decoração, trazendo um toque natural e rústico para qualquer ambiente.',
    preco: 79.90,
    categoria: 'Utilidades',
    subcategoria: 'Cestos',
    quantidade: 12,
    destaque: false,
    disponivel: true,
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
    tags: ['cesto', 'palha', 'trançado', 'organização', 'decoração', 'artesanal']
  },
  {
    nome: 'Escultura em Madeira',
    descricao: 'Escultura feita à mão em madeira de lei reciclada, representando a fauna brasileira. Cada peça é esculpida com ferramentas tradicionais e finalizada com óleos naturais que realçam a beleza dos veios da madeira.',
    preco: 159.90,
    precoPromocional: 129.90,
    categoria: 'Decoração',
    subcategoria: 'Esculturas',
    quantidade: 4,
    destaque: false,
    disponivel: true,
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
    tags: ['escultura', 'madeira', 'decoração', 'arte', 'artesanal']
  },
  {
    nome: 'Manta Bordada',
    descricao: 'Manta artesanal em algodão cru com bordados feitos à mão que representam a flora brasileira. Peça decorativa versátil que pode ser usada como colcha leve, manta para sofá ou peça decorativa de parede.',
    preco: 219.90,
    categoria: 'Têxteis',
    subcategoria: 'Mantas',
    quantidade: 0,
    destaque: false,
    disponivel: false,
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
    tags: ['manta', 'bordado', 'têxtil', 'decoração', 'algodão', 'artesanal']
  }
];

// Usuários de exemplo
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
    nome: 'João Silva',
    email: 'joao@email.com',
    senha: 'senha123',
    telefone: '(11) 91234-5678',
    isAdmin: false,
    tipo: 'cliente',
    ativo: true,
    endereco: {
      rua: 'Avenida Brasil',
      numero: '789',
      complemento: 'Apto 42',
      bairro: 'Jardim América',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '04567-890'
    }
  },
  {
    nome: 'Maria Souza',
    email: 'maria@email.com',
    senha: 'senha123',
    telefone: '(21) 98888-7777',
    isAdmin: false,
    tipo: 'cliente',
    ativo: true,
    endereco: {
      rua: 'Rua das Flores',
      numero: '456',
      bairro: 'Flamengo',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22222-333'
    }
  }
];

async function seedDatabase() {
  try {
    // Conectar ao banco de dados
    await dbConnect();
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
    
    // Criar alguns pedidos de exemplo
    const usuario1 = usuariosInseridos[1]; // João
    const usuario2 = usuariosInseridos[2]; // Maria
    
    // Criar um pedido diretamente usando o modelo ao invés de construir objetos com tipos complexos
    const pedido1 = new PedidoModel({
      numero: `ART${Date.now().toString().slice(-8)}`,
      usuario: usuario1._id,
      nomeCliente: usuario1.nome,
      emailCliente: usuario1.email,
      items: [
        {
          produto: produtosInseridos[0]._id,
          nomeProduto: produtosInseridos[0].nome,
          quantidade: 1,
          precoUnitario: produtosInseridos[0].preco,
          subtotal: produtosInseridos[0].preco
        },
        {
          produto: produtosInseridos[1]._id,
          nomeProduto: produtosInseridos[1].nome,
          quantidade: 1,
          precoUnitario: produtosInseridos[1].preco,
          subtotal: produtosInseridos[1].preco
        }
      ],
      endereco: {
        cep: usuario1.endereco.cep,
        logradouro: usuario1.endereco.rua,
        numero: usuario1.endereco.numero,
        complemento: usuario1.endereco.complemento,
        bairro: usuario1.endereco.bairro,
        cidade: usuario1.endereco.cidade,
        estado: usuario1.endereco.estado
      },
      valorFrete: 15.90,
      valorTotal: produtosInseridos[0].preco + produtosInseridos[1].preco + 15.90,
      valorProdutos: produtosInseridos[0].preco + produtosInseridos[1].preco,
      status: 'pagamento_aprovado',
      pagamento: {
        metodo: 'pix',
        status: 'aprovado',
        valor: produtosInseridos[0].preco + produtosInseridos[1].preco + 15.90,
        dataPagamento: new Date()
      },
      dataRegistro: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 dias atrás
    });
    
    // Criar outro pedido
    const pedido2 = new PedidoModel({
      numero: `ART${Date.now().toString().slice(-8)}1`,
      usuario: usuario2._id,
      nomeCliente: usuario2.nome,
      emailCliente: usuario2.email,
      items: [
        {
          produto: produtosInseridos[2]._id,
          nomeProduto: produtosInseridos[2].nome,
          quantidade: 2,
          precoUnitario: produtosInseridos[2].preco,
          subtotal: produtosInseridos[2].preco * 2
        }
      ],
      endereco: {
        cep: usuario2.endereco.cep,
        logradouro: usuario2.endereco.rua,
        numero: usuario2.endereco.numero,
        complemento: usuario2.endereco.complemento,
        bairro: usuario2.endereco.bairro,
        cidade: usuario2.endereco.cidade,
        estado: usuario2.endereco.estado
      },
      valorFrete: 12.50,
      valorTotal: produtosInseridos[2].preco * 2 + 12.50,
      valorProdutos: produtosInseridos[2].preco * 2,
      status: 'aguardando_pagamento',
      pagamento: {
        metodo: 'boleto',
        status: 'pendente',
        valor: produtosInseridos[2].preco * 2 + 12.50
      },
      dataRegistro: new Date() // Hoje
    });
    
    // Criar um terceiro pedido
    const pedido3 = new PedidoModel({
      numero: `ART${Date.now().toString().slice(-8)}2`,
      usuario: usuario1._id,
      nomeCliente: usuario1.nome,
      emailCliente: usuario1.email,
      items: [
        {
          produto: produtosInseridos[4]._id,
          nomeProduto: produtosInseridos[4].nome,
          quantidade: 1,
          precoUnitario: produtosInseridos[4].precoPromocional || produtosInseridos[4].preco,
          subtotal: produtosInseridos[4].precoPromocional || produtosInseridos[4].preco
        },
        {
          produto: produtosInseridos[3]._id,
          nomeProduto: produtosInseridos[3].nome,
          quantidade: 1,
          precoUnitario: produtosInseridos[3].preco,
          subtotal: produtosInseridos[3].preco
        }
      ],
      endereco: {
        cep: usuario1.endereco.cep,
        logradouro: usuario1.endereco.rua,
        numero: usuario1.endereco.numero,
        complemento: usuario1.endereco.complemento,
        bairro: usuario1.endereco.bairro,
        cidade: usuario1.endereco.cidade,
        estado: usuario1.endereco.estado
      },
      valorFrete: 15.90,
      valorTotal: (produtosInseridos[4].precoPromocional || produtosInseridos[4].preco) + produtosInseridos[3].preco + 15.90,
      valorProdutos: (produtosInseridos[4].precoPromocional || produtosInseridos[4].preco) + produtosInseridos[3].preco,
      status: 'entregue',
      pagamento: {
        metodo: 'cartao',
        status: 'aprovado',
        valor: (produtosInseridos[4].precoPromocional || produtosInseridos[4].preco) + produtosInseridos[3].preco + 15.90,
        dataPagamento: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
      },
      rastreamento: 'BR123456789',
      dataRegistro: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 dias atrás
      dataEnvio: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000), // 32 dias atrás
      dataEntrega: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
    });
    
    // Salvar os pedidos
    await pedido1.save();
    await pedido2.save();
    await pedido3.save();
    
    console.log('3 pedidos inseridos com sucesso');
    
    console.log('Banco de dados populado com sucesso!');
    console.log('\nCredenciais de acesso:');
    console.log('Admin: admin@centroartesanato.com.br / senha123');
    console.log('Cliente 1: joao@email.com / senha123');
    console.log('Cliente 2: maria@email.com / senha123');
    
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