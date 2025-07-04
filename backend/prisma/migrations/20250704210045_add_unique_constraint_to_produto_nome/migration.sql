/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `produtos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "produtos_nome_key" ON "produtos"("nome");
