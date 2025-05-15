import express from "express";
import multer from "multer";
import {
  createCompany,
  deleteCompany,
  getMyCompany,
  updateCompany,
} from "../controllers/companyController";
import { validateData } from "../middlewares/validationData";
import { companySchema } from "../schema/company";

const router = express.Router();
const upload = multer();

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Management data company
 */

/**
 * @swagger
 * /companies/my:
 *   get:
 *     tags: [Company]
 *     summary: Get company by ID User
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Company data fetched successfully
 *       400:
 *         description: Invalid or missing user_id
 *       404:
 *         description: Company not found
 *       500:
 *         description: Server error
 */

router.get("/my", getMyCompany);

/**
 * @swagger
 * /companies/{company_id}:
 *   patch:
 *     tags: [Company]
 *     summary: Update company
 *     parameters:
 *       - in: path
 *         name: company_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the company to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               brand_color:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               subscription_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Company not found
 *       500:
 *         description: Server error
 */

router.patch("/:company_id", upload.single("logo"), validateData(companySchema.partial()), updateCompany);

/**
 * @swagger
 * /companies/{company_id}:
 *   delete:
 *     tags: [Company]
 *     summary: Delete company
 *     parameters:
 *       - in: path
 *         name: company_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the company to delete
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 *       500:
 *         description: Server error
 */

router.delete("/:company_id", deleteCompany);

export default router;
