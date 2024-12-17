# Smart Campus API

Este projeto, intitulado Sistema de Controle de Acesso e Débito Automático por RFID para o Restaurante Universitário, faz parte do Trabalho de Conclusão de Curso (TCC) do estudante Isaias Rodrigues Mendes.

Autor: Isaias Rodrigues Mendes
Orientador: Jauberth Weyll Abijaude
Curso: Ciência da Computação
Data de Conclusão: Dezembro/2024

O projeto inclui o desenvolvimento do sistema de software para controle de acesso e débito automático, mas ainda é necessário implementar o hardware que será integrado ao sistema, utilizando leitores e cartões RFID.
---

## **Descrição**
O Smart Campus API é uma aplicação para controle de acesso ao restaurante universitário e gestão automatizada de débitos e recargas em cartões RFID. Desenvolvida com Fastify, Prisma e PostgreSQL, a API oferece funcionalidades como autenticação de usuários, registro de acessos, recargas de saldo e geração de relatórios.

---

## **Tecnologias Utilizadas**

- **Fastify:** Framework leve e rápido para Node.js.
- **Prisma:** ORM para gerenciar o banco de dados PostgreSQL.
- **PostgreSQL:** Banco de dados relacional.
- **JWT:** Para autenticação e autorização de usuários.
- **Bcrypt e Crypto:** Para hashing de senhas e dados de cartões RFID.
- **Swagger:** Documentação interativa da API.

---

## **Pré-requisitos**

Certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org)

---

## **Configuração do Ambiente**

### 1. Clone o repositório
```bash
git clone https://github.com/<seu-nome-de-usuario>/<nome-do-repositorio>.git
cd <nome-do-repositorio>
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes configurações:
```env
DATABASE_URL="postgresql://<usuário>:<senha>@localhost:5432/<nome_do_banco>?schema=public"
JWT_SECRET="sua_chave_secreta_jwt"
```

### 4. Execute as migrações do Prisma
```bash
npx prisma migrate dev
```

### 5. Popule o banco de dados com os seeds (opcional)
```bash
npx prisma db seed
```

### 6. Inicie o servidor
```bash
npm start
```

---

## **Uso da API**

A API estará disponível em `http://localhost:3001`.

### **Documentação da API**

A API estará disponível em 
```
http://localhost:3001/documentation
```

### **Principais Endpoints**

#### **Autenticação**
- **POST /login**: Realiza o login e retorna o token JWT.
- **GET /validate-token**: Valida o token JWT.

#### **Usuários**
- **POST /usuarios**: Cadastra um novo usuário.
- **GET /usuarios/:matricula**: Busca um usuário por matrícula.
- **POST /usuarios/bloquear**: Bloqueia um cartão.
- **POST /usuarios/desbloquear**: Desbloqueia um cartão.

#### **Transações**
- **POST /transacao/acesso**: Registra o acesso ao sistema via cartão.
- **POST /transacao/recarga**: Realiza uma recarga de saldo.
- **GET /transacao/relatorio**: Gera relatórios de transações.
- **GET /transacao/relatorio/pdf**: Gera relatórios de transações em PDF.

---

## **Funcionalidades Principais**

1. **Autenticação e Autorização**
   - Login com JWT.
   - Permissões baseadas em papéis (ADMIN, FUNCIONARIO, ALUNO).

2. **Gestão de Cartões RFID**
   - Cadastro e gerenciamento de cartões com hash dinâmico.
   - Bloqueio e desbloqueio de cartões.

3. **Transações Seguras**
   - Registro de acessos, recargas, e uso de saldo para refeições.
   - Prevenção contra ataques de replay.

4. **Geração de Relatórios**
   - Relatórios filtrados por datas e tipos de transação.
   - Exportação em PDF.

   ## **Recursos e Segurança**
- **Hash Dinâmico**: Geração de hashes únicos para cartões em cada transação.
- **Autenticação JWT**: Controle de acesso baseado em tokens.
- **Autenticação Mútua**: Garantia de segurança entre cartão e leitor.
- **Prevenção de Replay**: Middleware para evitar reutilização de mensagens.

   ## **Trabalho Futuro: Implementação do Hardware**
Este sistema ainda requer a integração com o hardware, que será composto por leitores RFID, cartões RFID e os equipamentos necessários para o controle de acesso físico e registro de transações.

