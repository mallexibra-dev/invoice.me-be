import { z } from "zod";

export const invoiceItemSchema = z
  .object({
    title: z.string(),
    unit_price: z.number().nonnegative(),
    quantity: z.number().int().positive(),
    total: z.number().nonnegative(),
  })
  .strict();

export const reminderScheduleSchema = z
  .object({
    type: z.enum(["before_due", "on_due", "after_due"]),
    days_offset: z.number().int(),
    channel: z.enum(["whatsapp", "email"]),
    message: z.string(),
    is_sent: z.boolean(),
  })
  .strict();

export const invoiceSchema = z
  .object({
    invoice_number: z.string(),
    title: z.string(),
    status: z.enum(["unpaid", "paid", "overdue"]),
    issue_date: z.preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date
          ? new Date(arg)
          : undefined,
      z.date()
    ),
    due_date: z.preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date
          ? new Date(arg)
          : undefined,
      z.date()
    ),
    notes: z.string().optional(),
    template_id: z.string().uuid(),
    total: z.number().nonnegative(),
    items: z.array(invoiceItemSchema).min(1),
    reminders: z.array(reminderScheduleSchema).optional(),
  })
  .strict();

  export const updateInvoiceSchema = invoiceSchema.omit({items: true, reminders: true}).partial();
  export const updateInvoiceItemSchema = invoiceItemSchema.partial();
  export const updateReminderSchema = reminderScheduleSchema.partial();