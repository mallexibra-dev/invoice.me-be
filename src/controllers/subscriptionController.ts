import type { Request, Response } from "express";
import logger from "../config/logging";
import { errorResponse, successResponse } from "../utils/response";
import { cancelChangeSubscriptionService, cancelTransactionChangeSubscriptionService, changeSubscriptionService, createChargeSubscriptionService } from "../services/subscriptionService";

export const changeSubscriptionController = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const {plan_id} = req.query; 
    try{
        if(!plan_id || typeof plan_id !== "string") return errorResponse(res, 403, "Invalid plan id");

        const result = await changeSubscriptionService(token!, plan_id);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 200, "Request change subscription successfully", result.data);
    }catch(error: any){
        logger.error(error.message);

        return errorResponse(res, 500, "Something wrong.")
    }
}

export const createChargeSubscriptionController = async (req: Request, res: Response) => {
    const {order_id, company_id, payment_type, transaction_details, amount} = req.body;
    try{
        if(!order_id || !company_id || !payment_type || !transaction_details || !amount) return errorResponse(res, 403, "Invalid body content");

        const result = await createChargeSubscriptionService(order_id, company_id, payment_type, transaction_details, amount);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 200, "Create charge subscription successfully", result.data);
    }catch(error: any){
        logger.error(error.message);

        return errorResponse(res, 500, "Something wrong.")
    }
}

export const cancelChangeSubscriptionController = async (req: Request, res: Response) => {
    const {subscription_id} = req.params;
    try{
        if(!subscription_id || subscription_id === "") return errorResponse(res, 403, "Invalid subscription id");

        const result = await cancelChangeSubscriptionService(subscription_id);

        if(result.error) errorResponse(res, result.status, result.message!);

        return successResponse(res, 200, "Cancel change subscription successfully", result.data);
    }catch(error: any){
        logger.error(error.message);

        return errorResponse(res, 500, "Something wrong.")
    }
}

export const cancelTransactionChangeSubscriptionController = async (req: Request, res: Response) => {
    const {subscription_id} = req.params;
    try{
        if(!subscription_id || subscription_id === "") return errorResponse(res, 403, "Invalid subscription id");

        const result = await cancelTransactionChangeSubscriptionService(subscription_id);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 200, "Cancel transaction successfully", result.data);
    }catch(error: any){
        logger.error(error.message);

        return errorResponse(res, 500, "Something wrong.")
    }
}