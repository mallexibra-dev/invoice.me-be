import logger from "../config/logging";
import prisma from "../config/prismaClient";
import supabase from "../config/supabaseClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const createInvoiceService = async (
  token: string,
  companyId: string,
  data: any
): Promise<ServiceResponse> => {
  const { items, reminders, total, ...invoiceData } = data;
  try {
    const user = await supabase.auth.getUser(token);

    const calculatedTotal = items.reduce((acc: number, item: any) => {
      const itemTotal = item.quantity * item.unit_price;
      if (itemTotal !== item.total)
        throw new Error("Invalid item total calculation");
      return acc + item.total;
    }, 0);

    if (calculatedTotal !== total)
      throw new Error("Invalid overall total calculation");

    const result = await prisma.$transaction(async (tx) => {
      const createdInvoice = await tx.invoices.create({
        data: {
          ...invoiceData,
          total,
          company_id: companyId,
          user_id: user.data.user?.id,
        },
      });

      const createdItems = await tx.invoiceItem.createMany({
        data: items.map((item: any) => ({
          ...item,
          invoice_id: createdInvoice.id,
        })),
      });

      const createdReminders = await tx.reminderSchedules.createMany({
        data: reminders.map((reminder: any) => ({
          ...reminder,
          invoice_id: createdInvoice.id,
        })),
      });

      return {
        invoice: createdInvoice,
        items: createdItems,
        reminders: createdReminders,
      };
    });

    return { error: false, data: result };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };

    return { error: true, status: 500, message: "Something wrong!" };
  }
};

export const getInvoicesService = async (
  companyId: string
): Promise<ServiceResponse> => {
  try {
    const invoices = await prisma.invoices.findMany({
      where: { company_id: companyId },
    });

    return { error: false, data: invoices };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };

    return { error: true, status: 500, message: "Something went wrong!" };
  }
};

export const getInvoiceByIdService = async (
  invoiceId: string
): Promise<ServiceResponse> => {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: { id: invoiceId },
      include: {
        InvoiceItem: true,
        ReminderSchedules: true,
      },
    });

    if (!invoice)
      return {
        error: true,
        status: 404,
        message: "Invoice not found",
      };

    return { error: false, data: invoice };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };

    return { error: true, status: 500, message: "Something went wrong!" };
  }
};

export const updateInvoiceService = async (
  invoiceId: string,
  data: any
): Promise<ServiceResponse> => {
  try {
    const updatedInvoice = await prisma.invoices.update({
      where: { id: invoiceId },
      data,
    });

    return { error: false, data: updatedInvoice };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };

    return { error: true, status: 500, message: "Something went wrong!" };
  }
};

export const deleteInvoiceService = async (
  invoiceId: string
): Promise<ServiceResponse> => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.invoiceItem.deleteMany({
        where: { invoice_id: invoiceId },
      });

      await tx.reminderSchedules.deleteMany({
        where: { invoice_id: invoiceId },
      });

      const deletedInvoice = await tx.invoices.delete({
        where: { id: invoiceId },
      });

      return deletedInvoice;
    });

    return { error: false, data: result };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };

    return { error: true, status: 500, message: "Something went wrong!" };
  }
};