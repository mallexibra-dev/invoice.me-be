import logger from "../config/logging";
import prisma from "../config/prismaClient";
import supabase from "../config/supabaseClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const createSubscriptionPlanService = async (token: string, data: any): Promise<ServiceResponse> => {
    try {
        const userLogin = await supabase.auth.getUser(token);
        const user = await prisma.user.findFirst({where: {id: userLogin.data.user?.id}});
        if(user?.role !== "administrator") return {error: true, status: 201, message: "You're not administrator!"};

        const subscription = await prisma.subscriptionPLan.create({data});

        return {error: false, data: subscription};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const updateSubscriptionPlanService = async (token: string, subscriptionId: any, data: any): Promise<ServiceResponse> => {
    try {
        const userLogin = await supabase.auth.getUser(token);
        const user = await prisma.user.findFirst({where: {id: userLogin.data.user?.id}});
        if(user?.role !== "administrator") return {error: true, status: 201, message: "You're not administrator!"};

        const subscription = await prisma.subscriptionPLan.update({where: {id: subscriptionId}, data});

        return {error: false, data: subscription};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const getSubscriptionPlanService = async (subscriptionId: string): Promise<ServiceResponse> =>{
    try {
        const subscription = await prisma.subscriptionPLan.findFirst({where: {id: subscriptionId}});

        if(!subscription) return {error: true, status: 404, message: "Subscription not found"};

        return {error: false, data: subscription};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const getSubscriptionPlansService = async (): Promise<ServiceResponse> => {
    try {
        const subscriptions = await prisma.subscriptionPLan.findMany();

        if(!subscriptions || subscriptions.length === 0) return {error: true, status: 404, message: "Subscriptions not found"};

        return {error: false, data: subscriptions};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const deleteSubscriptionPlanService = async (token: string, subscriptionId: any): Promise<ServiceResponse> => {
    try {
        const userLogin = await supabase.auth.getUser(token);
        const user = await prisma.user.findFirst({where: {id: userLogin.data.user?.id}});
        if(user?.role !== "administrator") return {error: true, status: 201, message: "You're not administrator!"};

        await prisma.subscriptionPLan.delete({where: {id: subscriptionId}});

        return {error: false, data: null};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}