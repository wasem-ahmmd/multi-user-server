/*
  Warnings:

  - You are about to drop the column `Relationship` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "Relationship",
ADD COLUMN     "relationship" TEXT;
