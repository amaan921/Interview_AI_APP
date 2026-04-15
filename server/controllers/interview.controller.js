import fs from "fs";
import Interview from "../models/interview.model.js";
import User from "../models/User.js";
import { askai } from "../services/openRouter.Services.js";

const CREDITS_PER_INTERVIEW = 10;

// Helper: extract text from PDF buffer using pdfjs-dist
async function extractPdfText(filepath) {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const fileBuffer = fs.readFileSync(filepath);
    const uint8Array = new Uint8Array(fileBuffer);
    const pdfDoc = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    let text = "";
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        text += pageText + "\n";
    }
    return text.trim();
}

// ─── POST /api/interview/generate ──────────────────────────────────────────
export const generateQuestions = async (req, res) => {
    try {
        const { role, experience, interviewType, questionCount } = req.body;
        const count = parseInt(questionCount) || 5;

        // Parse resume if uploaded
        let resumeText = "";
        if (req.file) {
            try {
                resumeText = await extractPdfText(req.file.path);
                fs.unlinkSync(req.file.path); // cleanup
            } catch (err) {
                console.error("PDF parse error:", err.message);
            }
        }

        // Must have either resume OR manual form data
        if (!resumeText && (!role || !experience || !interviewType)) {
            return res.status(400).json({ message: "Please upload a resume or fill in role, experience, and interview type." });
        }

        // Check and deduct credits
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.credits < CREDITS_PER_INTERVIEW) {
            return res.status(402).json({ message: `Insufficient credits. You need ${CREDITS_PER_INTERVIEW} credits to start an interview. You have ${user.credits} credits.` });
        }

        // Build AI prompt based on mode
        let prompt;

        if (resumeText) {
            // Resume mode — AI extracts everything from the resume
            prompt = `You are a professional technical interviewer. A candidate has uploaded their resume. Here is the extracted text:

---
${resumeText}
---

Based on this resume, do the following:
1. Identify the candidate's role, experience level, and key skills/projects
2. Generate exactly ${count} interview questions tailored to their background, skills, projects, and experience level mentioned in the resume
3. Mix technical questions about their listed technologies with behavioral and project-specific questions

IMPORTANT: Return ONLY a valid JSON object with this exact structure:
{"role": "<detected role>", "experience": "<detected level>", "interviewType": "Resume-Based", "questions": ["Question 1?", "Question 2?"]}`;
        } else {
            // Manual mode — use form data
            prompt = `You are a professional technical interviewer. Generate exactly ${count} interview questions for a ${experience}-level ${role} position. The interview type is: ${interviewType}.

IMPORTANT: Return ONLY a valid JSON array of strings. No markdown, no explanation. Example format:
["Question 1?", "Question 2?", "Question 3?"]`;
        }

        const aiResponse = await askai(prompt);

        // Parse the AI response
        let questions, detectedRole, detectedExperience, detectedType;

        try {
            if (resumeText) {
                // Resume mode — expect a JSON object
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    questions = parsed.questions;
                    detectedRole = parsed.role || "Software Developer";
                    detectedExperience = parsed.experience || "Mid";
                    detectedType = parsed.interviewType || "Resume-Based";
                } else {
                    throw new Error("No JSON object found");
                }
            } else {
                // Manual mode — expect a JSON array
                const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    questions = JSON.parse(jsonMatch[0]);
                    detectedRole = role;
                    detectedExperience = experience;
                    detectedType = interviewType;
                } else {
                    throw new Error("No JSON array found");
                }
            }
        } catch (parseErr) {
            console.error("Failed to parse AI questions:", parseErr.message);
            console.error("Raw AI response:", aiResponse);
            return res.status(500).json({ message: "Failed to generate questions. Please try again." });
        }

        questions = questions.slice(0, count);

        // Save interview to DB
        const interview = new Interview({
            userId: req.userId,
            role: detectedRole,
            experience: detectedExperience,
            interviewType: detectedType,
            questionCount: questions.length,
            resumeText: resumeText ? resumeText.substring(0, 5000) : "",
            questions,
            status: "active",
        });

        await interview.save();

        // Deduct credits and update user
        user.credits -= CREDITS_PER_INTERVIEW;
        await user.save();

        return res.status(200).json({
            message: "Questions generated successfully",
            interviewId: interview._id,
            questions: interview.questions,
            role: detectedRole,
            experience: detectedExperience,
            interviewType: detectedType,
            credits: user.credits,
        });

    } catch (error) {
        console.error("generateQuestions error:", error);
        return res.status(500).json({ message: "Failed to generate questions." });
    }
};

// POST /api/interview/evaluate
export const evaluateAnswers = async (req, res) => {
    try {
        const { interviewId, answers } = req.body;

        if (!interviewId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: "Interview ID and answers array are required." });
        }

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: "Interview not found." });
        }

        if (interview.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized." });
        }

        // Build Q&A pairs for evaluation
        const qaPairs = interview.questions.map((q, i) => ({
            question: q,
            answer: answers[i] || "(No answer provided)"
        }));

        const prompt = `You are a professional interview evaluator. Evaluate the following interview answers for a ${interview.experience}-level ${interview.role} position (${interview.interviewType} interview).

Here are the questions and answers:
${qaPairs.map((qa, i) => `\nQ${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`).join("\n")}

Provide a detailed evaluation. Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "questionFeedback": [
    {"questionIndex": 0, "rating": "<good/average/poor>", "feedback": "<specific feedback for this answer>"},
    {"questionIndex": 1, "rating": "<good/average/poor>", "feedback": "<specific feedback for this answer>"}
  ]
}

Be honest and constructive. Score should reflect actual quality — short or irrelevant answers should score low. Rate each answer individually.`;

        const aiResponse = await askai(prompt);

        let report;
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                report = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON object found");
            }
        } catch (parseErr) {
            console.error("Failed to parse AI report:", parseErr.message);
            console.error("Raw AI response:", aiResponse);
            return res.status(500).json({ message: "Failed to evaluate answers. Please try again." });
        }

        // Save to DB
        interview.answers = answers;
        interview.report = report;
        interview.status = "complete";
        await interview.save();

        return res.status(200).json({
            message: "Evaluation complete",
            report,
        });

    } catch (error) {
        console.error("evaluateAnswers error:", error);
        return res.status(500).json({ message: "Failed to evaluate answers." });
    }
};

// GET /api/interview/history
export const getInterviewHistory = async (req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .select("-resumeText -questions -answers -report")
            .lean();

        return res.status(200).json({ interviews });
    } catch (error) {
        console.error("getInterviewHistory error:", error);
        return res.status(500).json({ message: "Failed to fetch interview history." });
    }
};

// ─── GET /api/interview/:id ──────────────────────────────────────────────
export const getInterviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await Interview.findById(id);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found." });
        }
        if (interview.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized to view this interview." });
        }

        return res.status(200).json({ interview });
    } catch (error) {
        console.error("getInterviewById error:", error);
        return res.status(500).json({ message: "Failed to fetch interview." });
    }
};