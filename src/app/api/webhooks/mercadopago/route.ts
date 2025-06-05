import { NextRequest, NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import { client, validateWebhookSignature } from '@/lib/mercadopago';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

// Interface para o log de webhook
interface IWebhookLog extends mongoose.Document {
  event_type: string;
  resource_id: string;
  topic: string;
  received_at: Date;
  processed: boolean;
  payment_data?: any;
  error?: string;
}

// Schema para log de webhooks
const WebhookLogSchema = new mongoose.Schema<IWebhookLog>({
  event_type: String,
  resource_id: String,
  topic: String,
  received_at: { type: Date, default: Date.now },
  processed: { type: Boolean, default: false },
  payment_data: mongoose.Schema.Types.Mixed,
  error: String
});

// Model para log de webhooks
const WebhookLogModel = (mongoose.models.WebhookLog as mongoose.Model<IWebhookLog>) || 
  mongoose.model<IWebhookLog>('WebhookLog', WebhookLogSchema);

// Interface para pagamento processado
interface IPagamento extends mongoose.Document {
  payment_id: string;
  external_reference: string;
  status: string;
  status_detail: string;
  payment_type: string;
  payment_method_id: string;
  transaction_amount: number;
  currency_id: string;
  payer_email: string;
  payer_name?: string;
  date_created: Date;
  date_approved?: Date;
  merchant_order_id?: string;
  processed_at: Date;
  webhook_data: any;
}

// Schema para pagamentos
const PagamentoSchema = new mongoose.Schema<IPagamento>({
  payment_id: { type: String, required: true, unique: true },
  external_reference: String,
  status: String,
  status_detail: String,
  payment_type: String,
  payment_method_id: String,
  transaction_amount: Number,
  currency_id: String,
  payer_email: String,
  payer_name: String,
  date_created: Date,
  date_approved: Date,
  merchant_order_id: String,
  processed_at: { type: Date, default: Date.now },
  webhook_data: mongoose.Schema.Types.Mixed
});

// Model para pagamentos
const PagamentoModel = (mongoose.models.Pagamento as mongoose.Model<IPagamento>) || 
  mongoose.model<IPagamento>('Pagamento', PagamentoSchema);

export async function POST(req: NextRequest) {
  try {
    console.log('Webhook MP: Notificação recebida');
    
    // Conectar ao banco de dados
    await dbConnect();
    
    // Obter headers para validação
    const signature = req.headers.get('x-signature');
    const requestId = req.headers.get('x-request-id');
    
    console.log('Webhook MP: Headers:', { signature, requestId });
    
    // Obter dados da notificação
    const body = await req.json();
    console.log('Webhook MP: Dados recebidos:', JSON.stringify(body, null, 2));
    
    const { type, data } = body;
    
    if (!type || !data || !data.id) {
      console.log('Webhook MP: Dados inválidos');
      return NextResponse.json({ success: false, message: 'Dados inválidos' }, { status: 400 });
    }
    
    // Validar assinatura se fornecida
    if (signature && requestId) {
      console.log('Webhook MP: Validando assinatura...');
      
      const isValidSignature = await validateWebhookSignature(
        data.id,
        signature,
        requestId
      );
      
      if (!isValidSignature) {
        console.error('Webhook MP: Assinatura inválida');
        return NextResponse.json({ 
          success: false, 
          message: 'Assinatura inválida' 
        }, { status: 401 });
      }
      
      console.log('Webhook MP: Assinatura validada com sucesso');
    } else {
      console.warn('Webhook MP: Headers de assinatura não encontrados - continuando sem validação');
    }
    
    // Registrar a notificação
    const webhookLog = await WebhookLogModel.create({
      event_type: type,
      resource_id: data.id,
      topic: type,
      received_at: new Date(),
      processed: false
    });
    
    console.log('Webhook MP: Log criado:', webhookLog._id);
    
    // Processar apenas notificações de pagamento
    if (type === 'payment') {
      try {
        console.log('Webhook MP: Processando pagamento:', data.id);
        
        // Obter dados do pagamento do Mercado Pago
        const payment = new Payment(client);
        const paymentData = await payment.get({ id: data.id });
        
        console.log('Webhook MP: Dados do pagamento:', JSON.stringify(paymentData, null, 2));
        
        // Verificar se o pagamento já foi processado
        const existingPayment = await PagamentoModel.findOne({ payment_id: data.id });
        
        if (existingPayment) {
          console.log('Webhook MP: Pagamento já processado');
          
          // Atualizar dados se necessário
          existingPayment.status = paymentData.status || '';
          existingPayment.status_detail = paymentData.status_detail || '';
          existingPayment.date_approved = paymentData.date_approved ? new Date(paymentData.date_approved) : undefined;
          existingPayment.webhook_data = paymentData;
          
          await existingPayment.save();
        } else {
          // Criar novo registro de pagamento
          const novoPagamento = await PagamentoModel.create({
            payment_id: data.id,
            external_reference: paymentData.external_reference || '',
            status: paymentData.status || '',
            status_detail: paymentData.status_detail || '',
            payment_type: paymentData.payment_type_id || '',
            payment_method_id: paymentData.payment_method_id || '',
            transaction_amount: paymentData.transaction_amount || 0,
            currency_id: paymentData.currency_id || 'BRL',
            payer_email: paymentData.payer?.email || '',
            payer_name: paymentData.payer?.first_name && paymentData.payer?.last_name 
              ? `${paymentData.payer.first_name} ${paymentData.payer.last_name}` 
              : paymentData.payer?.first_name || '',
            date_created: paymentData.date_created ? new Date(paymentData.date_created) : new Date(),
            date_approved: paymentData.date_approved ? new Date(paymentData.date_approved) : undefined,
            merchant_order_id: paymentData.order?.id?.toString() || '',
            webhook_data: paymentData
          });
          
          console.log('Webhook MP: Novo pagamento registrado:', novoPagamento._id);
        }
        
        // Marcar webhook como processado
        webhookLog.processed = true;
        webhookLog.payment_data = paymentData;
        await webhookLog.save();
        
        // Aqui você pode adicionar lógica adicional para:
        // - Atualizar status de pedidos
        // - Enviar emails de confirmação
        // - Liberar produtos/serviços
        // - etc.
        
        console.log('Webhook MP: Pagamento processado com sucesso');
        
      } catch (error: any) {
        console.error('Webhook MP: Erro ao processar pagamento:', error);
        
        // Registrar erro no log
        webhookLog.error = error.message;
        await webhookLog.save();
        
        return NextResponse.json({ 
          success: false, 
          message: 'Erro ao processar pagamento' 
        }, { status: 500 });
      }
    } else {
      console.log('Webhook MP: Tipo de notificação não suportado:', type);
      
      // Marcar como processado mesmo sem ação
      webhookLog.processed = true;
      await webhookLog.save();
    }
    
    return NextResponse.json({ success: true, message: 'Notificação processada' });
    
  } catch (error: any) {
    console.error('Webhook MP: Erro geral:', error);
    
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao processar webhook',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Método GET para verificar se o webhook está funcionando
export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'Webhook do Mercado Pago está funcionando',
    timestamp: new Date().toISOString()
  });
} 