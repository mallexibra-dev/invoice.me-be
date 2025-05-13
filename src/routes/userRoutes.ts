import express from "express";
import { createData, getAllData } from "../controllers/userController";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get("/", getAllData);

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create data user
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: A list of users
 */
router.post("/", createData);

export default router;
