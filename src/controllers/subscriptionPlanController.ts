import type { Request, Response } from "express";
import logger from "../config/logging";
import { errorResponse, successResponse } from "../utils/response";
import { createSubscriptionPlanService, deleteSubscriptionPlanService, getSubscriptionPlanService, getSubscriptionPlansService, updateSubscriptionPlanService } from "../services/subscriptionPlanService";

export const createSubscriptionPlan = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const data = req.body;
    try {
        if(!token) return errorResponse(res, 401, "Unauthorized");

        const result = await createSubscriptionPlanService(token, data);

        if(result.error) return errorResponse(res, result.status, result.message!);
        
        return successResponse(res, 200, "Create subscription plan successfully", result.data);
    } catch (error: any) {
        logger.error(error.message);
        return errorResponse(res, 500, "Something wrong.");
    }
}

export const updateSubscriptionPlan = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const {plan_id} = req.params;
    const data = req.body;
    try {
        if(!token) return errorResponse(res, 401, "Unauthorized");

        if(!plan_id || plan_id === "") return errorResponse(res, 400, "Invalid plan id");
        
        const result = await updateSubscriptionPlanService(token, plan_id, data);

        if(result.error) return errorResponse(res, result.status, result.message!);
        
        return successResponse(res, 200, "Update subscription plan successfully", result.data);
    } catch (error: any) {
        logger.error(error.message);
        return errorResponse(res, 500, "Something wrong.");
    }
}

export const getSubscriptionPlan = async (req: Request, res: Response) => {
    const {plan_id} = req.params;
    try {
        if(!plan_id || plan_id === "") return errorResponse(res, 400, "Invalid plan id");
        
        const result = await getSubscriptionPlanService(plan_id)

        if(result.error) return errorResponse(res, result.status, result.message!);
        
        return successResponse(res, 200, "Get subscription plan successfully", result.data);
    } catch (error: any) {
        logger.error(error.message);
        return errorResponse(res, 500, "Something wrong.");
    }
}

export const getSubscriptionPlans = async (req: Request, res: Response) => {
    try {
        const result = await getSubscriptionPlansService();

        if(result.error) return errorResponse(res, result.status, result.message!);
        
        return successResponse(res, 200, "Get subscription plans successfully", result.data);
    } catch (error: any) {
        logger.error(error.message);
        return errorResponse(res, 500, "Something wrong.");
    }
}

export const deleteSubscriptionPlan = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const {plan_id} = req.params;
    try {
        if(!token) return errorResponse(res, 401, "Unauthorized");
        
        const result = await deleteSubscriptionPlanService(token, plan_id);

        if(result.error) return errorResponse(res, result.status, result.message!);
        
        return successResponse(res, 200, "Delete subscription plan successfully", result.data);
    } catch (error: any) {
        logger.error(error.message);
        return errorResponse(res, 500, "Something wrong.");
    }
}