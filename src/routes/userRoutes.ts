import express from "express";
import { deleteUser, getAllData, registerUser, updateUser } from "../controllers/userController";
import multer from "multer";
import { validateData } from "../middlewares/validationData";
import { userSchema } from "../schema/users";

const router = express.Router();
const upload = multer();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Management Users
 */

/**
 * @swagger
 * /users/register:
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
router.post('/register', validateData(userSchema), registerUser);

/**
 * @swagger
 * /users/{user_id}:
 *   patch:
 *     tags: [User]
 *     summary: Update user by id
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mallexibra
 *               password:
 *                 type: string
 *                 example: malik-ganteng
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       500:
 *         description: Internal server error
 */

router.patch('/:user_id', upload.single('profile_image'), validateData(userSchema.omit({role: true, company_id: true}).partial()), updateUser);

/**
 * @swagger
 * /users/{user_id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete user by id
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User data updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.delete('/:user_id', deleteUser);

export default router;
