import { createUserService, createUserWithCompanyService, getAllUserCompanyService } from "../services/userServices";
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

        const users = await getAllUserCompanyService(company_id)

        return successResponse(res, 200, "Success get data users", users);
    } catch (error: any) {
        return errorResponse(res, 500, error.message);
    }
}