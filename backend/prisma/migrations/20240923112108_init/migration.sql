-- CreateTable
CREATE TABLE "State" (
    "state_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("state_id")
);

-- CreateTable
CREATE TABLE "District" (
    "district_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "district_code" TEXT NOT NULL,
    "state_id" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("district_id")
);

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;
