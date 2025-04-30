import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para as dimensões do produto
export interface IDimensoes {
  altura?: number;
  largura?: number;
  comprimento?: number;
  peso?: number;
}

// Interface para o produto
export interface IProduto extends Document {
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
  dimensoes?: IDimensoes;
  tags?: string[];
  dataCriacao: Date;
  dataAtualizacao?: Date;
}

// Interface para o modelo de Produto
export interface IProdutoModel extends Model<IProduto> {}

// Definir o schema das dimensões
const DimensoesSchema = new Schema<IDimensoes>({
  altura: { type: Number },
  largura: { type: Number },
  comprimento: { type: Number },
  peso: { type: Number }
}, { _id: false });

// Definir o schema do produto
const ProdutoSchema = new Schema<IProduto>(
  {
    nome: {
      type: String,
      required: [true, 'Nome do produto é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
    },
    descricao: {
      type: String,
      required: [true, 'Descrição do produto é obrigatória'],
      trim: true
    },
    preco: {
      type: Number,
      required: [true, 'Preço do produto é obrigatório'],
      min: [0, 'Preço não pode ser negativo']
    },
    precoPromocional: {
      type: Number,
      min: [0, 'Preço promocional não pode ser negativo']
    },
    categoria: {
      type: String,
      required: [true, 'Categoria do produto é obrigatória'],
      trim: true
    },
    subcategoria: {
      type: String,
      trim: true
    },
    quantidade: {
      type: Number,
      default: 0,
      min: [0, 'Quantidade não pode ser negativa']
    },
    destaque: {
      type: Boolean,
      default: false
    },
    disponivel: {
      type: Boolean,
      default: true
    },
    imagens: {
      type: [String],
      required: [true, 'Pelo menos uma imagem é obrigatória'],
      validate: [(val: string[]) => val.length > 0, 'Pelo menos uma imagem é obrigatória']
    },
    artesao: {
      type: String,
      trim: true
    },
    tecnica: {
      type: String,
      trim: true
    },
    material: {
      type: [String]
    },
    dimensoes: DimensoesSchema,
    tags: {
      type: [String]
    },
    dataCriacao: {
      type: Date,
      default: Date.now
    },
    dataAtualizacao: {
      type: Date
    }
  },
  {
    timestamps: {
      createdAt: 'dataCriacao',
      updatedAt: 'dataAtualizacao'
    }
  }
);

// Índices para melhorar a performance de consultas
ProdutoSchema.index({ nome: 'text', descricao: 'text', tags: 'text' });
ProdutoSchema.index({ categoria: 1 });
ProdutoSchema.index({ destaque: 1 });
ProdutoSchema.index({ dataCriacao: -1 });

// Exportar modelo verificando se já existe para evitar erros em desenvolvimento
export const ProdutoModel = (mongoose.models.Produto as IProdutoModel) || 
  mongoose.model<IProduto, IProdutoModel>('Produto', ProdutoSchema);

// Classe de produto para uso na aplicação
export class Produto {
  _id?: string;
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
  dimensoes?: IDimensoes;
  tags?: string[];
  dataCriacao: Date;
  dataAtualizacao?: Date;

  constructor(produto: Partial<Produto>) {
    this.nome = produto.nome || '';
    this.descricao = produto.descricao || '';
    this.preco = produto.preco || 0;
    this.precoPromocional = produto.precoPromocional;
    this.categoria = produto.categoria || '';
    this.subcategoria = produto.subcategoria;
    this.quantidade = produto.quantidade || 0;
    this.destaque = produto.destaque || false;
    this.disponivel = produto.disponivel || true;
    this.imagens = produto.imagens || [];
    this.artesao = produto.artesao;
    this.tecnica = produto.tecnica;
    this.material = produto.material;
    this.dimensoes = produto.dimensoes;
    this.tags = produto.tags;
    this.dataCriacao = produto.dataCriacao || new Date();
    this.dataAtualizacao = produto.dataAtualizacao;
    this._id = produto._id;
  }
} 