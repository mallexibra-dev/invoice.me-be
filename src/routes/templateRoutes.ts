import express from "express";
import { validateData } from "../middlewares/validationData";
import {
  templateSchema,
  updateTemplateSchema,
} from "../schema/template";
import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  getTemplates,
  updateTemplate,
} from "../controllers/templateController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: Manage email templates
 */

/**
 * @swagger
 * /templates:
 *   post:
 *     tags: [Templates]
 *     summary: Create a new template
 *     parameters:
 *       - in: query
 *         name: company_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - content
 *               - is_default
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *                 description: HTML content
 *               is_default:
 *                 type: boolean
 *             example:
 *               name: Welcome Email
 *               content: "<h1>Welcome to Our Platform!</h1><p>Enjoy your stay</p>"
 *               is_default: false
 *     responses:
 *       201:
 *         description: Template created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", validateData(templateSchema), createTemplate);

/**
 * @swagger
 * /templates:
 *   get:
 *     tags: [Templates]
 *     summary: Get all templates
 *     parameters:
 *       - in: query
 *         name: company_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Templates fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Get templates successfully
 *               data:
 *                 - id: "tpl-123"
 *                   name: "Welcome Email"
 *                   content: "<h1>Hi</h1>"
 *                   is_default: false
 *       500:
 *         description: Server error
 */
router.get("/", getTemplates);

/**
 * @swagger
 * /templates/{template_id}:
 *   get:
 *     tags: [Templates]
 *     summary: Get a single template by ID
 *     parameters:
 *       - in: path
 *         name: template_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Get template successfully
 *               data:
 *                 id: "tpl-123"
 *                 name: "Welcome Email"
 *                 content: "<h1>Hi</h1>"
 *                 is_default: false
 *       500:
 *         description: Server error
 */
router.get("/:template_id", getTemplate);

/**
 * @swagger
 * /templates/{template_id}:
 *   patch:
 *     tags: [Templates]
 *     summary: Update a template
 *     parameters:
 *       - in: path
 *         name: template_id
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
 *               content:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *             example:
 *               name: Updated Template Name
 *               content: "<p>Updated HTML</p>"
 *               is_default: true
 *     responses:
 *       200:
 *         description: Template updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Update template successfully
 *               data:
 *                 id: "tpl-123"
 *                 name: "Updated Template Name"
 *                 content: "<p>Updated HTML</p>"
 *                 is_default: true
 *       500:
 *         description: Server error
 */
router.patch("/:template_id", validateData(updateTemplateSchema), updateTemplate);

/**
 * @swagger
 * /templates/{template_id}:
 *   delete:
 *     tags: [Templates]
 *     summary: Delete a template
 *     parameters:
 *       - in: path
 *         name: template_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Delete template successfully
 *       500:
 *         description: Server error
 */
router.delete("/:template_id", deleteTemplate);

export default router;