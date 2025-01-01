const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create Post 
const getRoad = asyncHandler(async (req, res) => {
    const { topic } = req.body;

    // Check for required fields
    if (!topic) {
        return res.status(400).json({ message: "Topic is required." });
    }

    const prompt = `Can you give an outline or general roadmap for learning ${topic}?`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        // Generate content using the model
        const result = await model.generateContent(prompt);
        const roadmap = result.response.text();

        // Respond with the generated roadmap
        res.status(200).json({ roadmap });
    } catch (error) {
        console.error("Error generating roadmap:", error);
        res.status(500).json({ message: "An error occurred while generating the roadmap." });
    }
});

module.exports = { getRoad };
