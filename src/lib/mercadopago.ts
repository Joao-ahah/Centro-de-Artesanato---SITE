// Configuração do Mercado Pago
import { MercadoPagoConfig } from 'mercadopago';

// Credenciais do Mercado Pago (usar variáveis de ambiente em produção)
export const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-d63d2f17-18da-4e3b-85c6-55392d893451';
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-2606550240254853-060515-77fe5d77cd094c93bea8420a95bc89bb-2477836761';
export const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET || '82a53c052b6098f14a192d19a030b672dc4617ac152156b57b3e6b14fecec6bc';

// URL base para callbacks
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Cliente do Mercado Pago
export const client = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
});

// Configurações de pagamento
export const PAYMENT_CONFIG = {
  // URLs de retorno
  success_url: `${BASE_URL}/pagamento/sucesso`,
  failure_url: `${BASE_URL}/pagamento/falha`,
  pending_url: `${BASE_URL}/pagamento/pendente`,
  
  // URL do webhook para notificações
  notification_url: `${BASE_URL}/api/webhooks/mercadopago`,
  
  // Configurações padrão
  currency_id: 'BRL',
  payment_methods: {
    excluded_payment_methods: [],
    excluded_payment_types: [],
    installments: 12
  }
};

// Tipos para pagamento
export interface PaymentData {
  title: string;
  description?: string;
  unit_price: number;
  quantity: number;
  currency_id?: string;
}

export interface PaymentPreference {
  items: PaymentData[];
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
      area_code?: string;
      number?: string;
    };
    identification?: {
      type?: string;
      number?: string;
    };
    address?: {
      street_name?: string;
      street_number?: number;
      zip_code?: string;
    };
  };
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  notification_url?: string;
  external_reference?: string;
  auto_return?: 'approved' | 'all';
}

// Função para validar assinatura do webhook
export const validateWebhookSignature = async (
  dataId: string,
  signature: string,
  timestamp: string
): Promise<boolean> => {
  try {
    const crypto = require('crypto');
    
    // Criar a string de verificação conforme especificação do Mercado Pago
    const dataToSign = `id:${dataId};request-id:${timestamp};`;
    
    // Gerar hash usando a chave secreta
    const expectedSignature = crypto
      .createHmac('sha256', MP_WEBHOOK_SECRET)
      .update(dataToSign)
      .digest('hex');
    
    console.log('Webhook Validation:', {
      dataToSign,
      receivedSignature: signature,
      expectedSignature,
      isValid: signature === expectedSignature
    });
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('Erro ao validar assinatura do webhook:', error);
    return false;
  }
}; 