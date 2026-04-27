import { generateAIResponse } from "../utils/openAi.js";

const chat = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ message: "OPENAI_API_KEY is not configured" });
    }

    const response = await generateAIResponse(prompt);
    return res.status(200).json({ reply: response });
  } catch (error) {
    return res.status(500).json({ message: "OpenAI request failed", error: error.message });
  }
};

export { chat };
