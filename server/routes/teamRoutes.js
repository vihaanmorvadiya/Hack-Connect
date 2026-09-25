import express from 'express'
import { createTeam, getAllTeams } from '../controllers/teamController.js';
const router = express.Router();

router.get("/",getAllTeams)
router.post("/",createTeam)

export default router;