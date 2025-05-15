import { z } from "zod";

export const paymentSchema = z.object({
  company_id: z.string({
    required_error: "Company ID is required",
  }).min(1, "Company ID is required"),
  name: z.string({
    required_error: "Name is required",
  }).min(1, "Name is required"),
  account_name: z.string(),
  account_number: z.string(),
  type: z.enum(['bank', 'ewallet', 'cash', 'other'], {
    required_error: "Payment type is required",
    invalid_type_error: "Payment type must be one of: bank, ewallet, cash, other"
  }),
  is_default: z.boolean({
    required_error: "is_default must be a boolean value"
  })
});

export const updatePaymentSchema = paymentSchema.omit({company_id: true});