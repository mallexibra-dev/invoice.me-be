import type { Request, Response } from "express";
import { createClientService, deleteClientService, getAllClientService, getClientService, updateClientService } from "../services/clientService";
import { errorResponse, successResponse } from "../utils/response";

export const createClient = async(req: Request, res: Response) => {
    const client = req.body;
    const {company_id} = req.params;
    try {
        if(!company_id || company_id === "") return errorResponse(res, 404, "Invalid client id");

        const result = await createClientService(company_id, client)

        return successResponse(res, 500, "Create client successfully", result.data);
    } catch (error: any) {
        return errorResponse(res, 500, "Something wrong");
    }
}

export const getClient = async(req: Request, res: Response) => {
    const {client_id} = req.params;
    try {
        if(!client_id || client_id === "") return errorResponse(res, 404, "Invalid client id");

        const result = await getClientService(client_id);

        return successResponse(res, 200, "Get client successfully", result.data);
    } catch (error: any) {
        return errorResponse(res, 500, "Something wrong");
    }
}

export const getClients = async(req: Request, res: Response) => {
    const {company_id} = req.params;
    try {
        if(!company_id || company_id === "") return errorResponse(res, 404, "Invalid company id");

        const result = await getAllClientService(company_id);

        return successResponse(res, 200, "Get clients successfuly", result.data);
    } catch (error: any) {
        return errorResponse(res, 500, "Something wrong");
    }
}

export const updateClient = async(req: Request, res: Response) => {
    const {client_id} = req.params;
    const client = req.body;
    try {
        if(!client_id || client_id === "") return errorResponse(res, 404, "Invalid client id");

        const result = await updateClientService(client_id, client);

        return successResponse(res, 200, "Updated client successfully", result.data);
    } catch (error: any) {
        return errorResponse(res, 500, "Something wrong");
    }
}

export const deleteClient = async(req: Request, res: Response) => {
    const {client_id} = req.params;
    try {
        if(!client_id || client_id === "") return errorResponse(res, 404, "Invalid client id");

        await deleteClientService(client_id);

        return successResponse(res, 200, "Delete client successfully");
    } catch (error: any) {
        return errorResponse(res, 500, "Something wrong");
    }
}