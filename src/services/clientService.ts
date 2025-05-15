import logger from "../config/logging";
import prisma from "../config/prismaClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const createClientService = async (companyId: string, data: any): Promise<ServiceResponse> => {
    try {
        const client = await prisma.clients.create({data: {...data ,company_id: companyId}});

        return {error: false, data: client}
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const updateClientService = async (clientId: string, data: any): Promise<ServiceResponse> => {
    try{
        const clientTemp = await prisma.clients.findFirst({where: {id: clientId}});

        if(!clientTemp) return {error: true, status: 404, message: "Client not found"};

        const client = await prisma.clients.update({where: {id: clientId}, data});

        return {error: false, data: client};
    }catch (error: any){
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const getAllClientService = async (companyId: string): Promise<ServiceResponse> => {
    try {
        const clients = await prisma.clients.findMany({where: {company_id: companyId}});

        return {error: false, data: clients};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: errorPrisma?.statusCode, message: "Something wrong."};
    }
}

export const getClientService = async (clientId: string): Promise<ServiceResponse> => {
    try {
        const client = await prisma.clients.findFirst({where: {id: clientId}});

        return {error: false, status: 200, message: "Get data client successfully", data: client};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong"};
    }
}

export const deleteClientService = async (clientId: string): Promise<ServiceResponse> => {
    try {
        const invoiceClient = await prisma.invoices.findFirst({where: {id: clientId}});

        if(invoiceClient) return {error: true, status: 500, message: "Cannot remove client because invoces available"};

        await prisma.clients.delete({where: {id: clientId}});

        return {error: false, data: null};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}