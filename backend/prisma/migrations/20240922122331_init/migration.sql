/*
  Warnings:

  - Added the required column `email` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL;
