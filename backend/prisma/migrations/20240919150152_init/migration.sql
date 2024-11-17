/*
  Warnings:

  - You are about to drop the column `date` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `booking_date` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_slot` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "amount" TEXT NOT NULL,
ADD COLUMN     "booking_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "provider_id" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "time_slot" TEXT NOT NULL;
