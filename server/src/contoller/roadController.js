const asyncHandler = require("express-async-handler");
const axios = require('axios');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//Create Post 
const getRoad = asyncHandler( async(req,res) =>{
    const { topic } = req.body;
    const prompt = `Can you give an outline or general roadmap for learning ${topic}?`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Generate content using the model
    const result = await model.generateContent(prompt);
    res.json({ roadmap: result.response.text() });

});
module.exports = {getRoad};