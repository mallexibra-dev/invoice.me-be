import { z } from "zod";
import { userSchema } from "./users";

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(12, "Phone must be at least 12 digits"),
  email: z.string().email("Company email is invalid"),
  brand_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  subscription_id: z.string().min(1, "Subscription ID is required"),
});

export const registerCompanyAndUserSchema = z.object({
  user: userSchema.omit({company_id: true}),
  company: companySchema,
});