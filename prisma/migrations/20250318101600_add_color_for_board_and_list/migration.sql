/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "dueDate";

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "color" TEXT;
