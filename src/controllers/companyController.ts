import logger from "../config/logging";
import prisma from "../config/prismaClient";
import supabase from "../config/supabaseClient";
import { createCompanyService, deleteCompanyService, getCompanyServices, updateCompanyService } from "../services/companyServices";
import { errorResponse, successResponse } from "../utils/response";

export const createCompany = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const data = req.body;

    const file = req.file;

    if (!file) {
      return errorResponse(res, 400, "Logo file is required.");
    }

    const result = await createCompanyService(token, file, data);

    if(result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Create data company successfully",
      result.data
    );
  } catch (error: any) {
    logger.error(`${error.message}`);
    return errorResponse(res, 500, "Something wrong.");
  }
};

export const getMyCompany = async (req: any, res: any) => {
  try {
    const { user_id } = req.query;

    if (!user_id || typeof user_id !== "string")
      return errorResponse(res, 400, "Invalid or missing ID User");

    const result = await getCompanyServices(user_id)

    if (result.error) return errorResponse(res, 404, "Company not found");

    return successResponse(res, 200, "Get data company successfully", result.data);
  } catch (error) {
    return errorResponse(res, 500, "Something wrong.");
  }
};

export const updateCompany = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { company_id } = req.params;
    const file = req.file;
    const updateFields = req.body;

    if (!company_id || typeof company_id !== "string") {
      return errorResponse(res, 400, "Invalid or missing company_id.");
    }

    const result = await updateCompanyService(token, company_id, file, updateFields);

    return successResponse(
      res,
      200,
      "Update company successfully",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something went wrong.");
  }
};

export const deleteCompany = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { company_id } = req.params;

    if (!company_id || typeof company_id !== "string") {
      return errorResponse(res, 400, "Invalid or missing company_id.");
    }

    const result = await deleteCompanyService(company_id, token);

    if(result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Delete company successfully");
  } catch (error: any) {
    console.log(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
};
