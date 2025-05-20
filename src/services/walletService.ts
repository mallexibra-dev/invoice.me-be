import logger from "../config/logging";
import prisma from "../config/prismaClient";
import supabase from "../config/supabaseClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const createWalletService = async (token: string, data: any, logo: any): Promise<ServiceResponse> => {
    try {
        const userLogin = await supabase.auth.getUser(token);
        const user = await prisma.user.findFirst({where: {id: userLogin.data.user?.id}});
        if(!user) return {error: true, status: 401, message: "You're not administrator"};

        if(logo) {
            const fileName = `icons/${Date.now()}-${logo.originalname}`;
            const {data, error} = await supabase.storage.from('assets').upload(fileName, logo.buffer, {
                contentType: logo.mimetype
            });

            if(error) return {error: true, status: 500, message: error.message};

            logo = data?.path;
        }

        const wallet = await prisma.wallet.create({data: {...data, logo: logo != null ? logo : undefined}});

        if(!wallet) return {error: true, status: 500, message: "Cannot create wallet"};

        return {error: false, data: wallet};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const updateWalletService = async(token: string, walletId: string, data: any, logo: any): Promise<ServiceResponse> => {
    try {
        const userLogin = await supabase.auth.getUser(token);
        const user = await prisma.user.findFirst({where: {id: userLogin.data.user?.id}});
        if(!user) return {error: true, status: 401, message: "You're not administrator"};

        const walletTemp = await prisma.wallet.findFirst({where: {id: walletId}});

        if(!walletTemp) return {error: true, status: 404, message: "Wallet not found"};

        
        if(logo) {
            if(walletTemp.logo){
                const {data, error} = await supabase.storage.from('assets').remove([walletTemp.logo]);
                if(error) return {error: true, status: 500, message: error.message};
            }
            const fileName = `icons/${Date.now()}-${logo.originalname}`;
            const {data, error} = await supabase.storage.from('assets').upload(fileName, logo.buffer, {
                contentType: logo.mimetype
            });

            if(error) return {error: true, status: 500, message: error.message};

            logo = data?.path;
        }

        const wallet = await prisma.wallet.create({data: {...data, logo: logo != null ? logo : undefined}});

        if(!wallet) return {error: true, status: 500, message: "Cannot create wallet"};

        return {error: false, data: wallet};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const getWalletService = async(walletId: string): Promise<ServiceResponse> => {
    try {
        const wallet = await prisma.wallet.findFirst({where: {id: walletId}});

        return {error: false, data: wallet}
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const getWalletsService = async(): Promise<ServiceResponse> => {
    try {
        const wallets = await prisma.wallet.findMany();

        return {error: false, data: wallets};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}

export const deleteWalletService = async(token: string, walletId: string): Promise<ServiceResponse> => {
    try {
        const userLogin = await supabase.auth.getUser(token);
        const user = await prisma.user.findFirst({where: {id: userLogin.data.user?.id}});
        if(!user) return {error: true, status: 401, message: "You're not administrator"};

        const wallet = await prisma.wallet.findFirst({where: {id: walletId}});

        if(!wallet) return {error: true, status: 404, message: "Wallet not found"};

        if(wallet.logo != null) {
            const {data, error} = await supabase.storage.from('assets').remove([wallet.logo]);

            if(error) return {error: true, status: 500, message: error.message};
        }

        await prisma.wallet.delete({where: {id: walletId}});

        return {error: false, data: null};
    } catch (error: any) {
        logger.error(error.message);
        const errorPrisma = prismaError(error);
        if(errorPrisma?.error) return {error: true, status: errorPrisma.statusCode, message: errorPrisma.message};

        return {error: true, status: 500, message: "Something wrong."};
    }
}