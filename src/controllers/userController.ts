import * as userModel from "../models/userModel";
import { errorResponse, successResponse } from "../utils/response";

export const createData = async (req: any, res: any)=>{
    const {name, email} = req.body;

    try {
        const user = await userModel.createUser({
            name, email,
            id: 0,
            company_id: 0,
            password: ""
        })

        return successResponse(res, 201, "Success create user", user);
    } catch (error: any) {
        return errorResponse(res, 500, "Error create user");
    }
}

export const getAllData = async (req: any, res: any)=> {
    try {
        const users = await userModel.getAllUser();

        return successResponse(res, 200, "Success get data users", users);
    } catch (error: any) {
        return errorResponse(res, 500, error.message);
    }
}