import logger from "../config/logging";
import prisma from "../config/prismaClient"
import supabase from "../config/supabaseClient";
import type { ServiceResponse } from "../types/serviceResponse";

export const createUserService = async (dataUser: any): Promise<ServiceResponse> => {
    try {
        const data = {...dataUser, password: dataUser.password}
        const signUp = await supabase.auth.signUp({
            email: data.email, password: data.password
        });

        if(signUp.error) return {error: true, status: 500, message: signUp.error.message};

        const user = await prisma.user.create({data});

        return {error: false, data: {...user, email: signUp.data.user?.email}};
    } catch (error: any) {
        logger.error(`${error.message}`);
        return {error: true, status: 500, message: error.message};
    }
}

export const createUserWithCompanyService = async (dataUser: any, dataCompany: any, plan_id: any): Promise<ServiceResponse> => {
    try {
        const subscription = await prisma.subscriptions.create({data: {plan_id}})

        if(!subscription) return {error: true, status: 500, message: "Cannot create subscription"};

        const company = await prisma.companies.create({data: {...dataCompany, subscription_id: subscription.id}});

        if(!company) return {error: true, status: 500, message: "Cannot create company"};

        const data = {...dataUser, password: dataUser.password, role: "owner"}
        const signUp = await supabase.auth.signUp({
            email: data.email, password: data.password
        });

        if(signUp.error) return {error: true, status: 500, message: signUp.error.message};

        const user = await prisma.user.create({data: {id: signUp.data.user?.id,  name: data.name, role: data.role, company_id: company.id}});

        if(!user) return {error: true, status: 500, message: "Cannot create user"};

        return {error: false, data: {company, user: {...user, email: signUp.data.user?.email}}};
    } catch (error: any) {
        logger.error(`${error.message}`);
        return {error: true, status: 500, message: error.message};
    }
}

export const getAllUserCompanyService = async (company_id: string): Promise<ServiceResponse> => {
    try {
        const users = await prisma.user.findMany({where: {company_id}});

        if(users.length === 0) return {error: true, status: 404, message: "Users not found"}

        return {error: false, data: users};
    } catch (error: any) {
        logger.error(`${error.message}`);
        return {error: true, status: 500, message: error.message};
    }
}