import { type User, type InsertUser, type Expense, type InsertExpense } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getExpensesByUserId(userId: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense & { userId: string }): Promise<Expense>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private expenses: Map<string, Expense>;

  constructor() {
    this.users = new Map();
    this.expenses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getUserByEmail(insertUser.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getExpensesByUserId(userId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter((expense) => expense.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createExpense(insertExpense: InsertExpense & { userId: string }): Promise<Expense> {
    const id = randomUUID();
    const expense: Expense = {
      ...insertExpense,
      id,
      createdAt: new Date()
    };
    this.expenses.set(id, expense);
    return expense;
  }
}

export const storage = new MemStorage();
