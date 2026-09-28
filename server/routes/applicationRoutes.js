import express from 'express'
import { createApplications, getAllapplications } from '../controllers/applicationController.js';

const router = express.Router();

router.get("/",getAllapplications)
router.post("/",createApplications)

export default router;