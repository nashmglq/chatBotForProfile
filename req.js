const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const data = process.env.DATA;

const aiChat = async (req, res) => {
  const { userMessage } = req.body;

  try {
    const prompt = `You are an intelligent and friendly chatbot representing Nash Maglaqui.
Your role is to assist visitors on Nash's website by responding to their questions clearly, helpfully, and professionally using the following profile data:

${data}

Always speak in the third person — do not refer to yourself as Nash. For example, say "Nash is..." instead of "I am...".

You can respond to simple greetings or casual messages. If the question is beyond the scope of the provided data, politely explain that the information isn't available, and steer the conversation back in a light-hearted way — such as by sharing a fun fact or a short joke to keep the mood upbeat.

Here is the user’s message — respond appropriately:
${userMessage}`;

    const result = await model.generateContent(prompt);

    return res.status(200).json({ success: result.response.text() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { aiChat };
