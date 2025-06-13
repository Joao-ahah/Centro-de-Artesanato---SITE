# Estrutura das Páginas Individuais de Produtos

## Visão Geral

Cada produto cadastrado no sistema possui uma página individual acessível através da URL `/produtos/[id]`, onde `[id]` é o identificador único do produto. Esta estrutura permite uma experiência detalhada e interativa para cada produto.

## Estrutura de Arquivos

```
src/
├── app/
│   ├── (main)/
│   │   └── produtos/
│   │       ├── page.tsx              # Listagem de produtos
│   │       └── [id]/
│   │           └── page.tsx          # Página individual do produto
│   └── api/
│       ├── produtos/
│       │   ├── route.ts              # API principal de produtos
│       │   ├── [id]/
│       │   │   └── route.ts          # API para produto específico
│       │   └── avaliacoes/
│       │       └── route.ts          # API para avaliações
│       └── encomendas/
│           └── route.ts              # API para encomendas
├── components/
│   ├── AvaliacaoModal.tsx           # Modal para avaliar produtos
│   ├── Estrelas.tsx                # Componente de avaliação em estrelas
│   └── Loading.tsx                  # Componente de carregamento
└── models/
    └── produto.ts                   # Modelo do produto
```

## Funcionamento da Página Individual

### 1. Roteamento Dinâmico
- **URL**: `/produtos/[id]`
- **Arquivo**: `src/app/(main)/produtos/[id]/page.tsx`
- **Parâmetro**: `id` do produto (extraído via `useParams()`)

### 2. Carregamento de Dados
```typescript
// Busca o produto específico
const response = await axios.get(`/api/produtos/${params.id}`);

// Busca produtos relacionados da mesma categoria
const responseRelacionados = await axios.get(
  `/api/produtos?categoria=${produto.categoria}&limite=4`
);
```

### 3. Estrutura da Página

#### **Navegação (Breadcrumbs)**
- Home → Produtos → [Categoria] → [Nome do Produto]

#### **Galeria de Imagens**
- Imagem principal com zoom/visualização
- Miniaturas para navegação entre imagens
- Indicador de produto esgotado (overlay)

#### **Informações do Produto**
- Nome e artesão responsável
- Sistema de avaliações (estrelas)
- Preço (com desconto se aplicável)
- Descrição detalhada
- Especificações técnicas:
  - Categoria
  - Material
  - Dimensões
  - Disponibilidade em estoque

#### **Controles de Compra**
- Seletor de quantidade
- Botão "Adicionar ao Carrinho"
- Botão "Comprar Agora"
- Botão "Solicitar Encomenda" (para grandes quantidades)

#### **Ações Secundárias**
- Avaliar produto
- Adicionar aos favoritos
- Compartilhar produto

#### **Produtos Relacionados**
- Grid com 4 produtos da mesma categoria
- Links diretos para outras páginas de produtos

## APIs Utilizadas

### 1. API de Produto Específico
```typescript
// GET /api/produtos/[id]
{
  "success": true,
  "produto": {
    "_id": "1",
    "nome": "Vaso de Cerâmica Artesanal",
    "descricao": "...",
    "preco": 120.00,
    "categoria": "Cerâmica",
    "imagens": [...],
    "avaliacao": 4.5,
    "totalAvaliacoes": 12,
    // ... outros campos
  }
}
```

### 2. API de Avaliações
```typescript
// POST /api/produtos/avaliacoes
{
  "produtoId": "1",
  "avaliacao": 5,
  "comentario": "Produto excelente!",
  "nomeUsuario": "João Silva"
}
```

### 3. API de Encomendas
```typescript
// POST /api/encomendas
{
  "produtoId": "1",
  "produtoNome": "Vaso de Cerâmica",
  "nome": "Cliente",
  "email": "cliente@email.com",
  "quantidade": "10",
  "observacoes": "Personalizações especiais"
}
```

## Funcionalidades Implementadas

### ✅ Sistema de Avaliações
- Modal interativo para avaliação
- Sistema de estrelas (1-5)
- Comentários opcionais
- Cálculo automático da média
- Exibição do número total de avaliações

### ✅ Carrinho de Compras
- Integração com contexto do carrinho
- Controle de quantidade
- Validação de estoque
- Feedback visual (loading states)

### ✅ Sistema de Encomendas
- Modal para solicitação de grandes quantidades
- Formulário completo com validações
- Envio de emails automáticos
- Notificação para administradores

### ✅ Galeria de Imagens
- Navegação entre múltiplas imagens
- Layout responsivo
- Fallback para produtos sem imagens

### ✅ Produtos Relacionados
- Busca automática por categoria
- Exclusão do produto atual
- Links para navegação entre produtos

### ✅ Estados de Carregamento
- Loading durante busca de dados
- Estados de erro com redirecionamento
- Feedback visual para ações do usuário

### ✅ Tratamento de Erros
- Página 404 para produtos não encontrados
- Logs detalhados para debugging
- Redirecionamento automático em caso de erro

## Responsividade

A página é totalmente responsiva com breakpoints para:
- **Mobile**: Layout em coluna única
- **Tablet**: Layout híbrido
- **Desktop**: Layout de duas colunas (imagem + informações)

## SEO e Performance

### Meta Tags Dinâmicas
```typescript
// Baseadas nos dados do produto
<title>{produto.nome} - Centro de Artesanato</title>
<meta name="description" content={produto.descricao} />
<meta property="og:title" content={produto.nome} />
<meta property="og:image" content={produto.imagens[0]} />
```

### Otimizações de Imagem
- Uso do componente `Image` do Next.js
- Lazy loading automático
- Otimização de tamanho e formato

## Integração com Backend

### Fallback para Dados Simulados
Se o MongoDB não estiver disponível, o sistema automaticamente usa dados simulados:

```typescript
// Dados simulados em src/app/api/produtos/route.ts
export const produtosSimulados = [
  {
    _id: '1',
    nome: 'Vaso de Cerâmica Artesanal',
    // ... dados completos
  }
];
```

### Validações
- Verificação de ID válido
- Tratamento de produtos inativos
- Validação de dados de entrada

## Como Testar

1. **Acesse um produto específico**:
   ```
   http://localhost:3000/produtos/1
   ```

2. **Teste as APIs diretamente**:
   ```bash
   curl "http://localhost:3000/api/produtos/1"
   curl "http://localhost:3000/api/produtos"
   ```

3. **Funcionalidades a testar**:
   - Navegação entre imagens
   - Adição ao carrinho
   - Sistema de avaliações
   - Solicitação de encomendas
   - Produtos relacionados

## Próximas Melhorias

### 🔄 Em Desenvolvimento
- [ ] Sistema de favoritos persistente
- [ ] Compartilhamento social
- [ ] Zoom avançado nas imagens
- [ ] Chat/suporte em tempo real

### 🎯 Planejado
- [ ] Histórico de visualizações
- [ ] Recomendações personalizadas
- [ ] Sistema de comparação de produtos
- [ ] Reviews com fotos

## Observações Técnicas

### Performance
- Uso de `Promise.all()` para carregamento paralelo
- Lazy loading de componentes pesados
- Debounce em ações do usuário

### Acessibilidade
- Labels apropriados em botões
- Navegação por teclado
- Contraste adequado de cores
- Alt texts em imagens

### Segurança
- Sanitização de dados de entrada
- Validação de IDs
- Rate limiting nas APIs
- Escape de HTML em comentários 