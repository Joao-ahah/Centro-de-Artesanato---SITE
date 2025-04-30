# Configuração do MongoDB para o Centro de Artesanato

Este guia explica como configurar o MongoDB Atlas para o projeto Centro de Artesanato.

## 1. Criar uma conta no MongoDB Atlas

1. Acesse [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Registre-se com seu e-mail ou use opções de login com Google, GitHub, etc.
3. Preencha as informações necessárias para criar sua conta

## 2. Criar um novo projeto e cluster

1. Após o login, clique em "New Project"
2. Dê um nome ao projeto (ex: "CentroArtesanato") e clique em "Next"
3. Opcional: adicione membros ao projeto se necessário
4. Clique em "Create Project"
5. Na tela de criação de cluster, escolha a opção gratuita "Shared" (M0)
6. Escolha um provedor de nuvem (AWS, Google Cloud, Azure) e uma região próxima ao Brasil
7. Defina um nome para o cluster ou use o nome padrão
8. Clique em "Create Cluster"

## 3. Configurar acesso ao banco de dados

1. Enquanto o cluster está sendo criado, você será redirecionado para a seção "Security Quickstart"
2. **Criar usuário do banco de dados:**
   - Digite um nome de usuário
   - Gere uma senha segura ou crie sua própria (guarde-a com segurança)
   - Defina o papel do usuário como "Read and Write to any database"
   - Clique em "Create User"

3. **Configurar acesso de rede:**
   - Para desenvolvimento, você pode permitir acesso de qualquer lugar (não recomendado para produção)
   - Selecione "Allow access from anywhere" (0.0.0.0/0)
   - Alternativamente, adicione apenas seu endereço IP atual
   - Clique em "Add Entry"
   - Finalize clicando em "Finish and Close"

## 4. Obter a string de conexão

1. No painel principal do Atlas, clique em "Connect"
2. Selecione "Connect your application"
3. Escolha o driver "Node.js" e a versão mais recente
4. Copie a string de conexão fornecida, que será algo como:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Substitua `<username>` e `<password>` pelo nome de usuário e senha que você criou

## 5. Configurar o .env.local no projeto

1. No diretório raiz do projeto, crie ou edite o arquivo `.env.local`
2. Adicione sua string de conexão:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/centro-artesanato?retryWrites=true&w=majority
   ```
3. Adicione também a chave secreta para o JWT:
   ```
   JWT_SECRET=sua_chave_secreta_muito_longa_e_segura_para_jwt
   JWT_EXPIRATION=7d
   ```

## 6. Popular o banco de dados com dados iniciais

1. Instale as dependências necessárias:
   ```bash
   npm install --save-dev ts-node tsconfig-paths
   ```

2. Execute o script de seed para adicionar produtos de exemplo:
   ```bash
   npm run seed
   ```

## 7. Verificar a conexão

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:3000/api/produtos` no seu navegador para verificar se os produtos estão sendo retornados pela API

## Solução de problemas comuns

### Erro de conexão

Se você encontrar erros de conexão:
1. Verifique se as credenciais estão corretas
2. Confirme se o endereço IP foi adicionado corretamente à lista de IPs permitidos
3. Verifique se a string de conexão está formatada corretamente

### Erro "MongoNetworkError"

Este erro geralmente ocorre quando há um problema de rede ou firewall:
1. Verifique sua conexão com a internet
2. Confirme se não há firewalls bloqueando a conexão
3. Tente adicionar novamente seu IP atual na lista de IPs permitidos do Atlas

### Desenvolvimento local com MongoDB

Para desenvolvimento local sem depender do Atlas, você pode:
1. Instalar o MongoDB Community Edition na sua máquina
2. Usar Docker para executar uma instância do MongoDB
3. Alterar a string de conexão para `mongodb://localhost:27017/centro-artesanato` 