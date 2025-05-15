import logger from "../config/logging";
import prisma from "../config/prismaClient"
import supabase from "../config/supabaseClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const createUserService = async (dataUser: any): Promise<ServiceResponse> => {
    try {
        const data = {...dataUser, password: dataUser.password}
        const signUp = await supabase.auth.signUp({
            email: data.email, password: data.password
        });

        if(signUp.error) return {error: true, status: 500, message: signUp.error.message};

        const user = await prisma.user.create({data: {name: data.name, company_id: data.company_id, role: data.role}});

        return {error: false, data: {...user, email: signUp.data.user?.email}};
    } catch (error: any) {
        logger.error(`${error.message}`);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};
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
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};
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
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};
        return {error: true, status: 500, message: error.message};
    }
}

export const updateUserService = async (id_user: string, dataUser: any, profile_image: any): Promise<ServiceResponse> => {
    try {
        const {name, password} = dataUser;
        const userTemp = await prisma.user.findFirst({where: {id: id_user}});
        if(userTemp?.profile_image != null) {
            const {data, error} = await supabase.storage.from('profiles').remove([userTemp?.profile_image]);
            
          if (error) return {error: true, status: 500, message: error.message};
        }else if(profile_image){
            const fileName = `users-profile/${Date.now()}-${profile_image.originalname}`;
            const {data, error} = await supabase.storage.from('profiles').upload(fileName, profile_image.buffer, {
                contentType: profile_image.mimetype,
              });
            
            if(error) return {error: true, status: 500, message: error.message};
            profile_image = data?.path
        }
        
        const {data, error} = await supabase.auth.updateUser({password})
        
        if(error) return {error: true, status: 500, message: error.code};

        const user = await prisma.user.update({where: {id: id_user}, data: {name: name || undefined, profile_image: profile_image || undefined}});

        if(!user) return {error: true, status: 500, message: "Cannot update user by id"};

        return {error: false, data: user};
    } catch (error: any) {
        logger.error(`${error.message}`);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};
        return {error: true, status: 500, message: error.message};
    }
}

export const deleteUserService = async (id_user: string): Promise<ServiceResponse> => {
    try {
        const user = await prisma.user.findFirst({where: {id: id_user}});

        if(!user) return {error: true, status: 404, message: "User not found"};

        
        if(user.role == "owner") return {error: true, status: 500, message: "Cannot delete owner account"};
        
        if(user?.profile_image != null) {
            const {data, error} = await supabase.storage.from('profiles').remove([user?.profile_image]);
            
          if (error) return {error: true, status: 500, message: error.message};
        }
        
        await prisma.user.delete({where: {id: id_user}});

        return {error: false, data: null};
    } catch (error: any) {
        logger.error(`${error.message}`);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};
        return {error: true, status: 500, message: error.message};
    }
}