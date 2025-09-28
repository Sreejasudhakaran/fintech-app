import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertExpenseSchema, loginSchema } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "default_key");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth endpoints
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);
      
      if (!user || user.password !== data.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Expenses endpoints
  app.get("/api/expenses", async (req, res) => {
    try {
      // In a real app, you'd get the user ID from the session/token
      // For now, we'll use a mock user ID or get it from query params
      const userId = req.query.userId as string || "mock-user-id";
      const expenses = await storage.getExpensesByUserId(userId);
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const data = insertExpenseSchema.parse(req.body);
      // In a real app, you'd get the user ID from the session/token
      const userId = req.query.userId as string || "mock-user-id";
      const expense = await storage.createExpense({ ...data, userId });
      res.json(expense);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // AI Advice endpoint
  app.post("/api/ai-advice", async (req, res) => {
    try {
      const { expenses } = req.body;
      
      if (!expenses || expenses.length === 0) {
        return res.status(400).json({ message: "No expenses provided" });
      }

      // Prepare expense data for AI analysis
      const expenseData = expenses.slice(0, 10).map((expense: any) => ({
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        note: expense.note || ''
      }));

      const prompt = `You are a financial advisor AI. Analyze expense data and provide practical, actionable saving tips.

Based on these recent expenses, provide 2 short saving tips in under 40 words each:
        
${JSON.stringify(expenseData, null, 2)}
        
Please respond in JSON format with an array of tips:
{
  "tips": ["tip1", "tip2"]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response, fallback to extracting tips from text
      let aiResponse;
      try {
        aiResponse = JSON.parse(text);
      } catch (parseError) {
        // If JSON parsing fails, extract tips from the text
        const tips = text.split('\n').filter(line => 
          line.trim().length > 0 && 
          !line.includes('{') && 
          !line.includes('}') &&
          line.trim().length < 100
        ).slice(0, 2);
        
        aiResponse = { tips: tips.length > 0 ? tips : ["Try tracking your expenses for a week to identify spending patterns.", "Consider setting a monthly budget for each category to better control your finances."] };
      }
      
      res.json(aiResponse);
    } catch (error: any) {
      console.error('AI Advice Error:', error);
      res.status(500).json({ 
        message: "Failed to get AI advice",
        tips: [
          "Try tracking your expenses for a week to identify spending patterns.",
          "Consider setting a monthly budget for each category to better control your finances."
        ]
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
