import express from "express";
import multer from "multer";
import { validateData } from "../middlewares/validationData";
import { updateWalletSchema, walletSchema } from "../schema/wallet";
import { createWallet, deleteWallet, getWallet, getWallets, updateWallet } from "../controllers/walletController";

const router = express.Router();
const upload = multer();

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Management Master Data Wallets
 */

/**
 * @swagger
 * /wallets:
 *   post:
 *     tags: [Wallet]
 *     summary: Create new wallet
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: BCA
 *               type:
 *                 type: string
 *                 enum: [bank, wallet]
 *                 example: bank
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", upload.single("logo"), validateData(walletSchema), createWallet);

/**
 * @swagger
 * /wallets/{wallet_id}:
 *   patch:
 *     tags: [Wallet]
 *     summary: Update wallet by ID
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wallet
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dana
 *               type:
 *                 type: string
 *                 enum: [bank, wallet]
 *                 example: wallet
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Wallet updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:wallet_id", upload.single("logo"), validateData(updateWalletSchema), updateWallet);

/**
 * @swagger
 * /wallets/{wallet_id}:
 *   get:
 *     tags: [Wallet]
 *     summary: Get wallet by ID
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wallet
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Internal server error
 */
router.get("/:wallet_id", getWallet);

/**
 * @swagger
 * /wallets:
 *   get:
 *     tags: [Wallet]
 *     summary: Get all wallets
 *     responses:
 *       200:
 *         description: List of wallets retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getWallets);

/**
 * @swagger
 * /wallets/{wallet_id}:
 *   delete:
 *     tags: [Wallet]
 *     summary: Delete wallet by ID
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the wallet
 *     responses:
 *       200:
 *         description: Wallet deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:wallet_id", deleteWallet);

export default router;