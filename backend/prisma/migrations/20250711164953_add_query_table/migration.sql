/*
  Warnings:

  - You are about to drop the column `query` on the `relatorios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "relatorios" DROP COLUMN "query",
ADD COLUMN     "query_id" INTEGER;

-- CreateTable
CREATE TABLE "queries" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_query_id_fkey" FOREIGN KEY ("query_id") REFERENCES "queries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
