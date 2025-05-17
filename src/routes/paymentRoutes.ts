import express from "express";
import {
  createPayment,
  deletePayment,
  getPayment,
  getPayments,
  updatePayment,
} from "../controllers/paymentController";
import { validateData } from "../middlewares/validationData";
import { paymentSchema, updatePaymentSchema } from "../schema/payment";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     tags: [Payments]
 *     summary: Create a new payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_id
 *               - wallet_id
 *               - account_name
 *               - account_number
 *               - is_default
 *             properties:
 *               company_id:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               wallet_id:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               account_name:
 *                 type: string
 *                 example: PT Contoh
 *               account_number:
 *                 type: string
 *                 example: 1234567890
 *               is_default:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateData(paymentSchema), createPayment);

/**
 * @swagger
 * /payments/{payment_id}:
 *   patch:
 *     tags: [Payments]
 *     summary: Update an existing payment
 *     parameters:
 *       - in: path
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: BCA Updated
 *               wallet_id:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               account_name:
 *                 type: string
 *                 example: PT Contoh Baru
 *               account_number:
 *                 type: string
 *                 example: 987654321
 *               is_default:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       400:
 *         description: Validation error
 */
router.patch('/:payment_id', validateData(updatePaymentSchema.partial()), updatePayment);

/**
 * @swagger
 * /payments:
 *   get:
 *     tags: [Payments]
 *     summary: Get all payments
 *     parameters:
 *       - in: query
 *         name: company_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all payments
 */
router.get('/', getPayments);

/**
 * @swagger
 * /payments/{payment_id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get a single payment by ID
 *     parameters:
 *       - in: path
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment detail
 *       404:
 *         description: Payment not found
 */
router.get('/:payment_id', getPayment);

/**
 * @swagger
 * /payments/{payment_id}:
 *   delete:
 *     tags: [Payments]
 *     summary: Delete a payment by ID
 *     parameters:
 *       - in: path
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       404:
 *         description: Payment not found
 */
router.delete('/:payment_id', deletePayment);

export default router;