import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para o artesão
export interface IArtesao extends Document {
  nome: string;
  especialidade: string;
  descricao: string;
  estado: string;
  cidade: string;
  imagem?: string;
  telefone?: string;
  email?: string;
  redesSociais?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  ativo: boolean;
  dataCriacao: Date;
  dataAtualizacao?: Date;
}

// Interface para o modelo de Artesão
export interface IArtesaoModel extends Model<IArtesao> {}

// Definir o schema do artesão
const ArtesaoSchema = new Schema<IArtesao>(
  {
    nome: {
      type: String,
      required: [true, 'Nome do artesão é obrigatório'],
      trim: true
    },
    especialidade: {
      type: String,
      required: [true, 'Especialidade do artesão é obrigatória'],
      trim: true
    },
    descricao: {
      type: String,
      required: [true, 'Descrição do artesão é obrigatória'],
      trim: true
    },
    estado: {
      type: String,
      required: [true, 'Estado do artesão é obrigatório'],
      trim: true
    },
    cidade: {
      type: String,
      required: [true, 'Cidade do artesão é obrigatória'],
      trim: true
    },
    imagem: {
      type: String
    },
    telefone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    redesSociais: {
      instagram: { type: String, trim: true },
      facebook: { type: String, trim: true },
      website: { type: String, trim: true }
    },
    ativo: {
      type: Boolean,
      default: true
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
ArtesaoSchema.index({ nome: 'text', especialidade: 'text', descricao: 'text' });
ArtesaoSchema.index({ estado: 1, cidade: 1 });
ArtesaoSchema.index({ ativo: 1 });
ArtesaoSchema.index({ dataCriacao: -1 });

// Exportar modelo verificando se já existe para evitar erros em desenvolvimento
export const ArtesaoModel = (mongoose.models.Artesao as IArtesaoModel) || 
  mongoose.model<IArtesao, IArtesaoModel>('Artesao', ArtesaoSchema);

// Classe de artesão para uso na aplicação
export class Artesao {
  _id?: string;
  nome: string;
  especialidade: string;
  descricao: string;
  estado: string;
  cidade: string;
  imagem?: string;
  telefone?: string;
  email?: string;
  redesSociais?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  ativo: boolean;
  dataCriacao: Date;
  dataAtualizacao?: Date;

  constructor(artesao: Partial<Artesao>) {
    this.nome = artesao.nome || '';
    this.especialidade = artesao.especialidade || '';
    this.descricao = artesao.descricao || '';
    this.estado = artesao.estado || '';
    this.cidade = artesao.cidade || '';
    this.imagem = artesao.imagem;
    this.telefone = artesao.telefone;
    this.email = artesao.email;
    this.redesSociais = artesao.redesSociais;
    this.ativo = artesao.ativo ?? true;
    this.dataCriacao = artesao.dataCriacao || new Date();
    this.dataAtualizacao = artesao.dataAtualizacao;
    this._id = artesao._id;
  }
} 