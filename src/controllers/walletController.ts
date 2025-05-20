import {
  createWalletService,
  updateWalletService,
  getWalletService,
  getWalletsService,
  deleteWalletService,
} from "../services/walletService";
import { successResponse, errorResponse } from "../utils/response";

export const createWallet = async (req: any, res: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const data = req.body;
  const logo = req.file;

  try {
    if (!token || token == "") return errorResponse(res, 401, "Unauthorized");

    const result = await createWalletService(token, data, logo);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 201, "Create wallet successfully", result.data);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateWallet = async (req: any, res: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const walletId = req.params.wallet_id;
  const data = req.body;
  const logo = req.file;

  try {
    if (!token || token == "") return errorResponse(res, 401, "Unauthorized");
    const result = await updateWalletService(token, walletId, data, logo);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Update wallet successfully", result.data);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const getWallet = async (req: any, res: any) => {
  const walletId = req.params.wallet_id;

  try {
    const result = await getWalletService(walletId);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Get wallet successfully", result.data);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const getWallets = async (req: any, res: any) => {
  try {
    const result = await getWalletsService();

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Get wallets successfully", result.data);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteWallet = async (req: any, res: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const walletId = req.params.wallet_id;

  try {
    if (!token || token == "") return errorResponse(res, 401, "Unauthorized");

    const result = await deleteWalletService(token, walletId);

    if (result.error) return errorResponse(res, result.status, result.message!);

    return successResponse(res, 200, "Delete wallet successfully", result.data);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};
