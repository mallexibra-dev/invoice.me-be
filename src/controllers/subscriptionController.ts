import type { Request, Response } from "express";
import logger from "../config/logging";
import { errorResponse, successResponse } from "../utils/response";
import { changeSubscriptionService } from "../services/subscriptionService";

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
    try{

    }catch(error: any){
        logger.error(error.message);

        return errorResponse(res, 500, "Something wrong.")
    }
}

export const cancelChangeSubscriptionController = async (req: Request, res: Response) => {
    try{

    }catch(error: any){
        logger.error(error.message);

        return errorResponse(res, 500, "Something wrong.")
    }
}

export const cancelTransactionChangeSubscriptionController = async (req: Request, res: Response) => {
    try{

    }catch(error: any){
        logger.error(error.message);

        return errorResponse(res, 500, "Something wrong.")
    }
}