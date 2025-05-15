import type { NextFunction, Request, Response } from "express";
import { ZodError, type z } from "zod";
import { errorResponse } from "../utils/response";

export const validateData = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
            field: issue.path.join("."),
            message: issue.message
        }));

        return errorResponse(res, 400, errorMessages);
      } else {
        return errorResponse(res, 500, error.message);
      }
    }
  };
};
