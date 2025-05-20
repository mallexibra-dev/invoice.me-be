import express from "express";
import { validateData } from "../middlewares/validationData";
import {
  subscriptionPlanSchema,
  updateSubscriptionPlanSchema,
} from "../schema/plan";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan,
} from "../controllers/subscriptionPlanController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: SubscriptionPlan
 *     description: Management Master Data Subscription Plans
 */
/**
 * @swagger
 * /subscription-plans:
 *   post:
 *     tags: [SubscriptionPlan]
 *     summary: Create a new subscription plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - max_users
 *               - max_invoices
 *               - whatsapp_reminder
 *               - export_excel
 *               - auto_reminder
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               max_users:
 *                 type: number
 *               max_invoices:
 *                 type: number
 *               whatsapp_reminder:
 *                 type: number
 *               export_excel:
 *                 type: boolean
 *               auto_reminder:
 *                 type: boolean
 *             example:
 *               name: "Basic Plan"
 *               price: 100000
 *               max_users: 10
 *               max_invoices: 50
 *               whatsapp_reminder: 3
 *               export_excel: true
 *               auto_reminder: false
 *     responses:
 *       200:
 *         description: Subscription plan created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post("/", validateData(subscriptionPlanSchema), createSubscriptionPlan);

/**
 * @swagger
 * /subscription-plans/{plan_id}:
 *   patch:
 *     tags: [SubscriptionPlan]
 *     summary: Update a subscription plan by ID
 *     parameters:
 *       - in: path
 *         name: plan_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subscription plan to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               max_users:
 *                 type: number
 *               max_invoices:
 *                 type: number
 *               whatsapp_reminder:
 *                 type: number
 *               export_excel:
 *                 type: boolean
 *               auto_reminder:
 *                 type: boolean
 *             example:
 *               name: "Pro Plan"
 *               price: 250000
 *               max_users: 50
 *               max_invoices: 200
 *               whatsapp_reminder: 10
 *               export_excel: true
 *               auto_reminder: true
 *     responses:
 *       200:
 *         description: Subscription plan updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:plan_id",
  validateData(updateSubscriptionPlanSchema),
  updateSubscriptionPlan
);

/**
 * @swagger
 * /subscription-plans/{plan_id}:
 *   get:
 *     tags: [SubscriptionPlan]
 *     summary: Get a subscription plan by ID
 *     parameters:
 *       - in: path
 *         name: plan_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subscription plan to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved subscription plan
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Internal server error
 */
router.get("/:plan_id", getSubscriptionPlan);

/**
 * @swagger
 * /subscription-plans:
 *   get:
 *     tags: [SubscriptionPlan]
 *     summary: Get all subscription plans
 *     responses:
 *       200:
 *         description: Successfully retrieved all subscription plans
 *       500:
 *         description: Internal server error
 */
router.get("/", getSubscriptionPlans);

/**
 * @swagger
 * /subscription-plans/{plan_id}:
 *   delete:
 *     tags: [SubscriptionPlan]
 *     summary: Delete a subscription plan by query `plan_id`
 *     parameters:
 *       - in: path
 *         name: plan_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subscription plan to delete
 *     responses:
 *       200:
 *         description: Subscription plan deleted successfully
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/:plan_id", deleteSubscriptionPlan);

export default router;
