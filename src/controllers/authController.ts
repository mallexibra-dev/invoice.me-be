import supabase from "../config/supabaseClient";
import { errorResponse, successResponse } from "../utils/response";

export const loginUser = async (req: any, res: any) => {
    const {email, password} = req.body();
    try {
        if (!email || !password) return errorResponse(res, 400, "Email and Password must be filled in");

        const {data, error} = await supabase.auth.signInWithPassword({
            email, password
        });

        if(!data || !data.session) return errorResponse(res, 401, "Email or Password is wrong.");

        return successResponse(res, 200, "Login successfully!", {...data.user, access_token: data.session.access_token});
    } catch (error: any) {
        
    }
}

export const logoutUser = async (req: any, res: any) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if(!token) return errorResponse(res, 401, "Unauthorized");

    const {error} = await supabase.auth.signOut();

    if(error) return errorResponse(res, 500, "Logout failed.");

    return successResponse(res, 200, "Logout successfully!");
}