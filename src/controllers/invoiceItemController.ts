import type { Request, Response } from "express";
import {
  getInvoiceItemsService,
  updateInvoiceItemService,
  deleteInvoiceItemService,
} from "../services/invoiceItemServices";
import logger from "../config/logging";
import { errorResponse, successResponse } from "../utils/response";

export const getInvoiceItems = async (req: Request, res: Response) => {
  const { invoice_id } = req.params;

  try {
    if (!invoice_id) return errorResponse(res, 400, "Invoice ID is required.");

    const result = await getInvoiceItemsService(invoice_id);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Invoice items retrieved successfully.",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};

export const updateInvoiceItem = async (req: Request, res: Response) => {
  const { item_id } = req.params;
  const data = req.body;

  try {
    if (!item_id)
      return errorResponse(res, 400, "Invoice item ID is required.");

    const result = await updateInvoiceItemService(item_id, data);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Invoice item updated successfully.",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};

export const deleteInvoiceItem = async (req: Request, res: Response) => {
  const { item_id } = req.params;

  try {
    if (!item_id)
      return errorResponse(res, 400, "Invoice item ID is required.");

    const result = await deleteInvoiceItemService(item_id);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Invoice item deleted successfully.",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};