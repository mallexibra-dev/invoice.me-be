import type { Request, Response } from "express";
import { createTaskService, deleteTaskService, getTaskService, getTasksService, updateTaskService } from "../services/taskService";
import { errorResponse, successResponse } from "../utils/response";
import logger from "../config/logging";

export const createTask = async (req: Request, res: Response) => {
    const {company_id} = req.query;
    const data = req.body;
    try {
        if(!company_id || company_id === "") return errorResponse(res, 500, "Company id not valid.");

        const result = await createTaskService(company_id as string, data);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 201, "Create task successfully", result.data);
    } catch (error: any) {
        logger.error(error.message);
        return errorResponse(res, 500, "Something wrong.");
    }
}

export const updateTask = async (req: Request, res: Response) => {
    const {task_id} = req.params;
    const data = req.body;
    try {
        if(!task_id || task_id === "") return errorResponse(res, 500, "Task id not valid.");

        const result = await updateTaskService(task_id, data);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 200, "Update task successfully", result.data);
    } catch (error: any) {
        logger.error(error.message);
        return errorResponse(res, 500, "Something wrong.");
    }
}

export const getTask = async (req: Request, res: Response) => {
    const {task_id} = req.params;
    try {
        if(!task_id || task_id === "") return errorResponse(res, 500, "Task id not valid");

        const result = await getTaskService(task_id);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 200, "Get task successfully", result.data);
    } catch (error: any) {
        logger.error(error.message);
        return errorResponse(res, 500, "Something wrong.");
    }
}

export const getTasks = async (req: Request, res: Response) => {
    const {company_id} = req.query;
    try {
        if(!company_id || company_id === "") return errorResponse(res, 500, "Company id not valid");

        const result = await getTasksService(company_id as string);

        return successResponse(res, 200, "Get tasks successfully", result.data);
    } catch (error: any) {
        logger.error(error.message);
        return errorResponse(res, 500, "Something wrong.");
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    const {task_id} = req.params;
    try {
        if(!task_id || task_id === "") return errorResponse(res, 500, "Task id not valid");

        const result = await deleteTaskService(task_id);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 200, "Delete task successfully", result.data);
    } catch (error: any) {
        logger.error(error.message);
        return errorResponse(res, 500, "Something wrong.");
    }
}