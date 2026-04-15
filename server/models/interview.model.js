import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    interviewType: {
        type: String,
        required: true,
    },
    questionCount: {
        type: Number,
        default: 5,
    },
    resumeText: {
        type: String,
        default: "",
    },
    questions: {
        type: [String],
        default: [],
    },
    answers: {
        type: [String],
        default: [],
    },
    report: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    status: {
        type: String,
        enum: ["setup", "active", "complete"],
        default: "setup",
    },
}, { timestamps: true });

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
