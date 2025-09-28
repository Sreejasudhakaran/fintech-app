import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertExpenseSchema, loginSchema } from "@shared/schema";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

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

      const prompt = `
        Based on these recent expenses, provide 2 short saving tips in under 40 words each:
        
        ${JSON.stringify(expenseData, null, 2)}
        
        Please respond in JSON format with an array of tips:
        {
          "tips": ["tip1", "tip2"]
        }
      `;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a financial advisor AI. Analyze expense data and provide practical, actionable saving tips in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || '{"tips": []}');
      
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
