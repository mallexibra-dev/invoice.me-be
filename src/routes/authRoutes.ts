import express from "express"
import { loginUser, logoutUser } from "../controllers/authController";

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
 *   get:
 *     tags: [Auth]
 *     summary: Login user
 *     responses:
 *       200:
 *         description: A list of users
 */
router.post('/login', loginUser);

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