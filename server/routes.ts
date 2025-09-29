import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertExpenseSchema, loginSchema } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function registerRoutes(app: Express): Promise<Server> {
  // ---------- Auth endpoints ----------
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

  // ---------- Expenses endpoints ----------
  app.get("/api/expenses", async (req, res) => {
    try {
      const userId = (req.query.userId as string) || "mock-user-id";
      const expenses = await storage.getExpensesByUserId(userId);
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const data = insertExpenseSchema.parse(req.body);
      const userId = (req.query.userId as string) || "mock-user-id";
      const expense = await storage.createExpense({ ...data, userId });
      res.json(expense);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ---------- AI Advice endpoint ----------
app.post("/api/ai-advice", async (req, res) => {
  try {
    const expenses = req.body.expenses; // expects array of expenses
    if (!expenses || expenses.length === 0) {
      return res.status(400).json({ message: "Expenses data required" });
    }

    const prompt = `You are a financial advisor AI. 
Analyze the following expense data and provide 2 short saving tips in under 40 words each.

Expenses:
${JSON.stringify(expenses, null, 2)}

Respond with ONLY valid JSON. 
Do NOT add markdown, code fences, or explanations.

Format:
{
  "tips": ["tip1", "tip2"]
}`;

    const result = await model.generateContent(prompt);
    let raw = result.response.text();

    // Clean output (remove ```json and ``` if model still adds them)
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    let aiResponse;
    try {
      aiResponse = JSON.parse(raw);
    } catch (err) {
      console.warn("JSON parse failed. Raw text:", raw);

      // fallback: try extracting lines
      const tips = raw
        .split("\n")
        .map((line) => line.trim().replace(/^[-*•]\s*/, "")) // clean bullets
        .filter(
          (line) =>
            line.length > 0 &&
            !line.includes("{") &&
            !line.includes("}") &&
            line.length < 100
        )
        .slice(0, 2);

      aiResponse = {
        tips:
          tips.length > 0
            ? tips
            : [
                "Track your expenses weekly to identify spending leaks.",
                "Set a monthly budget per category to stay disciplined.",
              ],
      };
    }

    res.json(aiResponse);
  } catch (error: any) {
    console.error("AI Advice Error:", error);
    res.status(500).json({
      message: "Failed to get AI advice",
      tips: [
        "Track your expenses weekly to identify spending leaks.",
        "Set a monthly budget per category to stay disciplined.",
      ],
    });
  }
});

const httpServer = createServer(app);
return httpServer;
}