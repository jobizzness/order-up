-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;
