// Definições globais de tipos para o projeto Centro de Artesanato

// Interfaces para o usuário
interface User {
  _id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  telefone?: string;
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  dataCriacao: string;
}

// Interface para o produto
interface Produto {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoPromocional?: number;
  categoria: string;
  subcategoria?: string;
  quantidade: number;
  destaque: boolean;
  disponivel: boolean;
  imagens: string[];
  artesao?: string;
  tecnica?: string;
  material?: string[];
  dimensoes?: {
    altura?: number;
    largura?: number;
    comprimento?: number;
    peso?: number;
  };
  tags?: string[];
  dataCriacao: string;
  dataAtualizacao?: string;
}

// Interface para o pedido/carrinho
interface Pedido {
  _id: string;
  usuario: string | User;
  itens: {
    produto: string | Produto;
    quantidade: number;
    precoUnitario: number;
  }[];
  total: number;
  status: 'pendente' | 'pago' | 'enviado' | 'entregue' | 'cancelado';
  pagamento: {
    metodo: 'cartao' | 'boleto' | 'pix';
    status: 'pendente' | 'aprovado' | 'recusado';
    comprovante?: string;
  };
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  dataCriacao: string;
  dataAtualizacao?: string;
}

// Interface para estatísticas do dashboard
interface DashboardData {
  totalProdutos: number;
  produtosEmDestaque: number;
  produtosEsgotados: number;
  totalPedidos: number;
  pedidosPendentes: number;
  vendasHoje: number;
  vendasMes: number;
  clientesNovos: number;
}

// Declarações para variáveis de ambiente
declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
} 