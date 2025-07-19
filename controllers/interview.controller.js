import { PrismaClient } from "@prisma/client";
import { generateQuestions, evaluateAnswer } from "../services/googleGenAI.js";


const prisma = new PrismaClient();



export const startInterview = async (req, res) => {
  try {
    const { role, experience } = req.body;
  
    if (!role || !experience) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
  
    const user = await prisma.user.create({ 
      data: { name: "Anonymous", role, experience: Number(experience) } 
    });
  
    if (!user) {
      res.status(500).json({ error: "Failed to create new user" });
    }
  
  
    const session = await prisma.interviewSession.create({ 
      data: { userId: user.id } 
    });
  
    if (!session) {
      res.status(500).json({ error: "Failed to create new session" });
    }
  
  
    const questions = await generateQuestions(role, experience);

    if (questions.length === 0) {
      return res.status(500).json({ error: "Failed to generate questions" });
    }

    
    const questionRecords = await prisma.question.createMany({
      data: questions.map(q => ({ question: q, sessionId: session.id })),
    });
  
  
    const savedQuestions = await prisma.question.findMany({ 
      where: { sessionId: session.id } 
    });
  
  
  
    return res.status(200).json({
      session_id: session.id,
      questions: savedQuestions.map(q => ({ id: q.id, question: q.question })),
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    await prisma.$disconnect();
  }
};


export const submitAnswer = async (req, res) => {
  try {

    const { sessionId, questionId, answer } = req.body;

    if (!sessionId || !questionId || !answer) {
      return res.status(400).json({ error: "All fields are required" });
    }


    const answerRecord = await prisma.answer.create({ data: { sessionId, questionId, answer } });

    if (!answerRecord) {
      return res.status(500).json({ error: "Failed to save answer" });
    }



    return res.status(200).json({ status: "Answer submitted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    await prisma.$disconnect();
  }
};


export const evaluateInterview = async (req, res) => {
  try {
    
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }
  
    
    const answers = await prisma.answer.findMany({ where: { sessionId } });
    const questions = await prisma.question.findMany({ where: { sessionId } });


    if (answers.length === 0 || questions.length === 0) {
      return res.status(404).json({ error: "No answers or questions found for this session" });
    }

    if (answers.length !== questions.length) {
      return res.status(400).json({ error: "You have not answered all the questions" });
    }


    const evaluations = await Promise.all(
      answers.map(async (ans) => {
        const question = questions.find(q => q.id === ans.questionId);
        const result = await evaluateAnswer(question.question, ans.answer);
  
        const evaluation = await prisma.evaluation.create({
          data: {
            sessionId,
            questionId: ans.questionId,
            answerId: ans.id,
            score: result.score, 
            feedback: result.feedback 
          },
        });

        if (!evaluation) {
          return res.status(500).json({ error: "Failed to save evaluation" });
        }
  

        return {
          question_id: question.id,
          question: question.question,
          answer: ans.answer,
          score: result.score,
          feedback: result.feedback,
        };
      })
    );
  
    
    const overallScore = evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length;
  

    
    return res.json({
      session_id: sessionId,
      overall_score: parseFloat(overallScore.toFixed(1)),
      evaluations,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    await prisma.$disconnect();
  }
};