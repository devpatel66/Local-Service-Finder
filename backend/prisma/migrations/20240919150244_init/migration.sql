/*
  Warnings:

  - You are about to drop the column `msg` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `message` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "msg",
ADD COLUMN     "message" TEXT NOT NULL;
