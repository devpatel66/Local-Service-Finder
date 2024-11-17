/*
  Warnings:

  - You are about to drop the column `category_id` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `sub_category_id` on the `Service` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `SubCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_category` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ServiceImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_sub_category_id_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "category_id",
DROP COLUMN "sub_category_id",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "sub_category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceImage" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_name_key" ON "SubCategory"("name");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_sub_category_fkey" FOREIGN KEY ("sub_category") REFERENCES "SubCategory"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
