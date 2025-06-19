# Sistema de Relatórios - iAquaSenso

Sistema web para gerenciamento e visualização de relatórios, desenvolvido com React (Frontend) e Node.js (Backend).

## 🚀 Estrutura do Projeto

O projeto está dividido em duas partes principais:

### Backend

- Node.js com Express
- PostgreSQL como banco de dados
- Sequelize como ORM
- Sistema de migrations para controle do banco de dados

### Frontend

- React com TypeScript
- Vite como bundler
- Componentes reutilizáveis
- Context API para gerenciamento de estado

## 📋 Pré-requisitos

- Node.js (v20.10.0 ou superior)
- PostgreSQL (v14 ou superior)
- NPM ou Yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_REPOSITÓRIO]
```

### 2. Backend

```bash
cd backend
npm install
```

Configure o arquivo `.env` com suas variáveis de ambiente:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=iaquasenso
```

Execute as migrations:

```bash
npm run migrate
```

Inicie o servidor:

```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🗄️ Estrutura do Banco de Dados

### Tabelas

1. `tipos_relatorio`
   - Tipos predefinidos: Gerencial, Financeiro, Operacional

2. `relatorios`
   - Nome
   - Descrição
   - Tipo (relacionamento com tipos_relatorio)

## 📊 Exemplos de Consultas SQL

### Consultas para a Tela de Register

1. **Vendas por Cliente**
```sql
SELECT 
    c.nome as cliente,
    COUNT(v.id) as total_vendas,
    SUM(v.valor_total) as valor_total
FROM vendas v
JOIN clientes c ON v.cliente_id = c.id
GROUP BY c.nome
ORDER BY valor_total DESC;
```

2. **Produtos Mais Vendidos**
```sql
SELECT 
    p.nome as produto,
    SUM(vi.quantidade) as quantidade_vendida,
    SUM(vi.valor_total) as valor_total
FROM venda_itens vi
JOIN produtos p ON vi.produto_id = p.id
GROUP BY p.nome
ORDER BY quantidade_vendida DESC;
```

3. **Vendas por Período**
```sql
SELECT 
    DATE_TRUNC('month', v.data_venda) as mes,
    COUNT(v.id) as total_vendas,
    SUM(v.valor_total) as valor_total
FROM vendas v
GROUP BY DATE_TRUNC('month', v.data_venda)
ORDER BY mes DESC;
```

4. **Clientes e Suas Últimas Compras**
```sql
SELECT 
    c.nome as cliente,
    MAX(v.data_venda) as ultima_compra,
    COUNT(v.id) as total_compras
FROM clientes c
LEFT JOIN vendas v ON c.id = v.cliente_id
GROUP BY c.nome
ORDER BY ultima_compra DESC;
```

5. **Detalhamento de Vendas**
```sql
SELECT 
    v.id as venda_id,
    c.nome as cliente,
    p.nome as produto,
    vi.quantidade,
    vi.valor_unitario,
    vi.valor_total,
    v.data_venda
FROM vendas v
JOIN clientes c ON v.cliente_id = c.id
JOIN venda_itens vi ON v.id = vi.venda_id
JOIN produtos p ON vi.produto_id = p.id
ORDER BY v.data_venda DESC;
```

## 🛠️ Tecnologias Utilizadas

### Backend
- Express.js
- Sequelize
- PostgreSQL
- CORS
- Dotenv

### Frontend
- React
- TypeScript
- Axios
- React Router DOM
- React Icons
- Vite

## 📦 API Endpoints

### Relatórios

- `GET /relatorios` - Lista todos os relatórios
- `GET /relatorios/:id` - Busca um relatório específico
- `POST /relatorios` - Cria um novo relatório
- `PUT /relatorios/:id` - Atualiza um relatório
- `DELETE /relatorios/:id` - Remove um relatório
