import express from "express"
import { loginUser, logoutUser, validateToken } from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication users
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: mallexibra@gmail.com
 *               password:
 *                 type: string
 *                 example: admin-123
 *     responses:
 *       200:
 *         description: A list of users
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /validate-token:
 *   get:
 *     tags: [Auth]
 *     summary: Get data user
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/validate-token', validateToken);

/**
 * @swagger
 * /logout:
 *   get:
 *     tags: [Auth]
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/logout', logoutUser);

export default router;