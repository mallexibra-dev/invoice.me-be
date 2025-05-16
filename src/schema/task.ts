import { z } from "zod";

export const taskSchema = z.object({
  company_id: z.string().min(1, { message: "Company ID is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  unit_price: z.number().min(0, { message: "Unit price must be at least 0" }),
});
