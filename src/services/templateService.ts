import logger from "../config/logging";
import prisma from "../config/prismaClient";
import supabase from "../config/supabaseClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const createTemplateService = async (token: string, company_id: any, data: any): Promise<ServiceResponse> => {
    try{
        const userLogin = await supabase.auth.getUser(token);
        const user = await prisma.user.findFirst({where: {id: userLogin.data.user?.id}});
        const template = await prisma.templates.create({data: {...data, user_id: user?.id, company_id}});

        return {error: false, data: template};
    }catch(error: any){
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong!"};
    }
}

export const updateTemplateService = async (templateId: string, data: any): Promise<ServiceResponse> => {
    try {
        const templateOld = await prisma.templates.findFirst({where: {id: templateId}});

        if(!templateOld) return {error: true, status: 404, message: "Template not found"};

        const templateNew = await prisma.templates.update({where: {id: templateId}, data});

        return {error: true, status: 200, message: "Update template successfully", data: templateNew};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong!"};
    }
}

export const getTemplateService = async(templateId: any): Promise<ServiceResponse> => {
    try {
        const template = await prisma.templates.findFirst({where: {id: templateId}});

        if(!template) return {error: true, status: 404, message: "Template not found"};

        return {error: false, data: template};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong!"};
    }
}

export const getTemplatesService = async(companyId: any): Promise<ServiceResponse> => {
    try {
        const templates = await prisma.templates.findMany({where: {company_id: companyId}});

        if(!templates || templates.length === 0) return {error: true, status: 404, message: "Templates not found"};

        return {error: false, data: templates};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong!"};
    }
}

export const deleteTemplatesService = async(templateId: any): Promise<ServiceResponse> => {
    try {
        const template = await prisma.templates.findFirst({where: {id: templateId}});

        if(!template) return {error: false, status: 404, message: "Template not found"};

        await prisma.templates.delete({where: {id: templateId}});

        return {error: false, data: null}
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong!"};
    }
}