import express from 'express'
import { createApplications, getAllapplications,acceptApplication } from '../controllers/applicationController.js';

const router = express.Router();

router.get("/",getAllapplications)
router.post("/",createApplications)
router.patch("/:id/accept", acceptApplication);

export default router;