# Holiday App - Backend

Este repositório contém o backend da aplicação **Holiday App**, desenvolvida para a disciplina de **Programação Web Fullstack**. O backend foi construído utilizando **Express.js**, **Sequelize** e **SQLite**.

## 📁 Estrutura de Pastas

backend/
├── src/
│ ├── config/ # Configuração do banco de dados
│ ├── models/ # Modelos Sequelize (User, Holiday)
│ └── routes/ # Rotas da API (Auth, Holidays)
├── .env # Variáveis de ambiente (chave JWT)
├── package.json
└── server.js

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [Sequelize ORM](https://sequelize.org/)
- [JWT](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [dotenv](https://github.com/motdotla/dotenv)


## 🔐 Funcionalidades

- **Login com autenticação JWT**
- **Inserção e busca de feriados manuais**
- **Autorização com middleware**
- **Armazenamento em banco de dados SQLite**
- **Relação entre usuários e feriados**
- **Proteção de rotas com token**

## ⚙️ Instalação

# Clone este repositório

git clone https://github.com/seu-usuario/holiday-app.git
cd holiday-app/backend


# Instale as dependências
npm install

#Crie um arquivo .env na raiz do backend/ com o seguinte conteúdo:
JWT_SECRET=sua_chave_jwt_segura


## ⚙️ Rodar Localmente
npm start

# O servidor estará disponível em:
http://localhost:3001


## 🧰 Rotas da API

# 🔑 Auth
POST /auth/login
Login de usuário existente.
Body: { 
    "username": "admin",
    "password": "123456"
     }

POST /auth/register
Cria um novo usuário (rota auxiliar para testes).
Body: { 
    "username": "admin", 
    "password": "123456" 
    }

# 📆 Holidays (Requer JWT)
GET /holidays
Lista os feriados do usuário logado.

POST /holidays
Adiciona um novo feriado.

Body:{
  "name": "Independência",
  "date": "2025-09-07",
  "countryCode": "BR",
  "type": "Public"
}

# 🔒 Segurança Implementada

Hash de senha com bcrypt

Autenticação com JWT

Middleware de proteção de rotas

Separação por usuário

Verificação de campos obrigatórios