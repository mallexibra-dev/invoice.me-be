import express from "express";
import { createData, getAllData } from "../controllers/userController";

const router = express.Router();

router.get('/', getAllData)
router.post('/', createData);

export default router;