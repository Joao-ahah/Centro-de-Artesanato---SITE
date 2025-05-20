import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose, { Schema } from 'mongoose';
import nodemailer from 'nodemailer';

// Interface para mensagem de contato
interface IMensagemContato extends mongoose.Document {
  nome: string;
  email: string;
  assunto?: string;
  mensagem: string;
  dataEnvio: Date;
  lida: boolean;
}

// Schema para mensagem de contato
const MensagemContatoSchema = new Schema<IMensagemContato>({
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
  assunto: {
    type: String,
    trim: true
  },
  mensagem: {
    type: String,
    required: [true, 'Mensagem é obrigatória'],
    trim: true
  },
  dataEnvio: {
    type: Date,
    default: Date.now
  },
  lida: {
    type: Boolean,
    default: false
  }
});

// Model para mensagem de contato (verificando se já existe para evitar redefinição)
const MensagemContatoModel = (mongoose.models.MensagemContato as mongoose.Model<IMensagemContato>) || 
  mongoose.model<IMensagemContato>('MensagemContato', MensagemContatoSchema);

// Email para receber as mensagens de contato
const EMAIL_DESTINO = process.env.EMAIL_CONTATO || 'johnsantosapzone@gmail.com';

// Função para enviar email
async function enviarEmail(mensagem: IMensagemContato) {
  try {
    // Em um ambiente real, você configuraria um serviço SMTP
    // Para desenvolvimento, estamos apenas logando a mensagem
    console.log(`[SIMULAÇÃO DE EMAIL] Nova mensagem de contato de ${mensagem.nome} (${mensagem.email})`);
    console.log(`Assunto: ${mensagem.assunto || 'Sem assunto'}`);
    console.log(`Mensagem: ${mensagem.mensagem}`);
    console.log(`Enviando para: ${EMAIL_DESTINO}`);
    
    // Exemplo de como seria a implementação com Nodemailer
    // Descomente e configure para usar em produção
    
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Ou outro serviço
      auth: {
        user: 'seu-email@gmail.com',
        pass: 'sua-senha-ou-app-password'
      }
    });

    const info = await transporter.sendMail({
      from: `"Centro de Artesanato" <seu-email@gmail.com>`,
      to: EMAIL_DESTINO,
      subject: `Nova mensagem de contato: ${mensagem.assunto || 'Sem assunto'}`,
      text: `Nome: ${mensagem.nome}\nEmail: ${mensagem.email}\nMensagem: ${mensagem.mensagem}`,
      html: `
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${mensagem.nome}</p>
        <p><strong>Email:</strong> ${mensagem.email}</p>
        <p><strong>Assunto:</strong> ${mensagem.assunto || 'Sem assunto'}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem.mensagem}</p>
      `
    });

    console.log('Email enviado:', info.messageId);
    */
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

// Rota para enviar mensagem de contato
export async function POST(req: NextRequest) {
  try {
    // Conectar ao banco de dados
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ao banco de dados' 
      }, { status: 500 });
    }

    // Obter dados do corpo da requisição
    const data = await req.json();

    // Validar dados necessários
    if (!data.nome || !data.email || !data.mensagem) {
      return NextResponse.json({ 
        success: false, 
        message: 'Nome, email e mensagem são obrigatórios' 
      }, { status: 400 });
    }

    // Criar nova mensagem
    const mensagem = await MensagemContatoModel.create({
      nome: data.nome,
      email: data.email,
      assunto: data.assunto || 'Mensagem do site',
      mensagem: data.mensagem,
      dataEnvio: new Date(),
      lida: false
    });

    // Enviar email de notificação
    await enviarEmail(mensagem);

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      id: mensagem._id
    });
  } catch (error: any) {
    console.error('Erro ao processar mensagem de contato:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao processar sua mensagem. Tente novamente mais tarde.',
      error: error.message
    }, { status: 500 });
  }
} 