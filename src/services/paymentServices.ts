import logger from "../config/logging";
import prisma from "../config/prismaClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const createPaymentService = async (
  companyId: string,
  data: any
): Promise<ServiceResponse> => {
  try {
    const payment = await prisma.payment.create({
      data: { ...data, company_id: companyId },
    });
    return { error: false, data: payment };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    return { error: true, status: 500, message: "Something wrong." };
  }
};

export const updatePaymentService = async (
  paymentId: string,
  data: any
): Promise<ServiceResponse> => {
  try {
    const existing = await prisma.payment.findFirst({
      where: { id: paymentId },
    });
    if (!existing)
      return { error: true, status: 404, message: "Payment not found" };
    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data,
    });
    return { error: false, data: updated };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    return { error: true, status: 500, message: "Something wrong." };
  }
};

export const getAllPaymentService = async (
  companyId: string
): Promise<ServiceResponse> => {
  try {
    const payments = await prisma.payment.findMany({
      where: { company_id: companyId },
    });
    return { error: false, data: payments };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    return { error: true, status: 500, message: "Something wrong." };
  }
};

export const getPaymentService = async (
  paymentId: string
): Promise<ServiceResponse> => {
  try {
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId },
    });
    return { error: false, data: payment };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    return { error: true, status: 500, message: "Something wrong." };
  }
};

export const deletePaymentService = async (
  paymentId: string
): Promise<ServiceResponse> => {
  try {
    await prisma.payment.delete({ where: { id: paymentId } });
    return { error: false, data: null };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    return { error: true, status: 500, message: "Something wrong." };
  }
};
