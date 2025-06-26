const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const data = process.env.DATA;

const aiChat = async (req, res) => {
  const { userMessage, listMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: "No user message" });

  const isNew = !listMessage || listMessage.length === 0;

  const prompt = `
You are Gemi Neutron — a friendly and intelligent chatbot created to represent Nash Maglaqui. You are powered by Google's Gemini AI.

Speak in third person — always refer to Nash as "Nash" and never say "I" or "me" when talking about him.

Your goal is to assist website visitors using the following profile data:
${data}

${isNew 
  ? `This is your first time talking to the user. Politely introduce yourself as "Gemi Neutron" and mention you're here to help on Nash's behalf.` 
  : `This is a continued conversation. Do not reintroduce yourself. Just respond naturally based on the user’s latest message and previous context.`}

Here is the full conversation history:
${listMessage?.map((m) => `${m.from === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n') || 'None'}

Latest user message:
${userMessage}

Respond to the user's message appropriately using Nash's profile data. 
If the user's message is unrelated to Nash's profile or beyond your scope, do **not** provide incorrect information. Instead, gently steer the conversation back by offering a light-hearted joke or fun fact and invite the user to ask something related to Nash.
`;

  try {
    const result = await model.generateContent(prompt);
    return res.status(200).json({ success: result.response.text() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { aiChat };
