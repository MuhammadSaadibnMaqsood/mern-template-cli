import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// A helper function for the user to call anywhere
const generateAIResponse = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  // #region agent log
  fetch('http://127.0.0.1:7505/ingest/ecd13297-541e-4abf-8993-df10bd5bd0af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'06cae8'},body:JSON.stringify({sessionId:'06cae8',runId:'pre-fix',hypothesisId:'H3',location:'backend/utils/openAi.js:13',message:'OpenAI response shape',data:{hasChoices:Array.isArray(response?.choices),firstChoiceHasMessage:Boolean(response?.choices?.[0]?.message),legacyPathExists:Boolean(response?.choices?.message?.content)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return response.choices.message.content;
};

export { generateAIResponse };
