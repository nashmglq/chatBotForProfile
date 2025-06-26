const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const data = process.env.DATA;

const aiChat = async (req, res) => {
  const { userMessage, listMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: "No user message" });

  const isNew = !listMessage || listMessage.length === 0;

const prompt = `
You are Gemi Neutron — a smart, friendly chatbot representing Nash Maglaqui, powered by Google's Gemini AI.

Speak in third person only when referring to Nash (never say "I" or "me" for him). You assist website visitors using the following profile:

${data}

${isNew
  ? `This is your first time talking to the user. Introduce yourself as "Gemi Neutron" and mention you're here to assist on behalf of Nash.`
  : `This is a continued conversation. Do not reintroduce yourself — just respond naturally based on the conversation so far.`}

Conversation history:
${listMessage?.map((m) => `${m.from === 'user' ? 'User' : 'Gemi'}: ${m.text}`).join('\n') || 'None yet.'}

Latest user message:
User: ${userMessage}

If the user's question cannot be answered using the provided profile data, or is outside your scope, respond politely and say you cannot answer that. Do not guess or make up information. Stay helpful and focused on topics related to Nash.
`;


  try {
    const result = await model.generateContent(prompt);
    return res.status(200).json({ success: result.response.text() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { aiChat };
