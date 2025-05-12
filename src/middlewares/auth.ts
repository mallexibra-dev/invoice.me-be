import supabase from "../config/supabaseClient";
import { errorResponse, successResponse } from "../utils/response";

const authMiddleware = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if(!token) return errorResponse(res, 401, "Unauthorized");

    const {data: {user}, error} = await supabase.auth.getUser(token);

    if(error || !user) return errorResponse(res, 401, "Invalid or expired token");

    req.user = user;

    next();
}

export default authMiddleware;