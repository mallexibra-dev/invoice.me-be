/*
  Warnings:

  - You are about to alter the column `phone` on the `Companies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `price` on the `SubscriptionPLan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to drop the column `company_id` on the `Subscriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscription_id]` on the table `Companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subscription_id` to the `Companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_name` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_number` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_default` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_id` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'admin', 'administrator');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('before_due', 'on_due', 'after_due');

-- CreateEnum
CREATE TYPE "ReminderChannel" AS ENUM ('whatsapp', 'email');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('unpaid', 'paid', 'overdue');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('bank', 'ewallet');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('invoice', 'subscription');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('unpaid', 'pending', 'paid', 'cancelled', 'failed', 'expired');

-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_company_id_fkey";

-- DropIndex
DROP INDEX "Subscriptions_company_id_key";

-- AlterTable
ALTER TABLE "Companies" ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscription_id" TEXT NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "logo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "account_name" TEXT NOT NULL,
ADD COLUMN     "account_number" TEXT NOT NULL,
ADD COLUMN     "is_default" BOOLEAN NOT NULL,
ADD COLUMN     "wallet_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionPLan" ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Subscriptions" DROP COLUMN "company_id",
ALTER COLUMN "start_date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "profile_image" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL;

-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tasks" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "unit_price" INTEGER NOT NULL,

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "Templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReminderSchedules" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "type" "ReminderType" NOT NULL,
    "days_offset" INTEGER NOT NULL,
    "channel" "ReminderChannel" NOT NULL,
    "message" TEXT NOT NULL,
    "is_sent" BOOLEAN NOT NULL,
    "sent_at" TIMESTAMP(3),

    CONSTRAINT "ReminderSchedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoices" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'unpaid',
    "issue_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "notes" TEXT,
    "template_id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WalletType" NOT NULL,
    "logo" TEXT,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "gross_amount" INTEGER,
    "net_amount" INTEGER NOT NULL,
    "fee" INTEGER,
    "payment_method" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'unpaid',
    "plan_id" TEXT,
    "update_at" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clients_email_key" ON "Clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_order_id_key" ON "Transaction"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Companies_subscription_id_key" ON "Companies"("subscription_id");

-- AddForeignKey
ALTER TABLE "Companies" ADD CONSTRAINT "Companies_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Templates" ADD CONSTRAINT "Templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Templates" ADD CONSTRAINT "Templates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderSchedules" ADD CONSTRAINT "ReminderSchedules_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "SubscriptionPLan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
