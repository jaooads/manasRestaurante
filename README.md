# 🍽️ ManasRestaurante

Sistema completo para gerenciamento de restaurante, desenvolvido em **Node.js + TypeScript + Sequelize (MySQL)**.

---

## 🚀 Sobre o Projeto

O **ManasRestaurante** tem como objetivo oferecer uma solução prática e direta para controle de **pedidos** e **fechamento de caixa** em restaurantes e lanchonetes.

O sistema é baseado em uma arquitetura simples, mas sólida, permitindo futuras expansões para relatórios, dashboards e controle financeiro.

---

## 🧩 Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Express**
- **Sequelize (ORM)**
- **MySQL**
- **Dotenv** (variáveis de ambiente)

---

## 🗂️ Estrutura do Projeto

src/
├─ database/
│ └─ index.ts
├─ models/
│ ├─ Cliente.ts
│ ├─ Pedido.ts
│ ├─ ItemPedido.ts
│ └─ Caixa.ts
├─ controllers/
│ ├─ pedidoController.ts
│ ├─ caixaController.ts
├─ routes/
│ ├─ pedidoRoutes.ts
│ ├─ caixaRoutes.ts
├─ server.ts

---

## ⚙️ Funcionalidades Principais

- 📋 **Cadastro de clientes**
- 🍽️ **Criação e listagem de pedidos**
- 💵 **Fechamento de caixa**
- 📅 **Controle diário e mensal de vendas**
- 🔧 Estrutura pronta para expansão (dashboard, relatórios, etc.)

---

## 🛠️ Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/manasRestaurante.git
2. Instalar as dependências
bash
Copiar código
npm install
3. Configurar o banco de dados
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

env
Copiar código
DB_NAME=manas_restaurante
DB_USER=root
DB_PASS=sua_senha
DB_HOST=localhost
DB_DIALECT=mysql
PORT=3000
4. Rodar as migrações/sincronização
bash
Copiar código
npm run dev
5. Testar a API
Acesse em:

arduino
Copiar código
http://localhost:3000
📅 Próximas Etapas
 Implementar dashboard com estatísticas de vendas

 Adicionar filtro por período e cliente

 Exportar relatórios em PDF

 Criar interface desktop (Electron)

👨‍💻 Autor
João Arthur
Desenvolvedor Back-end | Node.js | TypeScript | MySQL
