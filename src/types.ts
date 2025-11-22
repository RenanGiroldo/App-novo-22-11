export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVINGS = 'SAVINGS'
}

export enum Language {
  EN = 'EN',
  PT = 'PT'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  avatar?: string;
}

export interface FinancialContextType {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  transferToSavings: (amount: number) => boolean;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  netBalance: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  signup: (data: any) => void;
  logout: () => void;
}

export interface ThemeContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void; // Visual mostly
  isDark: boolean;
}