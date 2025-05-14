import express from "express";
import { getAllData, registerUser } from "../controllers/userController";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: UManagement Users
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [User]
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *               - company_id
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: malik
 *               role:
 *                 type: string
 *                 example: admin
 *               company_id:
 *                 type: string
 *                 example: comp-1
 *               email:
 *                 type: string
 *                 example: malikganteng@gmail.com
 *               password:
 *                 type: string
 *                 example: admin-123
 *     responses:
 *       200:
 *         description: A list of user
 */
router.post('/register', registerUser);

export default router;
