const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const data = process.env.DATA;

const aiChat = async (req, res) => {
  const { userMessage } = req.body;

  try {
    const prompt = `You are an intelligent chatbot representing Nash Maglaqui. 
    Your role is to assist visitors on Nash's website by answering their questions clearly, helpfully, and professionally using the following profile data:

    ${data}

    Speak in third person — you are not Nash. Make it clear you are answering on behalf of him. 
    For example, say "Nash is..." instead of "I am...". 

    If the data is not enough to answer the question confidently, politely say so and keep the tone friendly with a light joke to maintain a positive vibe.

    Here is the user’s message — answer it appropriately:
    ${userMessage}`;

    const result = await model.generateContent(prompt);

    return res.status(200).json({ success: result.response.text() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { aiChat };
