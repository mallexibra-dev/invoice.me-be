import { z } from "zod";

export const paymentSchema = z.object({
  company_id: z.string({
    required_error: "Company ID is required",
  }).min(1, "Company ID is required"),
  wallet_id: z.string({
    required_error: "Wallet ID is required",
  }).min(1, "Wallet ID is required"),
  account_name: z.string(),
  account_number: z.string(),
  is_default: z.boolean({
    required_error: "is_default must be a boolean value"
  })
});

export const updatePaymentSchema = paymentSchema.omit({company_id: true});