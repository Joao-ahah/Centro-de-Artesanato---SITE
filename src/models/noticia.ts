import mongoose, { Schema, Document } from 'mongoose';

// Interface para o documento de Notícia
export interface INoticia extends Document {
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  imagem: string;
  autor: string;
  categorias: string[];
  publicado: boolean;
  dataPublicacao: Date;
  dataCriacao: Date;
  dataAtualizacao: Date;
  visualizacoes: number;
  tags: string[];
}

// Schema da Notícia
const NoticiaSchema: Schema = new Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [200, 'Título não pode ter mais de 200 caracteres']
  },
  slug: {
    type: String,
    required: [true, 'Slug é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true
  },
  resumo: {
    type: String,
    required: [true, 'Resumo é obrigatório'],
    trim: true,
    maxlength: [500, 'Resumo não pode ter mais de 500 caracteres']
  },
  conteudo: {
    type: String,
    required: [true, 'Conteúdo é obrigatório'],
    trim: true
  },
  imagem: {
    type: String,
    required: [true, 'Imagem é obrigatória'],
    trim: true
  },
  autor: {
    type: String,
    required: [true, 'Autor é obrigatório'],
    trim: true
  },
  categorias: [{
    type: String,
    trim: true
  }],
  publicado: {
    type: Boolean,
    default: false
  },
  dataPublicacao: {
    type: Date,
    default: null
  },
  visualizacoes: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: {
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao'
  }
});

// Índices para melhor performance
NoticiaSchema.index({ slug: 1 });
NoticiaSchema.index({ publicado: 1, dataPublicacao: -1 });
NoticiaSchema.index({ categorias: 1 });
NoticiaSchema.index({ tags: 1 });
NoticiaSchema.index({ titulo: 'text', resumo: 'text', conteudo: 'text' });

// Middleware para gerar slug automaticamente
NoticiaSchema.pre('save', function(next) {
  if (this.isModified('titulo') && !this.slug) {
    this.slug = (this.titulo as string)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();
  }
  next();
});

// Middleware para definir data de publicação
NoticiaSchema.pre('save', function(next) {
  if (this.isModified('publicado') && this.publicado && !this.dataPublicacao) {
    this.dataPublicacao = new Date();
  }
  next();
});

// Método para incrementar visualizações
NoticiaSchema.methods.incrementarVisualizacoes = function() {
  this.visualizacoes += 1;
  return this.save();
};

// Método estático para buscar notícias publicadas
NoticiaSchema.statics.buscarPublicadas = function(filtros = {}) {
  return this.find({ 
    publicado: true, 
    dataPublicacao: { $lte: new Date() },
    ...filtros 
  }).sort({ dataPublicacao: -1 });
};

// Método estático para buscar por categoria
NoticiaSchema.statics.buscarPorCategoria = function(categoria: string) {
  return (this as any).buscarPublicadas({ categorias: categoria });
};

// Método estático para buscar por tag
NoticiaSchema.statics.buscarPorTag = function(tag: string) {
  return (this as any).buscarPublicadas({ tags: tag });
};

// Exportar o modelo
export const NoticiaModel = mongoose.models.Noticia || mongoose.model<INoticia>('Noticia', NoticiaSchema); 