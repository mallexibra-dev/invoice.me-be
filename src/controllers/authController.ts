import prisma from "../config/prismaClient";
import supabase from "../config/supabaseClient";
import { errorResponse, successResponse } from "../utils/response";

export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return errorResponse(res, 400, "Email and Password must be filled in");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!data || !data.session)
      return errorResponse(
        res,
        401,
        error?.message || "Email or Password is wrong."
      );

      const user = await prisma.user.findFirst({where: {id: data.user.id}});

    return successResponse(res, 200, "Login successfully!", {
      ...user, email: data.user.email,
      access_token: data.session.access_token,
    });
  } catch (error: any) {
    return errorResponse(res, 500, "Something wrong!");
  }
};

export const validateToken = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) return errorResponse(res, 401, "Unauthorized");

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    const me = await prisma.user.findFirst({ where: { id: user?.id } });

    if (!user || !me) return errorResponse(res, 404, "User not found.");

    return successResponse(res, 200, "User found", {
      ...me,
      email: user.email,
    });
  } catch (error: any) {
    return errorResponse(res, 500, "Something wrong!");
  }
};

export const logoutUser = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) return errorResponse(res, 401, "Unauthorized");

    const { error } = await supabase.auth.signOut(token);

    if (error) return errorResponse(res, 500, "Logout failed.");

    return successResponse(res, 200, "Logout successfully!");
  } catch (error) {
    return errorResponse(res, 500, "Something wrong!");
  }
};
