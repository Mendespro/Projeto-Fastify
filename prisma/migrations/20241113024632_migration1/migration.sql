-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FUNCIONARIO', 'ALUNO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('DEPOSITO', 'REFEICAO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "email" TEXT,
    "senha" TEXT,
    "saldo" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "role" "Role" NOT NULL DEFAULT 'FUNCIONARIO',
    "fotoUsuario" BYTEA,
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cartao" (
    "id" SERIAL NOT NULL,
    "hashCartao" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "dataAtivacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" INTEGER NOT NULL,

    CONSTRAINT "Cartao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoTransacao" (
    "id" SERIAL NOT NULL,
    "tipoTransacao" "TipoTransacao" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "dataTransacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" INTEGER NOT NULL,

    CONSTRAINT "HistoricoTransacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acesso" (
    "id" SERIAL NOT NULL,
    "dataAcesso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "permitido" BOOLEAN NOT NULL DEFAULT true,
    "idCartao" INTEGER NOT NULL,
    "observacao" TEXT,

    CONSTRAINT "Acesso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloqueioCartao" (
    "id" SERIAL NOT NULL,
    "motivoBloqueio" TEXT,
    "dataBloqueio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idCartao" INTEGER NOT NULL,
    "temporario" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BloqueioCartao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_matricula_key" ON "Usuario"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_senha_key" ON "Usuario"("senha");

-- CreateIndex
CREATE UNIQUE INDEX "Cartao_hashCartao_key" ON "Cartao"("hashCartao");

-- AddForeignKey
ALTER TABLE "Cartao" ADD CONSTRAINT "Cartao_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoTransacao" ADD CONSTRAINT "HistoricoTransacao_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acesso" ADD CONSTRAINT "Acesso_idCartao_fkey" FOREIGN KEY ("idCartao") REFERENCES "Cartao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueioCartao" ADD CONSTRAINT "BloqueioCartao_idCartao_fkey" FOREIGN KEY ("idCartao") REFERENCES "Cartao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
