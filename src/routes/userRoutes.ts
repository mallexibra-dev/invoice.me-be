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
 *     responses:
 *       200:
 *         description: A list of users
 */
router.post("/", createData);

export default router;
