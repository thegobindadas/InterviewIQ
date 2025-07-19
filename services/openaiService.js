import OpenAI from "openai";
import dotenv from "dotenv";


dotenv.config({});


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



export async function generateQuestions(role, experience) {

  try {
    const prompt = `Generate 5 mock interview questions for a ${role} with ${experience} years of experience.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });


    const text = completion.choices[0]?.message?.content || "";
    
    if (!text) {
      return [];
    }


    return text.split("\n").filter(line => line.trim()).map(q => q.replace(/^\d+\.\s*/, "").trim());

  } catch (error) {
    console.error("Error generating questions: ", error);
    return [];
  }
}


export async function evaluateAnswer(question, answer) {
  try {
    const prompt = `
      Evaluate this answer out of 10 (clarity, technical depth, relevance). Give short constructive feedback.
  
      Question: ${question}
      Answer: ${answer}
  
      Respond with:
      Score: <number out of 10>
      Feedback: <short constructive feedback>`;
  
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
  

    const content = completion.choices[0].message.content || "";
    const score = parseInt(content.match(/Score:\s*(\d+)/)?.[1] || "0", 10);
    const feedback = content.match(/Feedback:\s*(.+)/)?.[1]?.trim() || "No feedback.";
  


    return { score, feedback };

  } catch (error) {
    console.error("Error evaluating answer: ", error);
    return { score: 0, feedback: "No feedback." };
  }
}