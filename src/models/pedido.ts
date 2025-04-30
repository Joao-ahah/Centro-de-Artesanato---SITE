import mongoose, { Schema, Document, Model } from 'mongoose';

// Definindo a interface IEndereco localmente em vez de importá-la
export interface IEndereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface IItemPedido {
  produto: Schema.Types.ObjectId;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  imagem?: string;
}

export interface IPagamento {
  metodo: 'pix' | 'cartao' | 'boleto';
  status: 'pendente' | 'aprovado' | 'recusado' | 'estornado';
  valor: number;
  detalhes?: any;
  dataPagamento?: Date;
  comprovante?: string;
}

// Interface para o documento do pedido - sem estender Document
export interface IPedidoData {
  numero: string;
  usuario: Schema.Types.ObjectId;
  nomeCliente: string;
  emailCliente: string;
  items: IItemPedido[];
  endereco: IEndereco;
  valorFrete: number;
  valorTotal: number;
  valorProdutos: number;
  status: 'aguardando_pagamento' | 'pagamento_aprovado' | 'em_preparacao' | 'enviado' | 'entregue' | 'cancelado';
  pagamento: IPagamento;
  rastreamento?: string;
  observacoes?: string;
  cupomAplicado?: {
    codigo: string;
    desconto: number;
    tipo: 'percentual' | 'valor';
  };
  dataRegistro: Date;
  dataAtualizacao: Date;
  dataCancelamento?: Date;
  dataEnvio?: Date;
  dataEntrega?: Date;
}

// Combinamos nossos dados com o tipo Document do Mongoose
export type IPedido = IPedidoData & Document;

const ItemPedidoSchema = new Schema({
  produto: { type: Schema.Types.ObjectId, ref: 'Produto', required: true },
  nomeProduto: { type: String, required: true },
  quantidade: { type: Number, required: true, min: 1 },
  precoUnitario: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  imagem: { type: String }
});

const PagamentoSchema = new Schema({
  metodo: { 
    type: String, 
    enum: ['pix', 'cartao', 'boleto'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pendente', 'aprovado', 'recusado', 'estornado'], 
    default: 'pendente', 
    required: true 
  },
  valor: { type: Number, required: true },
  detalhes: { type: Schema.Types.Mixed },
  dataPagamento: { type: Date },
  comprovante: { type: String }
});

const EnderecoEntregaSchema = new Schema({
  cep: { type: String, required: true },
  logradouro: { type: String, required: true },
  numero: { type: String, required: true },
  complemento: { type: String },
  bairro: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true }
});

const PedidoSchema = new Schema(
  {
    numero: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    usuario: { 
      type: Schema.Types.ObjectId, 
      ref: 'Usuario', 
      required: true,
      index: true 
    },
    nomeCliente: { type: String, required: true },
    emailCliente: { type: String, required: true },
    items: [ItemPedidoSchema],
    endereco: EnderecoEntregaSchema,
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
    pagamento: PagamentoSchema,
    rastreamento: { type: String },
    observacoes: { type: String },
    cupomAplicado: { 
      codigo: { type: String },
      desconto: { type: Number },
      tipo: { type: String, enum: ['percentual', 'valor'] }
    },
    dataRegistro: { type: Date, default: Date.now, index: true },
    dataAtualizacao: { type: Date, default: Date.now },
    dataCancelamento: { type: Date },
    dataEnvio: { type: Date },
    dataEntrega: { type: Date }
  },
  {
    timestamps: { createdAt: 'dataRegistro', updatedAt: 'dataAtualizacao' }
  }
);

// Geração de número de pedido antes de salvar
PedidoSchema.pre('save', function(next) {
  // Não é necessário fazer type casting já que estamos dentro de um hook do Mongoose
  if (this.isNew) {
    // Gera número do pedido com prefixo ART + timestamp
    const timestamp = Date.now().toString();
    this.numero = `ART${timestamp.substr(-8)}`;
  }
  next();
});

// Índices compostos para consultas comuns
PedidoSchema.index({ usuario: 1, status: 1 });
PedidoSchema.index({ dataRegistro: -1 });
PedidoSchema.index({ status: 1, dataRegistro: -1 });

// Evitar a redefinição do modelo durante hot reloads em desenvolvimento
const PedidoModel = (mongoose.models.Pedido as Model<IPedido>) || 
  mongoose.model<IPedido>('Pedido', PedidoSchema);

export default PedidoModel; 