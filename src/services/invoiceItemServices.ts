import logger from "../config/logging";
import prisma from "../config/prismaClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const getInvoiceItemsService = async (
  invoiceId: string
): Promise<ServiceResponse> => {
  try {
    const items = await prisma.invoiceItem.findMany({
      where: { invoice_id: invoiceId },
    });

    if (!items || items.length === 0)
      return { error: true, status: 404, message: "Invoice items not found" };

    return { error: false, data: items };
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

export const updateInvoiceItemService = async (
  itemId: string,
  data: {
    title?: string;
    unit_price?: number;
    quantity?: number;
    total?: number;
  }
): Promise<ServiceResponse> => {
  try {
    const item = await prisma.invoiceItem.findFirst({ where: { id: itemId } });

    if (!item)
      return { error: true, status: 404, message: "Invoice item not found" };

    const updatedItem = await prisma.invoiceItem.update({
      where: { id: itemId },
      data,
    });

    return { error: false, data: updatedItem };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error) {
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    }

    return { error: true, status: 500, message: "Something went wrong!" };
  }
};

export const deleteInvoiceItemService = async (
  itemId: string
): Promise<ServiceResponse> => {
  try {
    const item = await prisma.invoiceItem.findFirst({ where: { id: itemId } });

    if (!item)
      return { error: true, status: 404, message: "Invoice item not found" };

    const deletedItem = await prisma.invoiceItem.delete({
      where: { id: itemId },
    });

    return { error: false, data: deletedItem };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error) {
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    }

    return { error: true, status: 500, message: "Something went wrong!" };
  }
};
