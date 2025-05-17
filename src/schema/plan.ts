import { z } from "zod";

export const subscriptionPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().nonnegative("Price must be 0 or more"),
  max_users: z.number().int().nonnegative("Max users must be a positive integer"),
  max_invoices: z.number().int().nonnegative("Max invoices must be a positive integer"),
  whatsapp_reminder: z.number().int().nonnegative("WhatsApp reminder count must be non-negative"),
  export_excel: z.boolean(),
  auto_reminder: z.boolean()
});

export const updateSubscriptionPlanSchema = subscriptionPlanSchema.partial();