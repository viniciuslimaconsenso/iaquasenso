/*
  Warnings:

  - You are about to alter the column `nome` on the `clientes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `valor_unitario` on the `produtos` table. All the data in the column will be lost.
  - You are about to alter the column `nome` on the `produtos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `valor_unitario` on the `venda_itens` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `vendas` table. All the data in the column will be lost.
  - You are about to drop the column `valor_total` on the `vendas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `clientes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tipo]` on the table `tipos_relatorio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preco` to the `produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preco_unitario` to the `venda_itens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "venda_itens" DROP CONSTRAINT "venda_itens_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "vendas" DROP CONSTRAINT "vendas_cliente_id_fkey";

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "telefone" VARCHAR(20),
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "produtos" DROP COLUMN "valor_unitario",
ADD COLUMN     "estoque" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "preco" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "venda_itens" DROP COLUMN "valor_unitario",
ADD COLUMN     "preco_unitario" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "vendas" DROP COLUMN "data",
DROP COLUMN "valor_total",
ADD COLUMN     "data_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_relatorio_tipo_key" ON "tipos_relatorio"("tipo");

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venda_itens" ADD CONSTRAINT "venda_itens_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
