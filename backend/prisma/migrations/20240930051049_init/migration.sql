/*
  Warnings:

  - Added the required column `district` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
