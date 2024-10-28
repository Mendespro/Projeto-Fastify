/*
  Warnings:

  - A unique constraint covering the columns `[hashCartao]` on the table `Cartao` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashCartao` to the `Cartao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cartao" ADD COLUMN     "hashCartao" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cartao_hashCartao_key" ON "Cartao"("hashCartao");
