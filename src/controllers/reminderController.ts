import type { Request, Response } from "express";
import {
  getReminderSchedulesService,
  updateReminderScheduleService,
  deleteReminderScheduleService,
} from "../services/reminderServices";
import logger from "../config/logging";
import { errorResponse, successResponse } from "../utils/response";

export const getReminderSchedules = async (req: Request, res: Response) => {
  const { invoice_id } = req.params;

  try {
    if (!invoice_id) return errorResponse(res, 400, "Invoice ID is required.");

    const result = await getReminderSchedulesService(invoice_id);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Reminder schedules retrieved successfully.",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};

export const updateReminderSchedule = async (req: Request, res: Response) => {
  const { reminder_id } = req.params;
  const data = req.body;

  try {
    if (!reminder_id)
      return errorResponse(res, 400, "Reminder ID is required.");

    const result = await updateReminderScheduleService(reminder_id, data);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Reminder schedule updated successfully.",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};

export const deleteReminderSchedule = async (req: Request, res: Response) => {
  const { reminder_id } = req.params;

  try {
    if (!reminder_id)
      return errorResponse(res, 400, "Reminder ID is required.");

    const result = await deleteReminderScheduleService(reminder_id);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Reminder schedule deleted successfully.",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};