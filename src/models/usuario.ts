import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface para o documento de usuário
export interface IUsuario extends Document {
  nome: string;
  email: string;
  senha: string;
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
  isAdmin: boolean;
  ativo: boolean;
  tipo: string; // 'admin' ou 'cliente'
  ultimoLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Método para verificar senha
  compararSenha(senha: string): Promise<boolean>;
}

// Interface para o modelo de usuário
export interface IUsuarioModel extends Model<IUsuario> {
  // Métodos estáticos podem ser definidos aqui
}

// Schema de endereço
const EnderecoSchema = new Schema({
  rua: { type: String, required: [true, 'Rua é obrigatória'] },
  numero: { type: String, required: [true, 'Número é obrigatório'] },
  complemento: { type: String },
  bairro: { type: String, required: [true, 'Bairro é obrigatório'] },
  cidade: { type: String, required: [true, 'Cidade é obrigatória'] },
  estado: { type: String, required: [true, 'Estado é obrigatório'] },
  cep: { type: String, required: [true, 'CEP é obrigatório'] }
}, { _id: false });

// Schema de usuário
const UsuarioSchema = new Schema<IUsuario>({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, forneça um email válido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres']
  },
  telefone: {
    type: String,
    trim: true
  },
  endereco: {
    type: EnderecoSchema
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  tipo: {
    type: String,
    enum: ['admin', 'cliente'],
    default: 'cliente'
  },
  ativo: {
    type: Boolean,
    default: true
  },
  ultimoLogin: {
    type: Date
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Antes de salvar, criptografa a senha se ela foi modificada
UsuarioSchema.pre('save', async function(next) {
  // Só criptografa a senha se foi modificada (ou nova)
  if (!this.isModified('senha')) return next();
  
  try {
    // Gerar um salt para a senha
    const salt = await bcrypt.genSalt(10);
    
    // Criptografar a senha
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Método para comparar senha
UsuarioSchema.methods.compararSenha = async function(senha: string): Promise<boolean> {
  return await bcrypt.compare(senha, this.senha);
};

// Checar se o modelo já existe para evitar erros em desenvolvimento com hot reload
const UsuarioModel = (mongoose.models.Usuario as IUsuarioModel) || 
  mongoose.model<IUsuario, IUsuarioModel>('Usuario', UsuarioSchema);

export default UsuarioModel; 