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
const EMAIL_DESTINO = process.env.EMAIL_CONTATO || 'associcaoaapr@gmail.com';

// Função para enviar email
async function enviarEmail(mensagem: IMensagemContato) {
  try {
    console.log(`[ENVIANDO EMAIL] Nova mensagem de contato de ${mensagem.nome} (${mensagem.email})`);
    console.log(`Assunto: ${mensagem.assunto || 'Sem assunto'}`);
    console.log(`Enviando para: ${EMAIL_DESTINO}`);
    
    // Configurações do email
    const emailUser = process.env.EMAIL_USER || 'associcaoaapr@gmail.com';
    const emailPassword = process.env.EMAIL_PASSWORD || '*centroa25@';
    
    console.log(`Usando email: ${emailUser}`);
    
    // Implementação com Nodemailer para produção
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true para 465, false para outras portas
      auth: {
        user: emailUser,
        pass: emailPassword, // Use uma senha de app do Google para maior segurança
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verificar conexão
    await transporter.verify();
    console.log('Conexão com servidor de email verificada com sucesso');

    const mailOptions = {
      from: `"Centro de Artesanato - Contato" <${emailUser}>`,
      to: EMAIL_DESTINO,
      replyTo: mensagem.email, // Para responder diretamente ao cliente
      subject: `[CONTATO] ${mensagem.nome}: ${mensagem.assunto || 'Mensagem via site'}`,
      text: `
NOVA MENSAGEM DE CONTATO

Cliente: ${mensagem.nome}
Email: ${mensagem.email}
Assunto: ${mensagem.assunto || 'Sem assunto'}

Mensagem:
${mensagem.mensagem}

---
Para responder: Clique em "Responder" que sua resposta irá direto para ${mensagem.email}
Enviado em: ${new Date().toLocaleString('pt-BR')}
Sistema de Contato - Centro de Artesanato
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #92400e; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            📧 Nova mensagem de contato
          </h2>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0;">👤 Cliente: ${mensagem.nome}</h3>
            <p><strong>📧 Email:</strong> <a href="mailto:${mensagem.email}" style="color: #92400e;">${mensagem.email}</a></p>
            <p><strong>📋 Assunto:</strong> ${mensagem.assunto || 'Sem assunto'}</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #6b7280;">
            <h3 style="color: #374151; margin-top: 0;">💬 Mensagem:</h3>
            <p style="line-height: 1.6; color: #4b5563; font-size: 16px;">${mensagem.mensagem.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <p style="color: #1e40af; font-weight: bold; margin: 0;">
              💡 Para responder: Clique em "Responder" e sua mensagem irá direto para o cliente!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">
              Enviado em: ${new Date().toLocaleString('pt-BR')}<br>
              🏪 Centro de Artesanato - Sistema de Contato
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email enviado com sucesso:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error: any) {
    console.error('Erro detalhado ao enviar email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    // Log específico para problemas de autenticação
    if (error.code === 'EAUTH') {
      console.error('ERRO DE AUTENTICAÇÃO: Verifique se:');
      console.error('1. A verificação em duas etapas está ativada na conta Google');
      console.error('2. Uma senha de app foi gerada e está sendo usada');
      console.error('3. As credenciais estão corretas');
    }
    
    return false;
  }
}

// Rota para enviar mensagem de contato
export async function POST(req: NextRequest) {
  try {
    console.log('[CONTATO API] Recebendo nova mensagem de contato');
    
    // Conectar ao banco de dados
    const db = await dbConnect();
    if (!db) {
      console.error('[CONTATO API] Erro ao conectar ao banco de dados');
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ao banco de dados' 
      }, { status: 500 });
    }

    // Obter dados do corpo da requisição
    const data = await req.json();
    console.log('[CONTATO API] Dados recebidos:', { 
      nome: data.nome, 
      email: data.email, 
      assunto: data.assunto 
    });

    // Validar dados necessários
    if (!data.nome || !data.email || !data.mensagem) {
      console.error('[CONTATO API] Dados obrigatórios faltando');
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

    console.log('[CONTATO API] Mensagem salva no banco:', mensagem._id);

    // Enviar email de notificação
    const emailEnviado = await enviarEmail(mensagem);
    
    if (emailEnviado) {
      console.log('[CONTATO API] Email enviado com sucesso');
      return NextResponse.json({
        success: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        id: mensagem._id
      });
    } else {
      console.log('[CONTATO API] Falha no envio do email, mas mensagem foi salva');
      return NextResponse.json({
        success: true,
        message: 'Mensagem recebida com sucesso! Entraremos em contato em breve. (Email será enviado em breve)',
        id: mensagem._id,
        warning: 'Email não foi enviado imediatamente'
      });
    }
  } catch (error: any) {
    console.error('[CONTATO API] Erro ao processar mensagem de contato:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao processar sua mensagem. Tente novamente mais tarde.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 