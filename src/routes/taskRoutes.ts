import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/taskController";
import { validateData } from "../middlewares/validationData";
import { taskSchema } from "../schema/task";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     parameters:
 *       - in: query
 *         name: company_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID associated with the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - unit_price
 *             properties:
 *               title:
 *                 type: string
 *                 example: Task A
 *               description:
 *                 type: string
 *                 example: Deskripsi singkat mengenai task
 *               unit_price:
 *                 type: number
 *                 example: 50000
 *     responses:
 *       201:
 *         description: Task created successfully
 *       500:
 *         description: Company id not valid or internal error
 */
router.post("/", validateData(taskSchema.omit({ company_id: true })), createTask);

/**
 * @swagger
 * /tasks/{task_id}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update an existing task
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Task A Updated
 *               description:
 *                 type: string
 *                 example: Updated description
 *               unit_price:
 *                 type: number
 *                 example: 75000
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       500:
 *         description: Task id not valid or internal error
 */
router.patch("/:task_id", validateData(taskSchema.omit({ company_id: true }).partial()), updateTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks by company_id
 *     parameters:
 *       - in: query
 *         name: company_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID to filter tasks
 *     responses:
 *       200:
 *         description: List of all tasks
 *       500:
 *         description: Company id not valid or internal error
 */
router.get("/", getTasks);

/**
 * @swagger
 * /tasks/{task_id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get a task by ID
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Task detail
 *       500:
 *         description: Task id not valid or internal error
 */
router.get("/:task_id", getTask);

/**
 * @swagger
 * /tasks/{task_id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task by ID
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       500:
 *         description: Task id not valid or internal error
 */
router.delete("/:task_id", deleteTask);

export default router;