import express from "express";
import { cancelSendInvoice, cancelTransaction, chargeTransaction, notificationTransaction, sendTransactionController, statusTransaction } from "../controllers/transactionController";
import authMiddleware from "../middlewares/auth";
import { cancelChangeSubscriptionController, cancelTransactionChangeSubscriptionController, changeSubscriptionController, createChargeSubscriptionController } from "../controllers/subscriptionController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Payment gateway transaction
 */

/**
 * @swagger
 * /transactions/invoice/{invoice_id}/send:
 *   post:
 *     tags: [Transaction]
 *     summary: Send invoice to customer
 *     parameters:
 *       - in: path
 *         name: invoice_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Send transaction successfully
 */
router.post("/invoice/:invoice_id/send", authMiddleware, sendTransactionController);

/**
 * @swagger
 * /transactions/invoice/{invoice_id}/send-cancel:
 *   delete:
 *     tags: [Transaction]
 *     summary: Cancel invoice to customer
 *     parameters:
 *       - in: path
 *         name: invoice_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Send transaction successfully
 */
router.delete("/invoice/:invoice_id/send-cancel", authMiddleware, cancelSendInvoice);

/**
 * @swagger
 * /transactions/invoice/pay:
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
 *                   - invoice_id
 *                   - gross_amount
 *                 properties:
 *                   invoice_id:
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
router.post("/invoice/pay", chargeTransaction);

/**
 * @swagger
 * /transactions/webhook:
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
 *               - invoice_id
 *               - status_code
 *               - gross_amount
 *               - signature_key
 *               - transaction_status
 *               - payment_type
 *               - fraud_status
 *             properties:
 *               invoice_id:
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
router.post("/webhook", notificationTransaction);

/**
 * @swagger
 * /transactions/invoice/{invoice_id}/pay-cancel:
 *   delete:
 *     tags: [Transaction]
 *     summary: Cancel charge transaction
 *     parameters:
 *       - in: path
 *         name: invoice_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cancel transaction successfully
 */
router.delete("/invoice/:invoice_id/pay-cancel", cancelTransaction);

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

/**
 * @swagger
 * /transactions/change-request:
 *   post:
 *     summary: Request to change subscription plan
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: plan_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subscription plan to change to
 *     responses:
 *       200:
 *         description: Request change subscription successfully
 *       403:
 *         description: Invalid plan id or existing transaction found
 *       404:
 *         description: User, company, subscription, or plan not found
 *       500:
 *         description: Internal server error
 */
router.post("/subscription/change-request", authMiddleware, changeSubscriptionController);

/**
 * @swagger
 * /transactions/subscription/pay:
 *   post:
 *     summary: Create a payment transaction for subscription
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - company_id
 *               - payment_type
 *               - transaction_details
 *               - amount
 *             properties:
 *               order_id:
 *                 type: string
 *                 example: "ORD-20240523-001"
 *               company_id:
 *                 type: string
 *                 example: "company-123"
 *               payment_type:
 *                 type: string
 *                 example: "gopay"
 *               transaction_details:
 *                 type: object
 *                 required:
 *                   - order_id
 *                   - gross_amount
 *                 properties:
 *                   order_id:
 *                     type: string
 *                     example: "ORD-20240523-001"
 *                   gross_amount:
 *                     type: number
 *                     example: 100000
 *               amount:
 *                 type: object
 *                 required:
 *                   - net_amount
 *                   - fee
 *                 properties:
 *                   net_amount:
 *                     type: number
 *                     example: 95000
 *                   fee:
 *                     type: number
 *                     example: 5000
 *     responses:
 *       200:
 *         description: Create charge subscription successfully
 *       403:
 *         description: Amount doesn't match or body invalid
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.post("/subscription/pay", createChargeSubscriptionController);

/**
 * @swagger
 * /transactions/{subscription_id}/cancel-request:
 *   delete:
 *     summary: Cancel unpaid subscription change request
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: subscription_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subscription to cancel the request for
 *     responses:
 *       200:
 *         description: Cancel change subscription successfully
 *       403:
 *         description: Subscription id invalid
 *       406:
 *         description: Cannot cancel because transaction is pending
 *       500:
 *         description: Internal server error
 */
router.delete("/subscription/{subscription_id}/cancel-request", cancelChangeSubscriptionController);

/**
 * @swagger
 * /transactions/{subscription_id}/cancel-pay:
 *   delete:
 *     summary: Cancel pending payment transaction
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: subscription_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subscription to cancel the payment for
 *     responses:
 *       200:
 *         description: Cancel transaction successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */ 
router.delete("/subscription/{subscription_id}/cancel-pay", cancelTransactionChangeSubscriptionController);

export default router