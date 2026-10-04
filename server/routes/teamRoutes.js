import express from 'express'
import { createTeam, getAllTeams, getTeamById, seeApplications } from '../controllers/teamController.js';
const router = express.Router();

router.get("/",getAllTeams)
router.post("/",createTeam)
router.get("/:id/applications",seeApplications)
router.get("/:id",getTeamById)

export default router;