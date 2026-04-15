import axios from "axios";

export const askai = async (message) => {
    try {
        if (!message) {
            throw new Error("Message is required");
        }
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "openai/gpt-4o-mini",
            messages: [
                { role: "user", content: message }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const content = response?.data?.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error("No content received from AI");
        }

        return content;
    } catch (error) {
        console.log("AI Service Error:", error?.response?.data || error.message);
        throw error;
    }
}