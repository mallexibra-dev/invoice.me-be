import logger from "../config/logging";
import prisma from "../config/prismaClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const createTaskService = async (companyId: string, data: any): Promise <ServiceResponse> => {
    try {
        const task = await prisma.tasks.create({data: {...data, company_id: companyId}});

        return {error: false, data: task};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const updateTaskService = async (taskId: string, data: any): Promise<ServiceResponse> => {
    try {
        const task = await prisma.tasks.findFirst({where: {id: taskId}});

        if(!task) return {error: true, status: 404, message: "Task not found"};

        const taskUpdate = await prisma.tasks.update({where: {id: taskId}, data});

        return {error: false, data: taskUpdate};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong"};
    }
}

export const getTaskService = async (taskId: string): Promise <ServiceResponse> => {
    try {
        const task = await prisma.tasks.findFirst({where: {id: taskId}});

        if(!task) return {error: true, status: 404, message: "Task not found"};

        return {error: false, data: task};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong"};
    }
}

export const getTasksService = async (companyId: string): Promise<ServiceResponse> => {
    try {
        const tasks = await prisma.tasks.findMany({where: {company_id: companyId}});

        if(!tasks || tasks.length == 0) return {error: true, status: 404, message: "Task not found"};

        return {error: false, data: tasks};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong"};
    }
}

export const deleteTaskService = async (taskId: string): Promise<ServiceResponse> => {
    try {
        const task = await prisma.tasks.findFirst({where: {id: taskId}});

        if(!task) return {error: true, status: 404, message: "Task not found"};

        return {error: false, data: null};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: false, status: 500, message: "Something wrong"};
    }
}