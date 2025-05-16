import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoice,
  getInvoices,
  updateInvoice,
} from "../controllers/invoiceController";
import { validateData } from "../middlewares/validationData";
import { invoiceSchema, updateInvoiceSchema } from "../schema/invoice";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management
 */

/**
 * @swagger
 * /invoices:
 *   post:
 *     tags: [Invoices]
 *     summary: Create a new invoice
 *     parameters:
 *       - in: query
 *         name: company_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID to associate with the invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - status
 *               - due_date
 *               - template_id
 *               - total
 *               - items
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Invoice 123"
 *               status:
 *                 type: string
 *                 enum:
 *                   - unpaid
 *                   - paid
 *                   - overdue
 *                 example: unpaid
 *               issue_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               notes:
 *                 type: string
 *                 example: "Invoice description"
 *               template_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               total:
 *                 type: integer
 *                 example: 1500000
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - unit_price
 *                     - quantity
 *                     - total
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "prod_01"
 *                     unit_price:
 *                       type: integer
 *                       example: 1500000
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     total:
 *                       type: number
 *                       example: 500
 *               reminders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     invoice_number:
 *                       type: string
 *                       example: "INV-001"
 *                     days_offset:
 *                       type: number
 *                       example: 3
 *                     channel:
 *                       type: string
 *                       enum:
 *                         - whatsapp
 *                         - email
 *                       example: whatsapp
 *                     message:
 *                       type: string
 *                       example: "hello"
 *                     is_sent:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Bad request, invalid input data
 *       500:
 *         description: Internal server error
 */
router.post("/", validateData(invoiceSchema), createInvoice);

/**
 * @swagger
 * /invoices:
 *   get:
 *     tags: [Invoices]
 *     summary: Get all invoices filtered by company_id
 *     parameters:
 *       - in: query
 *         name: company_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Filter invoices by company ID
 *     responses:
 *       200:
 *         description: List of invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "inv_01ABC123"
 *                   company_id:
 *                     type: string
 *                     example: "comp_01"
 *                   title:
 *                     type: string
 *                     example: "Invoice #123"
 *                   amount:
 *                     type: number
 *                     example: 1500
 *                   due_date:
 *                     type: string
 *                     format: date
 *                     example: "2025-06-01"
 *                   description:
 *                     type: string
 *                     example: "Invoice for design service"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-17T10:00:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-18T10:00:00Z"
 *       500:
 *         description: Internal server error
 */
router.get("/", getInvoices);

/**
 * @swagger
 * /invoices/{invoice_id}:
 *   get:
 *     tags: [Invoices]
 *     summary: Get an invoice by ID
 *     parameters:
 *       - in: path
 *         name: invoice_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "inv_01ABC123"
 *                 company_id:
 *                   type: string
 *                   example: "comp_01"
 *                 title:
 *                   type: string
 *                   example: "Invoice #123"
 *                 amount:
 *                   type: number
 *                   example: 1500
 *                 due_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-06-01"
 *                 description:
 *                   type: string
 *                   example: "Invoice description"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-17T10:00:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-18T10:00:00Z"
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */
router.get("/:invoice_id", getInvoice);

/**
 * @swagger
 * /invoices/{invoice_id}:
 *   patch:
 *     tags: [Invoices]
 *     summary: Update an invoice by ID
 *     parameters:
 *       - in: path
 *         name: invoice_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Invoice ID (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Invoice #123"
 *               status:
 *                 type: string
 *                 enum:
 *                   - unpaid
 *                   - paid
 *                   - overdue
 *                 example: unpaid
 *               issue_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-15"
 *               notes:
 *                 type: string
 *                 example: "Updated invoice details"
 *               template_id:
 *                 type: string
 *                 format: uuid
 *                 example: "1223-123123-1231"
 *               total:
 *                 type: integer
 *                 example: 1500000
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:invoice_id", validateData(updateInvoiceSchema), updateInvoice);

/**
 * @swagger
 * /invoices/{invoice_id}:
 *   delete:
 *     tags: [Invoices]
 *     summary: Delete an invoice by ID
 *     parameters:
 *       - in: path
 *         name: invoice_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:invoice_id", deleteInvoice);

export default router;