import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import {
  cancelTransactionService,
  chargeTransactionService,
  notificationTransactionService,
  statusTransactionService,
} from "../services/transactionService";
import logger from "../config/logging";

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

export const cancelTransaction = async (req: Request, res: Response) => {
  const { order_id } = req.query;
  try {
    if (!order_id || typeof order_id != "string")
      return errorResponse(res, 401, "Content not valid");

    const result = await cancelTransactionService(order_id);

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
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    payment_type,
    fraud_status,
  } = req.body;

  try {
    if (
      !order_id ||
      !status_code ||
      !gross_amount ||
      !signature_key ||
      !transaction_status ||
      !payment_type ||
      !fraud_status
    )
      return { error: true, status: 400, message: "Invalid content body" };

    const result = await notificationTransactionService({
      order_id,
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
