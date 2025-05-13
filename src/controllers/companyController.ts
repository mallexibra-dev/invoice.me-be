import logger from "../config/logging";
import prisma from "../config/prismaClient";
import supabase from "../config/supabaseClient";
import { errorResponse, successResponse } from "../utils/response";

export const createCompany = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { name, email, address, phone, brand_color, subscription } = req.body;

    const file = req.file;

    if (!file) {
      return errorResponse(res, 400, "Logo file is required.");
    }

    const { data } = await supabase.auth.getUser(token);
    const user = await prisma.user.findFirst({ where: { id: data.user?.id } });

    if (user?.company_id != null || user?.company_id != "")
      return errorResponse(res, 500, "You already have a company");

    const fileName = `logos/${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("companies")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      logger.error(`${uploadError.message}`);
      return errorResponse(res, 500, "Failed to upload logo.");
    }

    const company = await prisma.companies.create({
      data: {
        name,
        email,
        address,
        phone,
        brand_color,
        subscription_id: subscription,
        logo: uploadData.path,
      },
    });

    if (!company) return errorResponse(res, 500, "Create company failed.");

    return successResponse(
      res,
      200,
      "Create data company successfully",
      company
    );
  } catch (error: any) {
    logger.error(`${error.message}`);
    return errorResponse(res, 500, "Something wrong.");
  }
};

export const getMyCompany = async (req: any, res: any) => {
  try {
    const { company_id } = req.query;

    if (!company_id || typeof company_id !== "string")
      return errorResponse(res, 400, "Invalid or missing ID Company");

    const company = await prisma.companies.findFirst({
      where: { id: company_id },
    });

    if (!company) return errorResponse(res, 404, "Company not found");

    return successResponse(res, 200, "Get data company successfully", company);
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

    const { data } = await supabase.auth.getUser(token);
    const user = await prisma.user.findFirst({ where: { id: data.user?.id } });

    if (user?.company_id !== company_id)
      return errorResponse(res, 500, "You do not have access to this company");

    const company = await prisma.companies.findFirst({
      where: { id: company_id },
    });

    if (!company) {
      return errorResponse(res, 404, "Company not found.");
    }

    if (file) {
      if (company.logo) {
        await supabase.storage.from("companies").remove([company.logo]);
      }

      const fileName = `logos/${Date.now()}-${file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("companies")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) {
        logger.error(uploadError.message);
        return errorResponse(res, 500, "Failed to upload logo.");
      }

      updateFields.logo = uploadData.path;
    }

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === undefined || updateFields[key] === null) &&
        delete updateFields[key]
    );

    const updatedCompany = await prisma.companies.update({
      where: { id: company_id },
      data: updateFields,
    });

    return successResponse(
      res,
      200,
      "Update company successfully",
      updatedCompany
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

    const users = await prisma.user.findMany({
      where: { company_id },
    });

    for (const user of users) {
      await supabase.auth.admin.deleteUser(user.id);
    }

    await prisma.user.deleteMany({ where: { company_id } });

    const company = await prisma.companies.findFirst({
      where: { id: company_id },
    });

    if (company?.logo) {
      await supabase.storage.from("companies").remove([company.logo]);
    }

    await prisma.companies.delete({ where: { id: company_id } });

    return successResponse(res, 200, "Delete company successfully");
  } catch (error: any) {
    console.log(error.message);
    return errorResponse(res, 500, "Something wrong.");
  }
};
