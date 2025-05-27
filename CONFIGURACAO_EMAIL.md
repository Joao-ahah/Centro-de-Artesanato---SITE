# Configuração de Email - Centro de Artesanato

## Configurar Senha de App do Google

### Passo 1: Ativar Verificação em Duas Etapas
1. Acesse [myaccount.google.com](https://myaccount.google.com)
2. Vá em "Segurança"
3. Ative a "Verificação em duas etapas" se ainda não estiver ativada

### Passo 2: Gerar Senha de App
1. Na mesma página de Segurança, procure por "Senhas de app"
2. Clique em "Senhas de app"
3. Selecione "Aplicativo" → "Outro (nome personalizado)"
4. Digite "Centro de Artesanato" como nome
5. Clique em "Gerar"
6. **Copie a senha gerada (16 caracteres)**

### Passo 3: Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Configurações de Email
EMAIL_USER=associcaoaapr@gmail.com
EMAIL_PASSWORD=sua_senha_de_app_aqui
EMAIL_CONTATO=associcaoaapr@gmail.com

**Importante:** Substitua `sua_senha_de_app_aqui` pela senha de 16 caracteres gerada no Passo 2.

### Passo 4: Reiniciar o Servidor
```bash
npm run dev
```

## Testando o Sistema

### 1. Teste de Contato
1. Acesse `/contato`
2. Preencha o formulário
3. Envie a mensagem
4. Verifique o console do servidor para logs
5. Verifique sua caixa de entrada

### 2. Teste de Encomenda
1. Acesse qualquer produto em `/produtos/[id]`
2. Clique em "Solicitar Encomenda (Grandes Quantidades)"
3. Preencha o formulário
4. Envie a solicitação
5. Verifique sua caixa de entrada

## Logs para Debug
O sistema agora inclui logs detalhados. Verifique o console do servidor para:
- `[CONTATO API]` - Logs do sistema de contato
- `[ENCOMENDA API]` - Logs do sistema de encomendas
- `[ENVIANDO EMAIL]` - Logs de envio de email

## Problemas Comuns

### Erro EAUTH
Se aparecer erro de autenticação:
1. Verifique se a verificação em duas etapas está ativada
2. Confirme se está usando a senha de app (não a senha normal)
3. Verifique se o email está correto

### Email não chega
1. Verifique a pasta de spam
2. Confirme se o EMAIL_CONTATO está correto
3. Teste com outro email de destino

### Erro de conexão
1. Verifique sua conexão com a internet
2. Confirme se o Gmail não está bloqueando a aplicação
3. Tente usar porta 465 com secure: true

## Próximos Passos

1. **Configure o email** seguindo os passos acima
2. **Teste o sistema** de contato e encomendas
3. **Crie uma conta de cliente** para testar o login
4. **Verifique os logs** no console para debug

## Suporte
Se ainda tiver problemas:
1. Verifique os logs no console do servidor
2. Confirme se todas as variáveis de ambiente estão configuradas
3. Teste com um email diferente como destinatário 