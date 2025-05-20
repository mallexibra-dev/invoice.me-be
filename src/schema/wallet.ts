import { z } from "zod";

export const walletSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["bank", "wallet"], {
    errorMap: () => ({ message: "Type must be either 'bank' or 'wallet'" }),
  }),
  logo: z.string().optional(),
});

export const updateWalletSchema = walletSchema.partial();
