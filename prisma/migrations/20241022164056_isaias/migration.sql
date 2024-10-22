-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "TipoRefeicao" AS ENUM ('ALMOCO', 'JANTAR');

-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('DEPOSITO', 'REFEICAO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "email" TEXT,
    "senha" TEXT NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "fotoUsuario" BYTEA,
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cartao" (
    "id" SERIAL NOT NULL,
    "numeroCartao" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "dataAtivacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" INTEGER NOT NULL,

    CONSTRAINT "Cartao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refeicao" (
    "id" SERIAL NOT NULL,
    "tipoRefeicao" "TipoRefeicao" NOT NULL,
    "valorRefeicao" DECIMAL(5,2) NOT NULL,
    "dataRefeicao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" INTEGER NOT NULL,

    CONSTRAINT "Refeicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposito" (
    "id" SERIAL NOT NULL,
    "valorDeposito" DECIMAL(10,2) NOT NULL,
    "dataDeposito" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" INTEGER NOT NULL,

    CONSTRAINT "Deposito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acesso" (
    "id" SERIAL NOT NULL,
    "dataAcesso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "permitido" BOOLEAN NOT NULL DEFAULT true,
    "idCartao" INTEGER NOT NULL,

    CONSTRAINT "Acesso_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "BloqueioCartao" (
    "id" SERIAL NOT NULL,
    "motivoBloqueio" TEXT,
    "dataBloqueio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idCartao" INTEGER NOT NULL,

    CONSTRAINT "BloqueioCartao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_matricula_key" ON "Usuario"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Cartao_numeroCartao_key" ON "Cartao"("numeroCartao");

-- AddForeignKey
ALTER TABLE "Cartao" ADD CONSTRAINT "Cartao_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refeicao" ADD CONSTRAINT "Refeicao_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposito" ADD CONSTRAINT "Deposito_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acesso" ADD CONSTRAINT "Acesso_idCartao_fkey" FOREIGN KEY ("idCartao") REFERENCES "Cartao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoTransacao" ADD CONSTRAINT "HistoricoTransacao_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueioCartao" ADD CONSTRAINT "BloqueioCartao_idCartao_fkey" FOREIGN KEY ("idCartao") REFERENCES "Cartao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
