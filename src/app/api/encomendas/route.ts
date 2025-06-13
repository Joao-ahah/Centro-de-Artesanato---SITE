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

// Interface para dados de encomenda
interface DadosEncomenda {
  produtoId: string;
  produtoNome: string;
  nome: string;
  email: string;
  telefone?: string;
  quantidade: string;
  observacoes?: string;
  prazoDesejado?: string;
}

// Configurar transporter de email
const criarTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// POST /api/encomendas - Criar nova solicitação de encomenda
export async function POST(req: NextRequest) {
  try {
    const dados: DadosEncomenda = await req.json();

    // Validações básicas
    if (!dados.nome || !dados.email || !dados.quantidade || !dados.produtoNome) {
      return NextResponse.json(
        { success: false, message: 'Nome, email, quantidade e produto são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dados.email)) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      );
    }

    // Tentar enviar email de notificação
    try {
      const transporter = criarTransporter();

      // Email para o cliente (confirmação)
      const emailCliente = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: dados.email,
        subject: 'Solicitação de Encomenda Recebida - Centro de Artesanato',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d97706; text-align: center;">Solicitação de Encomenda Recebida</h2>
            
            <p>Olá <strong>${dados.nome}</strong>,</p>
            
            <p>Recebemos sua solicitação de encomenda e entraremos em contato em breve para discutir os detalhes.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Detalhes da Solicitação:</h3>
              <p><strong>Produto:</strong> ${dados.produtoNome}</p>
              <p><strong>Quantidade:</strong> ${dados.quantidade}</p>
              ${dados.telefone ? `<p><strong>Telefone:</strong> ${dados.telefone}</p>` : ''}
              ${dados.prazoDesejado ? `<p><strong>Prazo Desejado:</strong> ${dados.prazoDesejado}</p>` : ''}
              ${dados.observacoes ? `<p><strong>Observações:</strong> ${dados.observacoes}</p>` : ''}
            </div>
            
            <p>Nossa equipe analisará sua solicitação e enviará um orçamento personalizado em até 24 horas.</p>
            
            <p>Agradecemos sua confiança!</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="text-align: center; color: #6b7280; font-size: 14px;">
              Centro de Artesanato<br>
              Email: ${process.env.SMTP_FROM || process.env.SMTP_USER}<br>
              <em>Preservando tradições, criando futuros</em>
            </p>
          </div>
        `
      };

      // Email para o administrador (notificação)
      const emailAdmin = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.SMTP_FROM || process.env.SMTP_USER,
        subject: `Nova Encomenda: ${dados.produtoNome}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626; text-align: center;">Nova Solicitação de Encomenda</h2>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
              <h3 style="color: #374151; margin-top: 0;">Dados do Cliente:</h3>
              <p><strong>Nome:</strong> ${dados.nome}</p>
              <p><strong>Email:</strong> ${dados.email}</p>
              ${dados.telefone ? `<p><strong>Telefone:</strong> ${dados.telefone}</p>` : ''}
            </div>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h3 style="color: #374151; margin-top: 0;">Detalhes da Encomenda:</h3>
              <p><strong>Produto:</strong> ${dados.produtoNome}</p>
              <p><strong>ID do Produto:</strong> ${dados.produtoId}</p>
              <p><strong>Quantidade:</strong> ${dados.quantidade}</p>
              ${dados.prazoDesejado ? `<p><strong>Prazo Desejado:</strong> ${dados.prazoDesejado}</p>` : ''}
              ${dados.observacoes ? `
                <p><strong>Observações:</strong></p>
                <div style="background-color: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${dados.observacoes}</div>
              ` : ''}
            </div>
            
            <p style="color: #6b7280;">
              <strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #dc2626; font-weight: bold;">⚠️ Lembre-se de responder ao cliente em até 24 horas!</p>
            </div>
          </div>
        `
      };

      // Enviar emails
      await Promise.all([
        transporter.sendMail(emailCliente),
        transporter.sendMail(emailAdmin)
      ]);

      console.log('Emails de encomenda enviados com sucesso');

    } catch (emailError) {
      console.error('Erro ao enviar emails de encomenda:', emailError);
      // Não falhar a requisição se o email não puder ser enviado
    }

    // Aqui você poderia salvar a encomenda no banco de dados
    // Por enquanto, apenas retornamos sucesso
    
    return NextResponse.json({
      success: true,
      message: 'Solicitação de encomenda enviada com sucesso',
      dados: {
        id: Date.now().toString(), // ID temporário
        status: 'pendente',
        dataEnvio: new Date().toISOString(),
        produto: dados.produtoNome,
        quantidade: dados.quantidade,
        cliente: dados.nome
      }
    });

  } catch (error: any) {
    console.error('Erro ao processar encomenda:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao processar solicitação de encomenda', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/encomendas - Listar encomendas (para admin)
export async function GET(req: NextRequest) {
  try {
    // TODO: Implementar autenticação de admin
    // TODO: Buscar encomendas do banco de dados
    
    // Por enquanto, retorna exemplo
    const encomendasExemplo = [
      {
        id: '1',
        produtoNome: 'Vaso de Cerâmica Artesanal',
        produtoId: '1',
        cliente: 'João Silva',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999',
        quantidade: '5',
        status: 'pendente',
        dataEnvio: new Date().toISOString(),
        observacoes: 'Gostaria de personalizar as cores'
      }
    ];

    return NextResponse.json({
      success: true,
      encomendas: encomendasExemplo
    });

  } catch (error: any) {
    console.error('Erro ao buscar encomendas:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar encomendas', error: error.message },
      { status: 500 }
    );
  }
} 