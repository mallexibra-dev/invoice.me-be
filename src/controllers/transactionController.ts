import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import {
  cancelSendInvoiceService,
  cancelTransactionService,
  chargeTransactionService,
  notificationTransactionService,
  sendTransaction,
  statusTransactionService,
} from "../services/transactionService";
import logger from "../config/logging";

export const sendTransactionController = async (req: Request, res: Response) => {
  const {invoice_id} = req.params;
  try {
    if(!invoice_id || invoice_id === "") return errorResponse(res, 403, "Invalid invoice id");

    const result = await sendTransaction(invoice_id);

    if(result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Send transaction successfully", result.data);
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
}

export const chargeTransaction = async (req: Request, res: Response) => {
  const { payment_type, transaction_details, customer_details, amount } = req.body;
  try {
    if (!payment_type || !transaction_details || !customer_details || !amount)
      return errorResponse(res, 401, "Content not valid");

    const result = await chargeTransactionService(
      payment_type,
      transaction_details,
      customer_details,
      amount
    );

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      201,
      "Create transaction successfully",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
};

export const cancelSendInvoice = async (req: Request, res: Response) => {
  const {invoice_id} = req.params;
  try {
    if(!invoice_id || invoice_id === "") return errorResponse(res, 403, "Invalid order id");

    const result = await cancelSendInvoiceService(invoice_id);

    if(result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Cancel send invoice successfully", result.data)
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
}

export const cancelTransaction = async (req: Request, res: Response) => {
  const { invoice_id } = req.params;
  try {
    if (!invoice_id || typeof invoice_id != "string")
      return errorResponse(res, 401, "Content not valid");

    const result = await cancelTransactionService(invoice_id);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Cancel transaction successfully",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
};

export const statusTransaction = async (req: Request, res: Response) => {
  const { order_id } = req.params;
  try {
    if (!order_id || order_id === "")
      return errorResponse(res, 400, "Invalid order id");

    const result = await statusTransactionService(order_id);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Get status transaction successfully",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
};

export const notificationTransaction = async (req: Request, res: Response) => {
  const {
    invoice_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    payment_type,
    fraud_status,
  } = req.body;

  try {
    if (
      !invoice_id ||
      !status_code ||
      !gross_amount ||
      !signature_key ||
      !transaction_status ||
      !payment_type ||
      !fraud_status
    )
      return { error: true, status: 400, message: "Invalid content body" };

    const result = await notificationTransactionService({
      invoice_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      fraud_status,
    });

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Create notification successfully");
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
};
