# Implementações no Centro de Artesanato

## Novas Funcionalidades

### 1. Gerenciamento de Clientes

Foi implementado um sistema completo de gerenciamento de clientes com as seguintes funcionalidades:

- **Listagem de clientes**: Visualização de todos os clientes cadastrados com paginação
- **Filtros de busca**: Pesquisa de clientes por nome e email
- **Adição de clientes**: Formulário para adicionar novos clientes
- **Visualização detalhada**: Página com informações completas de cada cliente
- **Edição de dados**: Possibilidade de alterar informações como nome, email, telefone e status
- **Desativação de clientes**: Opção para desativar clientes em vez de excluí-los permanentemente

### 2. Autenticação Social

Foi implementada a autenticação social com Google e Facebook, permitindo que os usuários se conectem usando suas contas existentes.

## Configuração da Autenticação Social

### Pré-requisitos

Para usar a autenticação social, você precisa:

1. Criar projetos nos portais de desenvolvedores do Google e Facebook
2. Configurar as variáveis de ambiente em um arquivo `.env.local`

### Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou use um existente
3. Vá para "APIs e Serviços" > "Credenciais"
4. Clique em "Criar Credenciais" > "ID do cliente OAuth"
5. Configure o tipo como "Aplicativo da Web"
6. Adicione os URIs de redirecionamento:
   - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
   - `https://seu-dominio.com/api/auth/callback/google` (produção)
7. Copie o "ID do cliente" e "Segredo do cliente"

### Facebook OAuth

1. Acesse o [Facebook Developers](https://developers.facebook.com/)
2. Crie um novo aplicativo ou use um existente
3. Vá para "Configurações" > "Básico"
4. Encontre o "ID do aplicativo" e "Chave secreta do aplicativo"
5. Vá para "Produtos" > "Login do Facebook" > "Configurações"
6. Adicione os URIs de redirecionamento:
   - `http://localhost:3000/api/auth/callback/facebook` (desenvolvimento)
   - `https://seu-dominio.com/api/auth/callback/facebook` (produção)

### Configuração do .env.local

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
# MongoDB (URL de conexão)
MONGODB_URI=mongodb://localhost:27017/centro-artesanato

# JWT
JWT_SECRET=seu_secret_super_secreto_aqui
JWT_EXPIRATION=30d

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu_secret_super_secreto_aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu_cliente_id_do_google
GOOGLE_CLIENT_SECRET=seu_cliente_secret_do_google

# Facebook OAuth
FACEBOOK_CLIENT_ID=seu_cliente_id_do_facebook
FACEBOOK_CLIENT_SECRET=seu_cliente_secret_do_facebook
```

## Como Usar

### Autenticação Social

1. Acesse a página de login `/conta/login`
2. Você verá opções para entrar com Google ou Facebook
3. Clique em uma das opções e faça login com sua conta
4. O sistema verificará se o email já está cadastrado:
   - Se estiver, vinculará a conta social ao usuário existente
   - Se não estiver, criará um novo usuário no sistema

### Gerenciamento de Clientes

1. Faça login como administrador
2. Acesse o menu "Clientes" no painel administrativo
3. Você pode:
   - Ver a lista de todos os clientes
   - Pesquisar por nome ou email
   - Adicionar um novo cliente
   - Ver detalhes de um cliente específico
   - Editar informações de um cliente
   - Desativar um cliente

## Dicas e Solução de Problemas

- **Erro de conexão com MongoDB**: Verifique se o MongoDB está rodando e acessível
- **Erro de autenticação social**: Verifique se as credenciais estão corretas e se os URIs de redirecionamento estão configurados corretamente
- **Imagens não carregando**: Se estiver enfrentando problemas com imagens do Unsplash, pode ser por restrições de rede ou firewall
- **Modo de desenvolvimento**: Para testes, você pode acessar o sistema com 

## Próximas Etapas

Algumas funcionalidades que podem ser implementadas no futuro:

1. Adição de mais provedores de autenticação social (Apple, Twitter, etc.)
2. Relatórios de clientes com dados estatísticos
3. Importação/exportação de dados de clientes em formato CSV
4. Segmentação de clientes por grupos ou tags
5. Sistema de pontos de fidelidade para clientes 