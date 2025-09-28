import { apiRequest } from "./queryClient";

export interface AIAdviceResponse {
  tips: string[];
}

export const getAIAdvice = async (expenses: any[]): Promise<AIAdviceResponse> => {
  const response = await apiRequest('POST', '/api/ai-advice', {
    expenses: expenses.slice(0, 10) // Last 10 expenses
  });
  
  return await response.json();
};
