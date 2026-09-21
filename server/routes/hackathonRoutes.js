import express from "express";
import { createHackathon, getAllHackathons } from "../controllers/hackathonController.js";
const router = express.Router();

router.get('/',getAllHackathons)
router.post('/',createHackathon)

export default router;