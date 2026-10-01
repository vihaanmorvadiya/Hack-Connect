import express from 'express'
import { createApplications, getAllapplications,acceptApplication,rejectApplication } from '../controllers/applicationController.js';

const router = express.Router();

router.get("/",getAllapplications)
router.post("/",createApplications)
router.patch("/:id/accept", acceptApplication);
router.patch("/:id/reject", rejectApplication);

export default router;