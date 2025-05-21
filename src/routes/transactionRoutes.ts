import express from "express";
import { cancelTransaction, chargeTransaction, notificationTransaction, statusTransaction } from "../controllers/transactionController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Payment gateway transaction
 */

/**
 * @swagger
 * /transactions/create:
 *   post:
 *     tags: [Transaction]
 *     summary: Create charge transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_type
 *               - transaction_details
 *               - customer_details
 *             properties:
 *               payment_type:
 *                 type: object
 *                 example: gopay
 *               transaction_details:
 *                 type: object
 *                 required:
 *                   - order_id
 *                   - gross_amount
 *                 properties:
 *                   order_id:
 *                     type: string
 *                     example: INV-100
 *                   gross_amount:
 *                     type: int
 *                     example: 120000
 *               customer_details:
 *                 type: object
 *                 required:
 *                   - name
 *                   - email
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Malik Ibrahim
 *                   email:
 *                     type: string
 *                     example: "malikganteng@gmail.com"
 *               amount:
 *                 type: object
 *                 required:
 *                   - net_amount
 *                   - fe
 *                 properties:
 *                   net_amount:
 *                     type: int
 *                     example: 100000
 *                   fee:
 *                     type: int
 *                     example: 20000
 *     responses:
 *       200:
 *         description: Create transaction successfully
 */
router.post("/create", chargeTransaction);

/**
 * @swagger
 * /transactions/notifications:
 *   post:
 *     tags: [Transaction]
 *     summary: Create transaction notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - status_code
 *               - gross_amount
 *               - signature_key
 *               - transaction_status
 *               - payment_type
 *               - fraud_status
 *             properties:
 *               order_id:
 *                 type: string
 *                 example: 65d26bbd-c473-41df-aa5b-a5773ac9d020
 *               status_code:
 *                 type: string
 *                 example: 201
 *               gross_amount:
 *                 type: string
 *                 example: 120000.00
 *               signature_key:
 *                 type: string
 *                 example: 3bba688c65702690f3eaaafb4238ed383bf36c93286d12f46920b3d9ab144f2521a486481645e98b288eef1a6ab996d71554dd11058205ede66740b1b0432763
 *               transaction_status:
 *                 type: string
 *                 example: pending
 *               payment_type:
 *                 type: string
 *                 example: gopay
 *               fraud_status:
 *                 type: string
 *                 example: accept
 *     responses:
 *       200:
 *         description: Create transaction successfully
 */
router.post("/notifications", notificationTransaction);

/**
 * @swagger
 * /transactions/cancel:
 *   post:
 *     tags: [Transaction]
 *     summary: Cancel charge transaction
 *     parameters:
 *       - in: query
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cancel transaction successfully
 */
router.post("/cancel", cancelTransaction);

/**
 * @swagger
 * /transactions/status/{order_id}:
 *   get:
 *     tags: [Transaction]
 *     summary: Get a transaction status
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Get transaction status successfully
 */
router.get("/status/:order_id", statusTransaction);

export default router