import prisma from "../config/prismaClient"
import type { User } from "../types/User";

export const createUser = async (data: User) => {
    try {
        const user = await prisma.user.create({data});
        return user;
    } catch (error) {
        throw new Error("Error creating user");
    }
}

export const getAllUser = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error: any) {
        throw new Error("Error get data users");
    }
}