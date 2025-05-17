import { z } from "zod";

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["owner", "admin"]),
  email: z.string().email("Email is invalid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company_id: z.string().min(1, "Company ID is required"),
  profile_image: z.string().optional()
});
