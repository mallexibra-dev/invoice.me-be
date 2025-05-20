import { createUserService, createUserWithCompanyService, deleteUserService, getAllUserCompanyService, getUserCompanyService, updateUserService } from "../services/userServices";
import { errorResponse, successResponse } from "../utils/response";

export const registerUser = async (req: any, res: any)=>{
    const {name, email, password, role, company_id} = req.body;

    try {
        const result = await createUserService({name, email, password, role, company_id});

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 201, "Success create user", result.data);
    } catch (error: any) {
        return errorResponse(res, 500, error.message);
    }
}

export const registerUserWithCompany = async (req: any, res: any) => {
    const {user, company} = req.body;
    try {
        const result = await createUserWithCompanyService(user, company, company.subscription_id);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 201, "Success create company and user", result.data);
    } catch (error: any) {
        return errorResponse(res, 500, error.message);
    }
}

export const getAllData = async (req: any, res: any)=> {
    const {company_id} = req.params;
    try {
        if(company_id == null || typeof company_id !== "string") return errorResponse(res, 404, "Not valid company");

        const result = await getAllUserCompanyService(company_id);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 200, "Success get data users", result.data);
    } catch (error: any) {
        return errorResponse(res, 500, error.message);
    }
}

export const getData = async (req: any, res: any)=> {
    const {company_id} = req.query;
    const {user_id} = req.params;
    try {
        if(!company_id || typeof company_id !== "string") return errorResponse(res, 400, "Not valid company");

        if(!user_id || user_id == "") return errorResponse(res, 400, "Not valid id user");

        const result = await getUserCompanyService(company_id, user_id);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 200, "Success get data users", result.data);
    } catch (error: any) {
        return errorResponse(res, 500, error.message);
    }
}

export const updateUser = async (req: any, res: any) => {
    const {user_id} = req.params;
    const data = req.body;
    const profile_image = req.file;
    try {
        const result = await updateUserService(user_id, data, profile_image);

        if(result.error) return errorResponse(res, result.status, result.message!);

        return successResponse(res, 200, "Success update user by id", result.data);
    } catch (error: any) {
        return errorResponse(res, 500, error.message);
    }
}

export const deleteUser = async (req: any, res: any) => {
    const {user_id} = req.params;
    try {
        const result = await deleteUserService(user_id);

        if(result.error) return errorResponse(res, result.status, result.message!)

        return successResponse(res, 200, "Success delete user by id", result.data);
    } catch (error: any) {
        return errorResponse(res, 500, error.message);
    }
}