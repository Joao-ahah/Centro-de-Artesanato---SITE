const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

// Função para conectar ao MongoDB
async function connectDB() {
  try {
    // Verifica se a URL do MongoDB está definida
    if (!process.env.MONGODB_URI) {
      console.warn('MongoDB URI não configurado no arquivo .env.local');
      return null;
    }

    // Tenta conectar ao MongoDB
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Conexão com MongoDB estabelecida');
    
    return connection;
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error);
    return null;
  }
}

// Função principal para popular o banco de dados
async function seedDatabase() {
  try {
    // Conectar ao banco de dados
    const connection = await connectDB();
    if (!connection) {
      console.error('Não foi possível conectar ao MongoDB');
      process.exit(1);
    }
    
    // Carregar os modelos
    const ProdutoModel = require('../models/produto').ProdutoModel;
    const UsuarioModel = require('../models/usuario').default;
    const PedidoModel = require('../models/pedido').default;
    
    console.log('Modelos carregados com sucesso');
    
    // Limpar coleções existentes
    await Promise.all([
      ProdutoModel.deleteMany({}),
      UsuarioModel.deleteMany({}),
      PedidoModel.deleteMany({})
    ]);
    console.log('Coleções limpas com sucesso');
    
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
      }
    ];
    
    // Inserir usuários
    const usuariosInseridos = await UsuarioModel.create(usuariosExemplo);
    console.log(`${usuariosInseridos.length} usuários inseridos com sucesso`);
    
    // Inserir produtos
    const produtosInseridos = await ProdutoModel.create(produtosExemplo);
    console.log(`${produtosInseridos.length} produtos inseridos com sucesso`);
    
    // Criar um pedido de exemplo
    const pedido = new PedidoModel({
      numero: `ART${Date.now().toString().slice(-8)}`,
      usuario: usuariosInseridos[1]._id, // João
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
    console.log('Cliente: joao@email.com / senha123');
    
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