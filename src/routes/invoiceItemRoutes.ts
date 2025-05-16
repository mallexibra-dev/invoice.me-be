import express from "express";
import {
  deleteInvoiceItem,
  getInvoiceItems,
  updateInvoiceItem,
} from "../controllers/invoiceItemController";
import { validateData } from "../middlewares/validationData";
import { updateInvoiceItemSchema } from "../schema/invoice";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: InvoiceItems
 *     description: Manage invoice items
 */

/**
 * @swagger
 * /invoice-items:
 *   get:
 *     tags: [InvoiceItems]
 *     summary: Get all invoice items
 *     parameters:
 *       - in: query
 *         name: invoice_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Filter invoice items by invoice ID
 *     responses:
 *       200:
 *         description: List of invoice items
 *       500:
 *         description: Internal server error
 */
router.get("/", getInvoiceItems);

/**
 * @swagger
 * /invoice-items/{item_id}:
 *   patch:
 *     tags: [InvoiceItems]
 *     summary: Update an invoice item by ID
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               unit_price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               total:
 *                 type: number
 *           example:
 *             title: "Jasa Pembuatan Website"
 *             unit_price: 1500000
 *             quantity: 2
 *             total: 3000000
 *     responses:
 *       200:
 *         description: Invoice item updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Invoice item not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:item_id",
  validateData(updateInvoiceItemSchema),
  updateInvoiceItem
);

/**
 * @swagger
 * /invoice-items/{item_id}:
 *   delete:
 *     tags: [InvoiceItems]
 *     summary: Delete an invoice item by ID
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice item ID
 *     responses:
 *       200:
 *         description: Invoice item deleted successfully
 *       404:
 *         description: Invoice item not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:item_id", deleteInvoiceItem);

export default router;