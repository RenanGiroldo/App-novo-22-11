import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TransactionType } from "../types";
import * as XLSX from 'xlsx';

const getAIClient = () => {
  // Fix: Use process.env.API_KEY strictly as per coding guidelines.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Convert file to Base64
export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// Helper to clean JSON response from Markdown code blocks
const cleanJsonString = (str: string) => {
  if (!str) return "[]";
  // Remove ```json and ``` wrapping
  let cleaned = str.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  // Remove generic ``` wrapping
  cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  return cleaned;
};

// Schema for transaction extraction
const transactionSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
      description: { type: Type.STRING },
      amount: { type: Type.NUMBER, description: "Absolute positive value only" },
      category: { type: Type.STRING },
      type: { type: Type.STRING, enum: ["INCOME", "EXPENSE", "SAVINGS"] }
    },
    required: ["date", "description", "amount", "category", "type"]
  }
};

const EXTRACTION_PROMPT = `
  Act as a financial data extraction engine. Analyze the provided bank statement, receipt, or spreadsheet data.
  Extract individual financial transactions into a JSON array.

  CRITICAL RULES:
  1. **Values**: ALWAYS return the 'amount' as a POSITIVE number (Absolute Value). Do not use negative signs.
  2. **Ignore Totals**: IGNORE any line that represents a running balance, "Total", "Opening Balance", "Closing Balance", "Saldo Anterior", "Saldo Atual", "Visão Geral". ONLY extract specific transaction events.
  3. **Dates**: Convert dates to YYYY-MM-DD.
  4. **Currency**: 
     - Supports British Pounds (£), Brazilian Real (R$), Dollars ($).
     - Convert "1.200,50" (BR) -> 1200.50.
     - Convert "1,200.50" (UK/US) -> 1200.50.
     - Return ONLY the number.
  5. **Type Detection**:
     - **EXPENSE**: Outgoing money, purchases, debits, "D", red values, "Payment to", "Compra", "Saída".
     - **INCOME**: Incoming money, salary, credits, "C", green values, "Deposit", "Entrada", "Salário".
     - **SAVINGS**: Transfers to investment accounts, "Poupança", "ISA", "Vault", "CDB", "Reserva".
  6. **Category**: Infer a short 1-2 word category (e.g. 'Supermarket', 'Transport', 'Utilities').
`;

export const extractTransactionsFromMedia = async (file: File) => {
  const ai = getAIClient();
  const model = "gemini-2.5-flash"; // Efficient for extraction
  
  const filePart = await fileToGenerativePart(file);

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        role: "user",
        parts: [
          filePart,
          { text: EXTRACTION_PROMPT }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: transactionSchema
      }
    });

    const cleanedText = cleanJsonString(response.text || "[]");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error extracting transactions:", error);
    return [];
  }
};

export const extractTransactionsFromText = async (text: string) => {
  const ai = getAIClient();
  const model = "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        role: "user",
        parts: [{ text: `${EXTRACTION_PROMPT}\n\nDATA TO ANALYZE:\n${text}` }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: transactionSchema
      }
    });

    const cleanedText = cleanJsonString(response.text || "[]");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error parsing text:", error);
    return [];
  }
};

export const extractTransactionsFromExcel = async (file: File) => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to CSV to give the AI a structured text format
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    // Reuse the text extraction logic with the CSV data
    return extractTransactionsFromText(csv);
  } catch (error) {
    console.error("Error parsing Excel:", error);
    return [];
  }
};

export const getFinancialAdvice = async (summary: string) => {
  const ai = getAIClient();
  const model = "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        role: "user",
        parts: [{ text: `You are a financial advisor. Based on this transaction summary, give 3 short, actionable, and specific financial tips in a JSON array of strings. Focus on saving money and cutting unnecessary costs. The user uses Pounds (£) or Reais (R$). Summary: ${summary}` }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });

    const cleanedText = cleanJsonString(response.text || "[]");
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error getting advice:", error);
    return ["Track your daily expenses closely.", "Try to save at least 20% of your income.", "Review your subscriptions and cancel unused ones."];
  }
};