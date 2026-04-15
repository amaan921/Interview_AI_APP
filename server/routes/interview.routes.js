import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { generateQuestions, evaluateAnswers, getInterviewHistory, getInterviewById } from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

// POST /api/interview/generate — generate AI questions (optional resume upload)
interviewRouter.post("/generate", isAuth, upload.single("resume"), generateQuestions);

// POST /api/interview/evaluate — evaluate answers and generate AI report
interviewRouter.post("/evaluate", isAuth, evaluateAnswers);

// GET /api/interview/history — fetch user's interview records
interviewRouter.get("/history", isAuth, getInterviewHistory);

// GET /api/interview/:id — fetch single interview (for viewing report)
interviewRouter.get("/:id", isAuth, getInterviewById);

export default interviewRouter;
