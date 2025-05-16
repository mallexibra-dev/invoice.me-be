import type { Request, Response } from "express";
import {
  createPaymentService,
  deletePaymentService,
  getAllPaymentService,
  getPaymentService,
  updatePaymentService,
} from "../services/paymentServices";
import { errorResponse, successResponse } from "../utils/response";

export const createPayment = async (req: Request, res: Response) => {
  const payment = req.body;
  const { company_id } = req.params;
  try {
    if (!company_id || company_id === "")
      return errorResponse(res, 404, "Invalid company id");

    const result = await createPaymentService(company_id, payment);

    if(result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Create payment successfully",
      result.data
    );
  } catch (error: any) {
    return errorResponse(res, 500, "Something wrong");
  }
};

export const getPayment = async (req: Request, res: Response) => {
  const { payment_id } = req.params;
  try {
    if (!payment_id || payment_id === "")
      return errorResponse(res, 404, "Invalid payment id");

    const result = await getPaymentService(payment_id);

    if(result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Get payment successfully", result.data);
  } catch (error: any) {
    return errorResponse(res, 500, "Something wrong");
  }
};

export const getPayments = async (req: Request, res: Response) => {
  const { company_id } = req.params;
  try {
    if (!company_id || company_id === "")
      return errorResponse(res, 404, "Invalid company id");

    const result = await getAllPaymentService(company_id);

    if(result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Get payments successfully", result.data);
  } catch (error: any) {
    return errorResponse(res, 500, "Something wrong");
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  const { payment_id } = req.params;
  const payment = req.body;
  try {
    if (!payment_id || payment_id === "")
      return errorResponse(res, 404, "Invalid payment id");

    const result = await updatePaymentService(payment_id, payment);

    if(result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Updated payment successfully",
      result.data
    );
  } catch (error: any) {
    return errorResponse(res, 500, "Something wrong");
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  const { payment_id } = req.params;
  try {
    if (!payment_id || payment_id === "")
      return errorResponse(res, 404, "Invalid payment id");

    const result = await deletePaymentService(payment_id);

    if(result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Delete payment successfully");
  } catch (error: any) {
    return errorResponse(res, 500, "Something wrong");
  }
};
