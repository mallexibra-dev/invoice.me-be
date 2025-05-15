import logger from "../config/logging";
import prisma from "../config/prismaClient";
import supabase from "../config/supabaseClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";

export const createCompanyService = async (
  token: any,
  file: any,
  dataUser: any
): Promise<ServiceResponse> => {
  try {
    const { name, email, address, phone, brand_color, subscription_id } =
      dataUser;
    const { data } = await supabase.auth.getUser(token);
    const user = await prisma.user.findFirst({ where: { id: data.user?.id } });

    if (user?.company_id != null || user?.company_id != "")
      return {
        error: true,
        status: 500,
        message: "You already have a company.",
      };

    let logo = null;
    if (file != null) {
      const fileName = `logos/${Date.now()}-${file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("companies")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) {
        logger.error(`${uploadError.message}`);
        return { error: true, status: 500, message: uploadError.message };
      }

      logo = uploadData.path;
    }

    const company = await prisma.companies.create({
      data: {
        name,
        email,
        address,
        phone,
        brand_color,
        subscription_id,
        logo,
      },
    });

    return { error: false, data: company };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    return { error: true, status: 500, message: error.message };
  }
};

export const getCompanyServices = async (
  user_id: any
): Promise<ServiceResponse> => {
  try {
    const user = await prisma.user.findFirst({ where: { id: user_id } });

    if (!user) return { error: true, status: 404, message: "User not found" };

    const company = await prisma.companies.findFirst({
      where: { id: user?.company_id },
    });

    if (!company)
      return { error: true, status: 404, message: "Company not found" };

    return { error: false, data: company };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    return { error: true, status: 500, message: error.message };
  }
};

export const updateCompanyService = async (
  token: string,
  company_id: string,
  file: any,
  updateFields: any
): Promise<ServiceResponse> => {
  try {
    const { data } = await supabase.auth.getUser(token);
    const user = await prisma.user.findFirst({ where: { id: data.user?.id } });

    if (user?.company_id !== company_id)
      return {
        error: true,
        status: 500,
        message: "You do not have access to this company",
      };

    const company = await prisma.companies.findFirst({
      where: { id: company_id },
    });

    if (!company) {
      return { error: true, status: 404, message: "Company not found" };
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
        return { error: true, status: 500, message: "Failed to upload logo." };
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

    return { error: false, data: updatedCompany };
  } catch (error: any) {
    logger.error(`${error.message}`);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    return { error: true, status: 500, message: error.message };
  }
};

export const deleteCompanyService = async (
  company_id: string,
  token: string
): Promise<ServiceResponse> => {
  try {
    const users = await prisma.user.findMany({
      where: { company_id },
    });

    if (!users) return { error: true, status: 404, message: "Users not found" };

    const { data } = await supabase.auth.getUser(token);

    const user = data.user;
    const owner = users.find((u: any) => u.id === user?.id);

    if (!owner)
      return {
        error: true,
        status: 500,
        message: "You're not owner this company",
      };

    for (const user of users) {
      await supabase.auth.admin.deleteUser(user.id);
    }

    await prisma.user.deleteMany({ where: { company_id } });

    const company = await prisma.companies.findFirst({
      where: { id: company_id },
    });

    if (!company)
      return { error: true, status: 404, message: "Company not foung" };

    if (company?.logo) {
      await supabase.storage.from("companies").remove([company.logo]);
    }

    await prisma.companies.delete({ where: { id: company_id } });

    return { error: false, data: null };
  } catch (error: any) {
    logger.error(`${error.message}`);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };
    return { error: true, status: 500, message: error.message };
  }
};
