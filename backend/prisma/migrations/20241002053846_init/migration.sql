/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider_id]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `service_provider_id` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "service_provider_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "photo";

-- CreateIndex
CREATE UNIQUE INDEX "Service_provider_id_key" ON "Service"("provider_id");
