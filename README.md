Projeto Fastify
Este é um projeto de API REST usando Fastify, Prisma e PostgreSQL.
Pré-requisitos

Node.js
PostgreSQL

Configuração

Clone o repositório:
Copygit clone https://github.com/<seu-nome-de-usuario>/<nome-do-repositorio>.git
cd <nome-do-repositorio>

Instale as dependências:
Copynpm install

Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto e adicione:
CopyDATABASE_URL="postgresql://usuário:senha@localhost:5432/nome_do_banco?schema=public"

Execute as migrações do Prisma:
Copynpx prisma migrate dev

Inicie o servidor:
Copynpm start


Uso
A API estará disponível em http://localhost:3000.
Endpoints disponíveis:

GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id

Contribuição
Pull requests são bem-vindos. Para mudanças importantes, abra uma issue primeiro para discutir o que você gostaria de mudar.
Licença
MIT