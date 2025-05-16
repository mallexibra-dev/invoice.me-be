import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import {
  createTemplateService,
  deleteTemplatesService,
  getTemplateService,
  getTemplatesService,
  updateTemplateService,
} from "../services/templateService";
import logger from "../config/logging";

export const createTemplate = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { company_id } = req.query;
  const data = req.body;
  try {
    if (!company_id) return errorResponse(res, 500, "Company id not valid");
    if (!token) return errorResponse(res, 201, "Unauthorized");

    const result = await createTemplateService(token, company_id, data);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 201, "Create template successfully");
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  const { template_id } = req.params;
  const data = req.body;
  try {
    if (!template_id) return errorResponse(res, 500, "Template id not valid");

    const result = await updateTemplateService(template_id, data);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(
      res,
      200,
      "Update template successfully",
      result.data
    );
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
};

export const getTemplate = async (req: Request, res: Response) => {
  const { template_id } = req.query;
  try {
    if (!template_id) return errorResponse(res, 500, "Template id not valid");

    const result = await getTemplateService(template_id);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Get template successfully", result.data);
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
};

export const getTemplates = async (req: Request, res: Response) => {
  const { company_id } = req.query;
  try {
    if (!company_id) return errorResponse(res, 500, "Template id not valid");

    const result = await getTemplatesService(company_id);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Get templates successfully", result.data);
  } catch (error: any) {
    logger.error(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
    const { template_id } = req.query;
    try {
      if (!template_id) return errorResponse(res, 500, "Template id not valid");
  
      const result = await deleteTemplatesService(template_id);
  
      if (result.error) return errorResponse(res, result.status, result.message!);
  
      return successResponse(res, 200, "Delete template successfully", result.data);
    } catch (error: any) {
      logger.error(error.message);
      return errorResponse(res, 500, "Something wrong.");
    }
  };
  