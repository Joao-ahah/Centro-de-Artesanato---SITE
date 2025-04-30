# Centro de Artesanato - Plataforma de E-commerce

Plataforma completa de e-commerce para um Centro de Artesanato, permitindo a gestão de produtos artesanais, vendas online e administração de conteúdo.

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, API Routes do Next.js
- **Banco de Dados**: MongoDB (com Mongoose ODM)
- **Autenticação**: JWT (JSON Web Tokens)
- **Estilização**: TailwindCSS, CSS Modules
- **Hospedagem**: Vercel (sugestão)

## 📋 Funcionalidades

### Área do Cliente
- Página inicial com produtos em destaque
- Catálogo de produtos com filtros e busca
- Visualização detalhada de produtos
- Carrinho de compras
- Checkout e pagamentos (integração com Pix, cartão de crédito, boleto)
- Cadastro e login de usuários
- Perfil do usuário com histórico de pedidos

### Painel Administrativo
- Dashboard com métricas de vendas e desempenho
- Gestão completa de produtos (CRUD)
- Gerenciamento de pedidos
- Relatórios de vendas
- Gestão de usuários e permissões
- Configurações da loja

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 18 ou superior
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/centro-artesanato.git
cd centro-artesanato
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```
MONGODB_URI=sua_uri_mongodb
JWT_SECRET=seu_token_secreto
JWT_EXPIRATION=7d
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Configure o MongoDB:
   - Veja o arquivo [MONGODB_SETUP.md](./MONGODB_SETUP.md) para instruções detalhadas de configuração do MongoDB Atlas.
   - Ou use uma instalação local do MongoDB configurando `MONGODB_URI=mongodb://localhost:27017/centro-artesanato`

5. Popule o banco de dados com dados iniciais:
```bash
npm run db:seed
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

7. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
centro-artesanato/
├── src/
│   ├── app/                    # Páginas da aplicação (Next.js App Router)
│   │   ├── admin/              # Painel administrativo
│   │   ├── api/                # Rotas da API
│   │   ├── carrinho/           # Páginas do carrinho
│   │   ├── conta/              # Páginas de conta do usuário
│   │   ├── produtos/           # Páginas de produtos
│   │   └── ...
│   ├── components/             # Componentes React reutilizáveis
│   ├── lib/                    # Utilitários e configurações
│   ├── models/                 # Modelos do Mongoose
│   ├── scripts/                # Scripts de utilidade (seed, etc.)
│   ├── styles/                 # Estilos globais
│   └── ...
├── public/                     # Arquivos estáticos
├── .env.local                  # Variáveis de ambiente (não versionado)
├── .env.local.example          # Exemplo de variáveis de ambiente
├── MONGODB_SETUP.md            # Guia de configuração do MongoDB
├── package.json
├── tailwind.config.js
└── ...
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor em modo de produção
- `npm run lint` - Executa o linter para verificar problemas no código
- `npm run db:seed` - Popula o banco de dados com produtos de exemplo
- `npm run db:clear` - Remove todos os produtos do banco de dados

## 🔧 Configuração do Banco de Dados

O projeto utiliza MongoDB como banco de dados principal. Os principais modelos de dados são:

- **Produtos**: Informações sobre os itens artesanais (nome, descrição, preço, categoria, artesão, etc.)
- **Usuários**: Dados dos clientes e administradores (nome, email, senha, endereço, etc.)
- **Pedidos**: Registro de compras e status (produtos, quantidade, valor total, status, etc.)

Para mais detalhes sobre a configuração do MongoDB, consulte o arquivo [MONGODB_SETUP.md](./MONGODB_SETUP.md).

## 🔐 API

A aplicação conta com uma API RESTful para gerenciar produtos, usuários e pedidos:

- `GET /api/produtos` - Lista todos os produtos com opções de filtro
- `GET /api/produtos/:id` - Obtém detalhes de um produto específico
- `POST /api/produtos` - Cria um novo produto (requer autenticação de admin)
- `PUT /api/produtos/:id` - Atualiza um produto existente (requer autenticação de admin)
- `DELETE /api/produtos/:id` - Remove um produto (requer autenticação de admin)

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## 📱 Contato

Para dúvidas ou informações, entre em contato:
- Email: contato@centroartesanato.com.br

# Centro de Artesanato - Admin

Este projeto implementa um painel administrativo para o Centro de Artesanato, permitindo gerenciar produtos, usuários e pedidos.

## Funcionalidades Implementadas

- 🔒 **Autenticação de Administradores**: Login seguro com JWT
- 📊 **Dashboard**: Visualização rápida de estatísticas e métricas
- 📦 **Gerenciamento de Produtos**: Cadastro, edição e exclusão
- 📤 **Upload de Imagens**: Sistema de upload simulado (desenvolvimento)
- 🛠️ **Interface Administrativa**: Layout intuitivo com sidebar e componentes reutilizáveis

## Instruções de Teste

### Login de Administrador

Para acessar o painel administrativo:

1. Acesse `/conta/login`
2. Use as credenciais:
   - Email: `admin@admin.com`
   - Senha: `senha123`

### Upload de Imagens em Produtos

O sistema possui um módulo de upload de imagens simulado para desenvolvimento:

1. Acesse o painel em `/admin/dashboard`
2. Navegue até `/admin/produtos` e clique em "Novo Produto"
3. Na seção de imagens:
   - Clique em "Fazer upload" para simular upload de imagem
   - Você verá uma barra de progresso e receberá uma URL de imagem aleatória do Unsplash
   - Você pode adicionar até 5 imagens por produto

### Banco de Dados

O sistema funciona com MongoDB. Você pode:

1. Configurar um servidor MongoDB e definir a variável `MONGODB_URI` no `.env.local`
2. Executar no modo de desenvolvimento, que utilizará dados simulados se não detectar o MongoDB

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes configurações:

```
MONGODB_URI=mongodb://localhost:27017/centro-artesanato
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRATION=7d
NODE_ENV=development
```

## Executando o Projeto

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar em modo de produção
npm start
```

## Tecnologias Utilizadas

- **Next.js**: Framework React com SSR
- **TypeScript**: Tipagem estática
- **MongoDB/Mongoose**: Banco de dados e ORM
- **JWT**: Autenticação
- **Tailwind CSS**: Framework CSS
- **React Hot Toast**: Notificações
- **Axios**: Requisições HTTP 