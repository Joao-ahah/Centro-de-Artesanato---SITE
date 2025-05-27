import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose, { Schema } from 'mongoose';
import nodemailer from 'nodemailer';

// Interface para encomenda
interface IEncomenda extends mongoose.Document {
  produtoId: string;
  produtoNome: string;
  nome: string;
  email: string;
  telefone?: string;
  quantidade: number;
  observacoes?: string;
  prazoDesejado?: string;
  dataEnvio: Date;
  status: 'pendente' | 'em_analise' | 'orcamento_enviado' | 'aprovado' | 'rejeitado' | 'concluido';
  valorOrcamento?: number;
  observacoesAdmin?: string;
}

// Schema para encomenda
const EncomendaSchema = new Schema<IEncomenda>({
  produtoId: {
    type: String,
    required: [true, 'ID do produto é obrigatório']
  },
  produtoNome: {
    type: String,
    required: [true, 'Nome do produto é obrigatório']
  },
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    trim: true,
    lowercase: true
  },
  telefone: {
    type: String,
    trim: true
  },
  quantidade: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: 1
  },
  observacoes: {
    type: String,
    trim: true
  },
  prazoDesejado: {
    type: String,
    trim: true
  },
  dataEnvio: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pendente', 'em_analise', 'orcamento_enviado', 'aprovado', 'rejeitado', 'concluido'],
    default: 'pendente'
  },
  valorOrcamento: {
    type: Number,
    min: 0
  },
  observacoesAdmin: {
    type: String,
    trim: true
  }
});

// Model para encomenda (verificando se já existe para evitar redefinição)
const EncomendaModel = (mongoose.models.Encomenda as mongoose.Model<IEncomenda>) || 
  mongoose.model<IEncomenda>('Encomenda', EncomendaSchema);

// Email para receber as encomendas
const EMAIL_DESTINO = process.env.EMAIL_CONTATO || 'associcaoaapr@gmail.com';

