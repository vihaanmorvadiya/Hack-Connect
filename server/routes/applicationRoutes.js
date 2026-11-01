import express from 'express'
import { createApplications, getAllapplications,acceptApplication,rejectApplication, getMyApplications } from '../controllers/applicationController.js';

const router = express.Router();

router.get("/",getAllapplications)
router.post("/",createApplications)
router.patch("/:id/accept", acceptApplication);
router.patch("/:id/reject", rejectApplication);
router.get("/user/:userId",getMyApplications)

export default router;