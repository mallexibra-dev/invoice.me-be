import type { Request, Response } from "express";
import {
  createInvoiceService,
  getInvoicesService,
  getInvoiceByIdService,
  updateInvoiceService,
  deleteInvoiceService,
} from "../services/invoiceServices";
import logger from "../config/logging";
import { errorResponse, successResponse } from "../utils/response";

export const createInvoice = async (req: Request, res: Response) => {
  const { company_id } = req.query;
  const token = req.headers.authorization?.replace("Bearer ", "") || "";
  const data = req.body;

  try {
    if(token === "") return errorResponse(res, 201, "Unauthorized");

    if (!company_id || company_id === "")
      return errorResponse(res, 400, "Company id is required.");

    const result = await createInvoiceService(token, company_id as string, data);

    if (result.error)
      return errorResponse(res, result.status, result.message!);

    return successResponse(res, 201, "Invoice created successfully.", result.data);
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  const { company_id } = req.query;

  try {
    if (!company_id || company_id === "")
      return errorResponse(res, 400, "Company id is required.");

    const result = await getInvoicesService(company_id as string);

    if (result.error)
      return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Invoices retrieved successfully.", result.data);
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};

export const getInvoice = async (req: Request, res: Response) => {
  const { invoice_id } = req.params;

  try {
    if (!invoice_id) return errorResponse(res, 400, "Invoice ID is required.");

    const result = await getInvoiceByIdService(invoice_id);

    if (result.error)
      return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Invoice retrieved successfully.", result.data);
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  const { invoice_id } = req.params;
  const data = req.body;

  try {
    if (!invoice_id) return errorResponse(res, 400, "Invoice ID is required.");

    const result = await updateInvoiceService(invoice_id, data);

    if (result.error)
      return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Invoice updated successfully.", result.data);
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const { invoice_id } = req.params;

  try {
    if (!invoice_id) return errorResponse(res, 400, "Invoice ID is required.");

    const result = await deleteInvoiceService(invoice_id);

    if (result.error)
      return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Invoice deleted successfully.", result.data);
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};