// Função para enviar email de notificação de encomenda
async function enviarEmailEncomenda(encomenda: IEncomenda) {
  try {
    console.log(`[ENVIANDO EMAIL ENCOMENDA] Nova solicitação de ${encomenda.nome} (${encomenda.email})`);
    console.log(`Produto: ${encomenda.produtoNome} - Quantidade: ${encomenda.quantidade}`);
    console.log(`Enviando para: ${EMAIL_DESTINO}`);
    
    // Configurações do email
    const emailUser = process.env.EMAIL_USER || 'associcaoaapr@gmail.com';
    const emailPassword = process.env.EMAIL_PASSWORD || '*centroa25@';
    
    console.log(`Usando email: ${emailUser}`);
    
    // Implementação com Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verificar conexão
    await transporter.verify();
    console.log('Conexão com servidor de email verificada com sucesso');

    const mailOptions = {
      from: `"Centro de Artesanato - Encomendas" <${emailUser}>`,
      to: EMAIL_DESTINO,
      replyTo: encomenda.email,
      subject: `[ENCOMENDA] ${encomenda.nome}: ${encomenda.produtoNome}`,
      text: `
NOVA SOLICITAÇÃO DE ENCOMENDA

Produto: ${encomenda.produtoNome}
Cliente: ${encomenda.nome}
Email: ${encomenda.email}
Telefone: ${encomenda.telefone || 'Não informado'}
Quantidade: ${encomenda.quantidade}
Prazo desejado: ${encomenda.prazoDesejado || 'Não especificado'}

Observações:
${encomenda.observacoes || 'Nenhuma observação'}

---
Para responder: Clique em "Responder" que sua resposta irá direto para ${encomenda.email}
Enviado em: ${new Date().toLocaleString('pt-BR')}
ID da solicitação: ${encomenda._id}
Sistema de Encomendas - Centro de Artesanato
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            🛒 Nova Solicitação de Encomenda
          </h2>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin-top: 0;">🎨 Produto: ${encomenda.produtoNome}</h3>
            <p><strong>📦 Quantidade solicitada:</strong> ${encomenda.quantidade} unidades</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #6b7280;">
            <h3 style="color: #374151; margin-top: 0;">👤 Dados do Cliente</h3>
            <p><strong>📧 Nome:</strong> ${encomenda.nome}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${encomenda.email}" style="color: #1e40af;">${encomenda.email}</a></p>
            <p><strong>📞 Telefone:</strong> ${encomenda.telefone || 'Não informado'}</p>
            <p><strong>⏰ Prazo desejado:</strong> ${encomenda.prazoDesejado || 'Não especificado'}</p>
          </div>
          
          ${encomenda.observacoes ? `
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0;">📝 Observações e Personalizações</h3>
            <p style="line-height: 1.6; color: #4b5563; font-size: 16px;">${encomenda.observacoes.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #dcfce7; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <p style="color: #166534; font-weight: bold; margin: 0;">
              💡 Para responder: Clique em "Responder" e sua mensagem irá direto para o cliente!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">
              Enviado em: ${new Date().toLocaleString('pt-BR')}<br>
              ID da solicitação: ${encomenda._id}<br>
              🏪 Centro de Artesanato - Sistema de Encomendas
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email de encomenda enviado com sucesso:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('Erro detalhado ao enviar email de encomenda:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    return false;
  }
}

// Rota para criar nova encomenda
export async function POST(req: NextRequest) {
  try {
    console.log('[ENCOMENDA API] Recebendo nova solicitação de encomenda');
    
    // Conectar ao banco de dados
    const db = await dbConnect();
    if (!db) {
      console.error('[ENCOMENDA API] Erro ao conectar ao banco de dados');
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ao banco de dados' 
      }, { status: 500 });
    }

    // Obter dados do corpo da requisição
    const data = await req.json();
    console.log('[ENCOMENDA API] Dados recebidos:', { 
      produtoNome: data.produtoNome,
      nome: data.nome, 
      email: data.email, 
      quantidade: data.quantidade 
    });

    // Validar dados necessários
    if (!data.produtoId || !data.produtoNome || !data.nome || !data.email || !data.quantidade) {
      console.error('[ENCOMENDA API] Dados obrigatórios faltando');
      return NextResponse.json({ 
        success: false, 
        message: 'Produto, nome, email e quantidade são obrigatórios' 
      }, { status: 400 });
    }

    // Validar quantidade
    const quantidade = parseInt(data.quantidade);
    if (isNaN(quantidade) || quantidade < 1) {
      return NextResponse.json({ 
        success: false, 
        message: 'Quantidade deve ser um número maior que zero' 
      }, { status: 400 });
    }

    // Criar nova encomenda
    const encomenda = await EncomendaModel.create({
      produtoId: data.produtoId,
      produtoNome: data.produtoNome,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      quantidade: quantidade,
      observacoes: data.observacoes,
      prazoDesejado: data.prazoDesejado,
      dataEnvio: new Date(),
      status: 'pendente'
    });

    console.log('[ENCOMENDA API] Encomenda salva no banco:', encomenda._id);

    // Enviar email de notificação
    const emailEnviado = await enviarEmailEncomenda(encomenda);
    
    if (emailEnviado) {
      console.log('[ENCOMENDA API] Email enviado com sucesso');
      return NextResponse.json({
        success: true,
        message: 'Solicitação de encomenda enviada com sucesso! Entraremos em contato em até 24 horas.',
        id: encomenda._id
      });
    } else {
      console.log('[ENCOMENDA API] Falha no envio do email, mas encomenda foi salva');
      return NextResponse.json({
        success: true,
        message: 'Solicitação recebida com sucesso! Entraremos em contato em breve.',
        id: encomenda._id,
        warning: 'Email será enviado em breve'
      });
    }
  } catch (error: any) {
    console.error('[ENCOMENDA API] Erro ao processar encomenda:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao processar sua solicitação. Tente novamente mais tarde.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Rota para listar encomendas (para admin)
export async function GET(req: NextRequest) {
  try {
    // Conectar ao banco de dados
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ao banco de dados' 
      }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Construir filtro
    const filter: any = {};
    if (status && status !== 'todos') {
      filter.status = status;
    }

    // Buscar encomendas
    const encomendas = await EncomendaModel
      .find(filter)
      .sort({ dataEnvio: -1 })
      .skip(skip)
      .limit(limit);

    // Contar total
    const total = await EncomendaModel.countDocuments(filter);

    return NextResponse.json({
      success: true,
      encomendas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar encomendas:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar encomendas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 