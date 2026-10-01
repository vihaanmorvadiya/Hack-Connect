import express from 'express'
import { createTeam, getAllTeams, seeApplications } from '../controllers/teamController.js';
const router = express.Router();

router.get("/",getAllTeams)
router.post("/",createTeam)
router.get("/:id/applications",seeApplications)

export default router;