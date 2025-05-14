import express from "express"
import { loginUser, logoutUser, validateToken } from "../controllers/authController";
import { registerUserWithCompany } from "../controllers/userController";

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
 * /register/company:
 *   post:
 *     tags: [Auth]
 *     summary: Register user and company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - company
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - name
 *                   - role
 *                   - email
 *                   - password
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: malik
 *                   role:
 *                     type: string
 *                     example: admin
 *                   email:
 *                     type: string
 *                     example: malikganteng@gmail.com
 *                   password:
 *                     type: string
 *                     example: admin-123
 *               company:
 *                 type: object
 *                 required:
 *                   - name
 *                   - address
 *                   - phone
 *                   - email
 *                   - brand_color
 *                   - subscription_id
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: PT Malik Ganteng
 *                   address:
 *                     type: string
 *                     example: Jakarta
 *                   phone:
 *                     type: string
 *                     example: "08123456789"
 *                   email:
 *                     type: string
 *                     example: "ptmalikganteng@gmail.com"
 *                   brand_color:
 *                     type: string
 *                     example: "#FF5733"
 *                   subscription_id:
 *                     type: string
 *     responses:
 *       200:
 *         description: Successfully registered user and company
 */
router.post('/register/company', registerUserWithCompany);

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