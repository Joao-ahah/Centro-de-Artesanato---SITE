import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import { client } from '@/lib/mercadopago';

// URLs de retorno - usar porta 3000
const BASE_URL = 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 API Pagamento: Iniciando criação de preferência');
    
    const body = await req.json();
    console.log('📦 Body recebido:', JSON.stringify(body, null, 2));
    
    const { items, payer, external_reference } = body;
    
    // Validar dados obrigatórios
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ Erro: Itens inválidos');
      return NextResponse.json({
        success: false,
        message: 'Itens do pagamento são obrigatórios'
      }, { status: 400 });
    }
    
    // Validar cada item
    for (const item of items) {
      if (!item.title || !item.unit_price || !item.quantity) {
        console.error('❌ Erro: Item inválido:', item);
        return NextResponse.json({
          success: false,
          message: 'Cada item deve ter título, preço unitário e quantidade'
        }, { status: 400 });
      }
    }
    
    console.log('✅ Validações passaram, criando instância da API');
    
    // Criar instância da API de preferências
    const preference = new Preference(client);
    
    // Configurar a preferência com PIX habilitado
    const preferenceData = {
      items: items.map((item: any, index: number) => ({
        id: item.id || `item_${index}`,
        title: item.title,
        description: item.description || '',
        unit_price: parseFloat(item.unit_price),
        quantity: parseInt(item.quantity),
        currency_id: 'BRL'
      })),
      
      payer: payer ? {
        name: payer.name,
        surname: payer.surname,
        email: payer.email,
        phone: payer.phone ? {
          area_code: payer.phone.area_code,
          number: payer.phone.number
        } : undefined,
        identification: payer.identification ? {
          type: payer.identification.type,
          number: payer.identification.number
        } : undefined,
        address: payer.address ? {
          street_name: payer.address.street_name,
          street_number: payer.address.street_number,
          zip_code: payer.address.zip_code
        } : undefined
      } : undefined,
      
      back_urls: {
        success: `${BASE_URL}/pagamento/sucesso`,
        failure: `${BASE_URL}/pagamento/falha`,
        pending: `${BASE_URL}/pagamento/pendente`
      },
      
      notification_url: `${BASE_URL}/api/webhooks/mercadopago`,
      external_reference: external_reference || `ref_${Date.now()}`,
      
      // Configurações de métodos de pagamento - HABILITANDO PIX
      payment_methods: {
        // Não excluir nenhum método - para garantir que PIX apareça
        excluded_payment_methods: [],
        excluded_payment_types: [],
        // Permitir parcelamento
        installments: 12,
        // Configuração específica para PIX
        default_payment_method_id: null,
        default_installments: null
      },
      
      // Configuração adicional para PIX
      purpose: 'wallet_purchase',
      
      // Configurações adicionais
      expires: false,
      
      // Configuração de moeda
      currency_id: 'BRL',
      
      // Permitir pagamentos offline (PIX, boleto)
      binary_mode: false,
      
      // Metadados
      metadata: {
        created_at: new Date().toISOString(),
        source: 'centro-artesanato',
        pix_enabled: true
      }
    };
    
    console.log('📝 Dados da preferência preparados:');
    console.log('🔗 URLs configuradas:', {
      success: `${BASE_URL}/pagamento/sucesso`,
      failure: `${BASE_URL}/pagamento/falha`,
      pending: `${BASE_URL}/pagamento/pendente`,
      notification: `${BASE_URL}/api/webhooks/mercadopago`
    });
    console.log('💳 Métodos de pagamento:', preferenceData.payment_methods);
    
    // Criar a preferência no Mercado Pago
    console.log('⚡ Enviando para Mercado Pago...');
    const result = await preference.create({ body: preferenceData });
    
    console.log('🎉 Preferência criada com sucesso!');
    console.log('🆔 ID:', result.id);
    console.log('🔗 Init Point:', result.init_point);
    console.log('🧪 Sandbox Init Point:', result.sandbox_init_point);
    
    return NextResponse.json({
      success: true,
      message: 'Preferência de pagamento criada com sucesso',
      data: {
        id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
        external_reference: result.external_reference,
        collector_id: result.collector_id
      }
    });
    
  } catch (error: any) {
    console.error('💥 API Pagamento: Erro completo:', error);
    console.error('📋 Stack trace:', error.stack);
    console.error('🔍 Erro detalhado:', {
      name: error.name,
      message: error.message,
      cause: error.cause,
      status: error.status,
      statusCode: error.statusCode
    });
    
    // Tentar extrair mais informações do erro do Mercado Pago
    if (error.response) {
      console.error('🌐 Resposta HTTP:', error.response.status);
      console.error('📄 Body da resposta:', error.response.data);
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar preferência de pagamento',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : 'Erro interno do servidor'
    }, { status: 500 });
  }
} 