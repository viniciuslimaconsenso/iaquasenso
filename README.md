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

## 👥 Autores

- [Seu Nome/Empresa]

## 📄 Licença

Este projeto está sob a licença [TIPO_DE_LICENÇA] - veja o arquivo LICENSE.md para detalhes 