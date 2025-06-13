import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para o produto
export interface IProduto extends Document {
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  categoria: string;
  subcategoria?: string;
  imagens: string[];
  destaque: boolean;
  quantidade: number;
  material?: string;
  dimensoes?: string;
  peso?: number;
  artesao?: string;
  dataCriacao: Date;
  dataAtualizacao?: Date;
  avaliacao?: number;
  totalAvaliacoes?: number;
  tags?: string[];
  ativo: boolean;
  avaliacoes?: Array<{
    usuario: string;
    nome: string;
    nota: number;
    comentario?: string;
    data: Date;
  }>;
}

// Interface para o modelo de Produto
export interface IProdutoModel extends Model<IProduto> {}

// Definir o schema do produto
const ProdutoSchema = new Schema<IProduto>(
  {
    nome: {
      type: String,
      required: [true, 'Nome do produto é obrigatório'],
      trim: true
    },
    descricao: {
      type: String,
      required: [true, 'Descrição do produto é obrigatória'],
      trim: true
    },
    preco: {
      type: Number,
      required: [true, 'Preço do produto é obrigatório'],
      min: 0
    },
    precoOriginal: {
      type: Number,
      min: 0
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
    imagens: {
      type: [String],
      default: []
    },
    destaque: {
      type: Boolean,
      default: false
    },
    quantidade: {
      type: Number,
      required: [true, 'Quantidade em estoque é obrigatória'],
      min: 0,
      default: 0
    },
    material: {
      type: String,
      trim: true
    },
    dimensoes: {
      type: String,
      trim: true
    },
    peso: {
      type: Number,
      min: 0
    },
    artesao: {
      type: String,
      trim: true
    },
    dataCriacao: {
      type: Date,
      default: Date.now
    },
    dataAtualizacao: {
      type: Date
    },
    avaliacao: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalAvaliacoes: {
      type: Number,
      min: 0,
      default: 0
    },
    tags: {
      type: [String]
    },
    ativo: {
      type: Boolean,
      default: true
    },
    avaliacoes: {
      type: [
        {
          usuario: String,
          nome: String,
          nota: Number,
          comentario: String,
          data: Date
        }
      ]
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
ProdutoSchema.index({ nome: 'text', descricao: 'text', categoria: 'text', tags: 'text' });
ProdutoSchema.index({ categoria: 1, subcategoria: 1 });
ProdutoSchema.index({ destaque: 1 });
ProdutoSchema.index({ preco: 1 });
ProdutoSchema.index({ quantidade: 1 });
ProdutoSchema.index({ ativo: 1 });
ProdutoSchema.index({ dataCriacao: -1 });

// Middleware para atualizar dataAtualizacao automaticamente
ProdutoSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.dataAtualizacao = new Date();
  }
  next();
});

ProdutoSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ dataAtualizacao: new Date() });
  next();
});

// Exportar modelo verificando se já existe para evitar erros em desenvolvimento
export const ProdutoModel = (mongoose.models.Produto as IProdutoModel) || 
  mongoose.model<IProduto, IProdutoModel>('Produto', ProdutoSchema);

// Classe de produto para uso na aplicação (sem depender do Mongoose)
export class Produto {
  _id?: string;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  categoria: string;
  subcategoria?: string;
  imagens: string[];
  destaque: boolean;
  quantidade: number;
  material?: string;
  dimensoes?: string;
  peso?: number;
  artesao?: string;
  dataCriacao: Date;
  dataAtualizacao?: Date;
  avaliacao?: number;
  totalAvaliacoes?: number;
  tags?: string[];
  ativo: boolean;
  avaliacoes?: Array<{
    usuario: string;
    nome: string;
    nota: number;
    comentario?: string;
    data: Date;
  }>;

  constructor(produto: Partial<Produto>) {
    this.nome = produto.nome || '';
    this.descricao = produto.descricao || '';
    this.preco = produto.preco || 0;
    this.precoOriginal = produto.precoOriginal;
    this.categoria = produto.categoria || '';
    this.subcategoria = produto.subcategoria;
    this.imagens = produto.imagens || [];
    this.destaque = produto.destaque ?? false;
    this.quantidade = produto.quantidade ?? 0;
    this.material = produto.material;
    this.dimensoes = produto.dimensoes;
    this.peso = produto.peso;
    this.artesao = produto.artesao;
    this.dataCriacao = produto.dataCriacao || new Date();
    this.dataAtualizacao = produto.dataAtualizacao;
    this.avaliacao = produto.avaliacao;
    this.totalAvaliacoes = produto.totalAvaliacoes;
    this.tags = produto.tags;
    this.ativo = produto.ativo ?? true;
    this.avaliacoes = produto.avaliacoes;
    this._id = produto._id;
  }
} 