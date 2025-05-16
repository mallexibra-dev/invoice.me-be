import { z } from "zod";

export const templateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  is_default: z.boolean({ required_error: "is_default is required" }),
  company_id: z.string().uuid({ message: "Invalid company_id format" }),
});

export const updateTemplateSchema = templateSchema.partial();