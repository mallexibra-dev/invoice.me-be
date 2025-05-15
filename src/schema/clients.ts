import { z } from "zod";

export const clientSchema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email is invalid"),
  phone: z
    .string()
    .min(12, "Phone number must be at least 12 characters")
    .max(15, "Phone number must be at most 15 characters")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  address: z.string().min(1, "Address is required"),
  note: z.string().optional()
});