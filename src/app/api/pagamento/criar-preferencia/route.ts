import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import { client, PAYMENT_CONFIG } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    console.log('API Pagamento: Criando preferência de pagamento');
    
    const body = await req.json();
    const { items, payer, external_reference } = body;
    
    // Validar dados obrigatórios
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Itens do pagamento são obrigatórios'
      }, { status: 400 });
    }
    
    // Validar cada item
    for (const item of items) {
      if (!item.title || !item.unit_price || !item.quantity) {
        return NextResponse.json({
          success: false,
          message: 'Cada item deve ter título, preço unitário e quantidade'
        }, { status: 400 });
      }
    }
    
    // Criar instância da API de preferências
    const preference = new Preference(client);
    
    // Configurar a preferência
    const preferenceData = {
      items: items.map((item: any) => ({
        title: item.title,
        description: item.description || '',
        unit_price: parseFloat(item.unit_price),
        quantity: parseInt(item.quantity),
        currency_id: item.currency_id || PAYMENT_CONFIG.currency_id
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
        success: PAYMENT_CONFIG.success_url,
        failure: PAYMENT_CONFIG.failure_url,
        pending: PAYMENT_CONFIG.pending_url
      },
      
      notification_url: PAYMENT_CONFIG.notification_url,
      external_reference: external_reference || `ref_${Date.now()}`,
      auto_return: 'approved' as const,
      
      payment_methods: PAYMENT_CONFIG.payment_methods,
      
      // Configurações adicionais
      expires: false,
      expiration_date_from: undefined,
      expiration_date_to: undefined,
      
      // Metadados
      metadata: {
        created_at: new Date().toISOString(),
        source: 'centro-artesanato'
      }
    };
    
    console.log('API Pagamento: Dados da preferência:', JSON.stringify(preferenceData, null, 2));
    
    // Criar a preferência no Mercado Pago
    const result = await preference.create({ body: preferenceData });
    
    console.log('API Pagamento: Preferência criada com sucesso:', result.id);
    
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
    console.error('API Pagamento: Erro ao criar preferência:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar preferência de pagamento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 