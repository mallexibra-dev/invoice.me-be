import logger from "../config/logging";
import prisma from "../config/prismaClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const getReminderSchedulesService = async (
  invoiceId: string
): Promise<ServiceResponse> => {
  try {
    const reminders = await prisma.reminderSchedules.findMany({
      where: { invoice_id: invoiceId },
    });

    if(!reminders || reminders.length === 0) return {error: true, status: 404, message: "Reminders not found"};

    return { error: false, data: reminders };
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

export const updateReminderScheduleService = async (
  reminderId: string,
  data: {
    type?: "before_due" | "on_due" | "after_due";
    days_offset?: number;
    channel?: "whatsapp" | "email";
    message?: string;
    is_sent?: boolean;
  }
): Promise<ServiceResponse> => {
  try {
    const reminder = await prisma.reminderSchedules.findFirst({where: {id: reminderId}});

    if(!reminder) return {error: true, status: 404, message: "Reminder not found"};

    const updatedReminder = await prisma.reminderSchedules.update({
      where: { id: reminderId },
      data,
    });

    return { error: false, data: updatedReminder };
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

export const deleteReminderScheduleService = async (
  reminderId: string
): Promise<ServiceResponse> => {
  try {
    const reminder = await prisma.reminderSchedules.findFirst({where: {id: reminderId}});

    if(!reminder) return {error: true, status: 404, message: "Reminder not found"};
    
    const deletedReminder = await prisma.reminderSchedules.delete({
      where: { id: reminderId },
    });

    return { error: false, data: deletedReminder };
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