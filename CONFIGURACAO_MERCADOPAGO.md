# 💳 Configuração do Mercado Pago

## 📋 Índice
- [Credenciais](#credenciais)
- [Configuração de Webhooks](#configuração-de-webhooks)
- [URLs de Retorno](#urls-de-retorno)
- [Como Usar](#como-usar)
- [Teste em Ambiente de Desenvolvimento](#teste-em-ambiente-de-desenvolvimento)
- [Produção](#produção)

## 🔑 Credenciais

As credenciais do Mercado Pago já estão configuradas no arquivo `src/lib/mercadopago.ts`:

```typescript
// Credenciais de Produção
Public Key: APP_USR-d63d2f17-18da-4e3b-85c6-55392d893451
Access Token: APP_USR-2606550240254853-060515-77fe5d77cd094c93bea8420a95bc89bb-2477836761
Webhook Secret: 82a53c052b6098f14a192d19a030b672dc4617ac152156b57b3e6b14fecec6bc
```

⚠️ **IMPORTANTE:** Essas são credenciais de produção. Para testes, você deve usar credenciais de teste (sandbox).

## 🔔 Configuração de Webhooks

### 1. URL do Webhook
```
https://seudominio.com/api/webhooks/mercadopago
```

### 2. Como Configurar no Painel do Mercado Pago

1. Acesse o [painel do Mercado Pago](https://www.mercadopago.com.br/developers)
2. Vá em **"Suas Aplicações"**
3. Selecione sua aplicação
4. Na seção **"Webhooks"**, clique em **"Configurar notificações"**
5. Adicione a URL: `https://seudominio.com/api/webhooks/mercadopago`
6. Selecione os eventos:
   - ✅ **Pagamentos** (payments)
   - ✅ **Ordens de mercado** (merchant_orders) - opcional
   - ✅ **Cobranças** (invoices) - opcional

### 3. Eventos Suportados

O webhook está configurado para processar:
- ✅ `payment` - Notificações de pagamento
- ⚠️ Outros tipos são registrados mas não processados

### 4. Segurança do Webhook

O webhook está configurado com validação de assinatura para garantir que as notificações são realmente do Mercado Pago:

- **Assinatura Secreta:** `82a53c052b6098f14a192d19a030b672dc4617ac152156b57b3e6b14fecec6bc`
- **Validação:** O webhook verifica os headers `x-signature` e `x-request-id`
- **Algoritmo:** HMAC-SHA256

### 5. Teste do Webhook

Para testar se o webhook está funcionando:

```bash
# GET para verificar se está ativo
curl https://seudominio.com/api/webhooks/mercadopago

# Resposta esperada:
{
  "success": true,
  "message": "Webhook do Mercado Pago está funcionando",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔄 URLs de Retorno

As URLs de retorno estão configuradas em `src/lib/mercadopago.ts`:

```typescript
success_url: 'https://seudominio.com/pagamento/sucesso'
failure_url: 'https://seudominio.com/pagamento/falha'
pending_url: 'https://seudominio.com/pagamento/pendente'
```

### Parâmetros Retornados

#### Sucesso (`/pagamento/sucesso`)
- `collection_id` - ID da cobrança
- `collection_status` - Status da cobrança
- `payment_id` - ID do pagamento
- `status` - Status (approved, pending, etc.)
- `external_reference` - Referência externa
- `payment_type` - Tipo de pagamento
- `merchant_order_id` - ID da ordem
- `preference_id` - ID da preferência

#### Falha (`/pagamento/falha`)
- Mesmos parâmetros, mas com status de erro

#### Pendente (`/pagamento/pendente`)
- Mesmos parâmetros, mas com status pendente

## 🚀 Como Usar

### 1. Usando o Hook `useMercadoPago`

```typescript
import { useMercadoPago } from '@/hooks/useMercadoPago';

function MeuComponente() {
  const { criarPreferencia, loading, error } = useMercadoPago();

  const handlePagamento = async () => {
    try {
      const items = [
        {
          title: 'Produto Artesanal',
          description: 'Descrição do produto',
          unit_price: 50.00,
          quantity: 1
        }
      ];

      const payer = {
        name: 'João',
        surname: 'Silva',
        email: 'joao@email.com'
      };

      const preference = await criarPreferencia(items, payer, 'ref_123');
      
      // Redirecionar para checkout
      window.location.href = preference.init_point;
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    <button onClick={handlePagamento} disabled={loading}>
      {loading ? 'Processando...' : 'Pagar'}
    </button>
  );
}
```

### 2. Usando o Componente `BotaoPagamento`

```typescript
import BotaoPagamento from '@/components/BotaoPagamento';

function MeuComponente() {
  const items = [
    {
      title: 'Produto Artesanal',
      description: 'Descrição do produto',
      unit_price: 50.00,
      quantity: 1
    }
  ];

  const payer = {
    name: 'João',
    surname: 'Silva',
    email: 'joao@email.com'
  };

  return (
    <BotaoPagamento
      items={items}
      payer={payer}
      external_reference="pedido_123"
      onSuccess={(data) => console.log('Sucesso:', data)}
      onError={(error) => console.error('Erro:', error)}
    />
  );
}
```

## 🧪 Teste em Ambiente de Desenvolvimento

### 1. Credenciais de Teste

Para desenvolvimento, use credenciais de teste:

```typescript
// No arquivo .env.local
MP_PUBLIC_KEY_TEST=TEST-xxxxxxxx
MP_ACCESS_TOKEN_TEST=TEST-xxxxxxxx
```

### 2. Webhook Local (ngrok)

Para testar webhooks em desenvolvimento:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor aplicação local
ngrok http 3000

# Usar a URL gerada para configurar webhook
# Exemplo: https://abc123.ngrok.io/api/webhooks/mercadopago
```

### 3. Cartões de Teste

Use estes cartões para testar:

```
# Visa (Aprovado)
4509 9535 6623 3704
Código: 123
Vencimento: 11/25

# Mastercard (Recusado)
5031 7557 3453 0604
Código: 123
Vencimento: 11/25

# CPF para teste: 12345678909
```

## 🌐 Produção

### 1. Variáveis de Ambiente

Configure no seu arquivo `.env.production`:

```bash
# URLs base
NEXT_PUBLIC_BASE_URL=https://seudominio.com

# Mercado Pago
MP_PUBLIC_KEY=APP_USR-d63d2f17-18da-4e3b-85c6-55392d893451
MP_ACCESS_TOKEN=APP_USR-2606550240254853-060515-77fe5d77cd094c93bea8420a95bc89bb-2477836761
MP_WEBHOOK_SECRET=82a53c052b6098f14a192d19a030b672dc4617ac152156b57b3e6b14fecec6bc
```

### 2. Certificados SSL

Certifique-se de que seu domínio tem SSL válido, pois o Mercado Pago exige HTTPS para webhooks.

### 3. Logs de Produção

Os logs de webhook são salvos na collection `WebhookLog` no MongoDB:

```javascript
// Verificar logs via MongoDB
db.webhooklogs.find().sort({ received_at: -1 }).limit(10)

// Verificar pagamentos processados
db.pagamentos.find().sort({ processed_at: -1 }).limit(10)
```

## 🔒 Validação de Assinatura do Webhook

### Como Funciona
O Mercado Pago envia notificações com headers de segurança:

```http
POST /api/webhooks/mercadopago
x-signature: [hash_da_assinatura]
x-request-id: [timestamp_da_requisição]
Content-Type: application/json

{
  "type": "payment",
  "data": {
    "id": "12345"
  }
}
```

### Processo de Validação
1. **Receber Headers:** `x-signature` e `x-request-id`
2. **Construir String:** `id:{data.id};request-id:{x-request-id};`
3. **Gerar Hash:** HMAC-SHA256 da string usando a chave secreta
4. **Comparar:** Hash gerado com o recebido em `x-signature`

### Exemplo de Validação Manual
```bash
# String para assinar
data_to_sign="id:12345;request-id:abc123;"

# Gerar assinatura
echo -n "$data_to_sign" | openssl dgst -sha256 -hmac "82a53c052b6098f14a192d19a030b672dc4617ac152156b57b3e6b14fecec6bc"
```

## 🔍 Troubleshooting

### Webhook não está sendo chamado
1. Verifique se a URL está acessível publicamente
2. Confirme que retorna status 200
3. Verifique se o SSL está válido
4. Confirme configuração no painel do MP

### Assinatura inválida (erro 401)
1. Verifique se a chave secreta está correta
2. Confirme que os headers `x-signature` e `x-request-id` estão sendo enviados
3. Verifique logs do webhook para ver detalhes da validação

### Pagamentos não aparecem no banco
1. Verifique logs do webhook
2. Confirme conexão com MongoDB
3. Verifique se as credenciais estão corretas

### Erro de credenciais
1. Confirme se está usando credenciais corretas (produção/teste)
2. Verifique se as credenciais não expiraram
3. Confirme permissões da aplicação no painel MP

## 📞 Suporte

Para problemas específicos do Mercado Pago:
- [Documentação Oficial](https://www.mercadopago.com.br/developers)
- [Centro de Ajuda](https://www.mercadopago.com.br/ajuda)
- [Suporte Técnico](https://www.mercadopago.com.br/developers/support) 