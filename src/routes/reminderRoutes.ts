import express from "express";
import {
  deleteReminderSchedule,
  getReminderSchedules,
  updateReminderSchedule,
} from "../controllers/reminderController";
import { validateData } from "../middlewares/validationData";
import { updateReminderSchema } from "../schema/invoice";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: ReminderSchedules
 *     description: Manage reminder schedules
 */

/**
 * @swagger
 * /reminder-schedules:
 *   get:
 *     tags: [ReminderSchedules]
 *     summary: Get all reminder schedules
 *     parameters:
 *       - in: query
 *         name: invoice_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Filter reminder schedules by invoice ID
 *     responses:
 *       200:
 *         description: List of reminder schedules
 *       500:
 *         description: Internal server error
 */
router.get("/", getReminderSchedules);

/**
 * @swagger
 * /reminder-schedules/{reminder_id}:
 *   patch:
 *     tags: [ReminderSchedules]
 *     summary: Update a reminder schedule by ID
 *     parameters:
 *       - in: path
 *         name: reminder_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reminder schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [before_due, on_due, after_due]
 *               days_offset:
 *                 type: integer
 *               channel:
 *                 type: string
 *                 enum: [whatsapp, email]
 *               message:
 *                 type: string
 *               is_sent:
 *                 type: boolean
 *           example:
 *             type: "before_due"
 *             days_offset: 3
 *             channel: "whatsapp"
 *             message: "Jangan lupa bayar invoice kamu ya!"
 *             is_sent: false
 *     responses:
 *       200:
 *         description: Reminder schedule updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Reminder schedule not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:reminder_id",
  validateData(updateReminderSchema),
  updateReminderSchedule
);

/**
 * @swagger
 * /reminder-schedules/{reminder_id}:
 *   delete:
 *     tags: [ReminderSchedules]
 *     summary: Delete a reminder schedule by ID
 *     parameters:
 *       - in: path
 *         name: reminder_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reminder schedule ID
 *     responses:
 *       200:
 *         description: Reminder schedule deleted successfully
 *       404:
 *         description: Reminder schedule not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:reminder_id", deleteReminderSchedule);

export default router;