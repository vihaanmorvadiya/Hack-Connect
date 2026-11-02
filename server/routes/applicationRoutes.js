import express from 'express'
import { createApplications, getAllapplications,acceptApplication,rejectApplication, getMyApplications, getTeamApplications } from '../controllers/applicationController.js';

const router = express.Router();

router.get("/",getAllapplications)
router.post("/",createApplications)
router.patch("/:id/accept", acceptApplication);
router.patch("/:id/reject", rejectApplication);
router.get("/user/:userId",getMyApplications)
router.get("/team/:teamId",getTeamApplications)

export default router