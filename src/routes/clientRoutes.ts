import express from "express";
import {
  createClient,
  deleteClient,
  getClient,
  getClients,
  updateClient,
} from "../controllers/clientController";
import { validateData } from "../middlewares/validationData";
import { clientSchema } from "../schema/clients";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management
 */

/**
 * @swagger
 * /clients:
 *   post:
 *     tags: [Clients]
 *     summary: Create a new client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_id
 *               - name
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               company_id:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               name:
 *                 type: string
 *                 example: PT Maju Mundur
 *               email:
 *                 type: string
 *                 example: client@example.com
 *               phone:
 *                 type: string
 *                 example: "081234567890"
 *               address:
 *                 type: string
 *                 example: Jl. Raya No. 1
 *               note:
 *                 type: string
 *                 example: Client VIP
 *     responses:
 *       201:
 *         description: Client created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateData(clientSchema), createClient);

/**
 * @swagger
 * /clients/{client_id}:
 *   patch:
 *     tags: [Clients]
 *     summary: Update an existing client
 *     parameters:
 *       - in: path
 *         name: client_id
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
 *                 example: PT Maju Mundur Updated
 *               email:
 *                 type: string
 *                 example: client-updated@example.com
 *               phone:
 *                 type: string
 *                 example: "081234567891"
 *               address:
 *                 type: string
 *                 example: Jl. Baru No. 99
 *               note:
 *                 type: string
 *                 example: Client updated note
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       400:
 *         description: Validation error
 */
router.patch('/:client_id', validateData(clientSchema.omit({ company_id: true }).partial()), updateClient);

/**
 * @swagger
 * /clients:
 *   get:
 *     tags: [Clients]
 *     summary: Get all clients
 *     responses:
 *       200:
 *         description: List of all clients
 */
router.get('/', getClients);

/**
 * @swagger
 * /clients/{client_id}:
 *   get:
 *     tags: [Clients]
 *     summary: Get a single client by ID
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client detail
 *       404:
 *         description: Client not found
 */
router.get('/:client_id', getClient);

/**
 * @swagger
 * /clients/{client_id}:
 *   delete:
 *     tags: [Clients]
 *     summary: Delete a client by ID
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 */
router.delete('/:client_id', deleteClient);

export default router;