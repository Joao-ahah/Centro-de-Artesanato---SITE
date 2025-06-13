# 💰 Configuração PIX - Mercado Pago

## 🎯 Objetivo
Garantir que o **PIX** apareça como opção de pagamento no checkout do Mercado Pago.

## ✅ Configurações Aplicadas

### 1. **Métodos de Pagamento Liberados**
```javascript
payment_methods: {
  // Não excluir nenhum método - PIX incluído
  excluded_payment_methods: [],
  excluded_payment_types: [],
  // Permitir parcelamento
  installments: 12,
  // Configuração específica para PIX
  default_payment_method_id: null,
  default_installments: null
}
```

### 2. **Configurações Específicas para PIX**
```javascript
// Configuração adicional para PIX
purpose: 'wallet_purchase',

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
```

## 🔍 Possíveis Motivos do PIX Não Aparecer

### 1. **Conta do Mercado Pago**
- ✅ **Verifique se sua conta tem PIX habilitado**
- ✅ **Confirme se você é pessoa física ou jurídica verificada**
- ✅ **Certifique-se de que sua conta está ativa para receber PIX**

### 2. **Configurações da Preferência**
- ✅ **`excluded_payment_types` não deve incluir `bank_transfer`**
- ✅ **`binary_mode` deve ser `false` para permitir PIX**
- ✅ **`currency_id` deve ser `BRL`**

### 3. **Ambiente de Teste vs Produção**
- 🧪 **Sandbox**: PIX pode ter limitações no ambiente de testes
- 🌐 **Produção**: PIX funciona normalmente com conta verificada

## 🧪 Como Testar PIX

### 1. **No Ambiente Sandbox (Testes)**
```javascript
// Use a URL de sandbox
sandbox_init_point: "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
```

### 2. **No Ambiente de Produção**
```javascript
// Use a URL de produção
init_point: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
```

## 🔧 Verificação de Configuração

### API Teste:
```bash
curl -X POST http://localhost:3001/api/pagamento/criar-preferencia \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "Teste PIX",
        "unit_price": 10.00,
        "quantity": 1
      }
    ]
  }'
```

### Resposta Esperada:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
    "sandbox_init_point": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
  }
}
```

## 🏦 Configuração da Conta Mercado Pago

### Para PIX Funcionar, sua conta deve ter:

1. **✅ Verificação Completa**
   - CPF ou CNPJ verificado
   - Dados bancários confirmados
   - Email e telefone verificados

2. **✅ PIX Habilitado**
   - Chave PIX cadastrada
   - Conta bancária vinculada
   - Limites de recebimento configurados

3. **✅ Credenciais Corretas**
   - Access Token de produção ativo
   - Public Key correspondente
   - Webhook configurado (opcional)

## 🎛️ Configurações Avançadas para PIX

### 1. **Forçar Apenas PIX** (Opcional)
```javascript
payment_methods: {
  excluded_payment_methods: [],
  excluded_payment_types: [
    'credit_card',
    'debit_card', 
    'ticket'
  ], // Exclui tudo exceto PIX
  installments: 1
}
```

### 2. **PIX + Cartão + Boleto** (Recomendado)
```javascript
payment_methods: {
  excluded_payment_methods: [],
  excluded_payment_types: [], // Permite todos os métodos
  installments: 12
}
```

## 🐛 Troubleshooting PIX

### ❌ **"PIX não aparece no checkout"**

**Soluções:**
1. ✅ Verifique se `excluded_payment_types` não inclui `bank_transfer`
2. ✅ Confirme `binary_mode: false`
3. ✅ Use `currency_id: 'BRL'`
4. ✅ Teste com conta verificada
5. ✅ Verifique se PIX está habilitado na sua conta MP

### ❌ **"Erro ao processar PIX"**

**Soluções:**
1. ✅ Confirme chave PIX cadastrada
2. ✅ Verifique limites de recebimento
3. ✅ Teste com valores menores
4. ✅ Use ambiente de produção

### ❌ **"PIX fica pendente"**

**Explicação:**
- PIX normalmente é **instantâneo**
- Status "pendente" pode indicar problema na conta
- Verifique notificações do Mercado Pago

## 📱 Como o Cliente Vê o PIX

### No Checkout:
1. **Seleciona PIX** como método de pagamento
2. **Gera QR Code** ou código PIX
3. **Abre app do banco** ou internet banking
4. **Escaneia QR Code** ou cola código
5. **Confirma pagamento** no banco
6. **Recebe confirmação** instantânea

### URLs de Retorno PIX:
- ✅ **Sucesso**: `/pagamento/sucesso` - Pagamento aprovado
- ⏳ **Pendente**: `/pagamento/pendente` - Aguardando confirmação
- ❌ **Falha**: `/pagamento/falha` - Erro no pagamento

## 🎯 Status Final

### ✅ **Configurações Aplicadas:**
- Métodos de pagamento liberados (incluindo PIX)
- `binary_mode: false` para permitir PIX
- `currency_id: 'BRL'` configurado
- URLs de retorno corretas (porta 3001)
- Metadados com `pix_enabled: true`

### 🚀 **Como Testar:**
1. Vá para `http://localhost:3001`
2. Adicione produto ao carrinho
3. Finalize compra
4. Na página do Mercado Pago, o PIX deve aparecer como opção

---

**⚠️ Importante**: O PIX só aparecerá se sua conta do Mercado Pago estiver **verificada e com PIX habilitado**. Em ambiente de sandbox, o PIX pode ter limitações. 