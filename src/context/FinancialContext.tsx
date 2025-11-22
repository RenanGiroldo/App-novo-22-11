import React, { createContext, useState, useContext, ReactNode, useMemo, PropsWithChildren } from 'react';
import { Transaction, TransactionType, FinancialContextType } from '../types';

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider = ({ children }: PropsWithChildren) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    // Security: Force amount to be a valid Positive Number
    // Remove currency symbols, maintain dot/comma logic, then take absolute value
    let cleanString = String(t.amount).replace(/[^0-9.,-]/g, "");
    
    // Replace comma with dot if it seems to be a decimal separator (Brazilian format check)
    if (cleanString.indexOf(',') > -1 && cleanString.indexOf('.') === -1) {
       cleanString = cleanString.replace(',', '.');
    } 
    // Handle "1.000,00" format -> remove the first dot
    else if (cleanString.indexOf(',') > -1 && cleanString.indexOf('.') > -1) {
       cleanString = cleanString.replace(/\./g, '').replace(',', '.');
    }

    const safeAmount = Math.abs(parseFloat(cleanString));
    
    const newTx = { 
      ...t, 
      amount: isNaN(safeAmount) ? 0 : safeAmount,
      id: Math.random().toString(36).substr(2, 9) 
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const transferToSavings = (amount: number): boolean => {
    if (amount <= 0) return false;
    
    // Helper for precision
    const fix = (n: number) => Number(n.toFixed(2));

    // Recalculate inside function to ensure latest state
    const currentIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const currentExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const currentSavings = transactions
      .filter(t => t.type === TransactionType.SAVINGS)
      .reduce((acc, t) => acc + Number(t.amount), 0);
      
    const liquidBalance = fix(currentIncome - currentExpenses - currentSavings);

    if (liquidBalance >= amount) {
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        description: 'Transfer to Savings',
        amount: amount,
        category: 'Savings',
        type: TransactionType.SAVINGS
      });
      return true;
    }
    return false;
  };

  const { totalIncome, totalExpenses, totalSavings, netBalance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    let saved = 0;

    transactions.forEach(t => {
      // Explicitly cast to Number and use Absolute Value to prevent sign errors
      const val = Math.abs(Number(t.amount)) || 0;
      
      if (t.type === TransactionType.INCOME) income += val;
      if (t.type === TransactionType.EXPENSE) expense += val;
      if (t.type === TransactionType.SAVINGS) saved += val;
    });

    // Fix floating point precision errors (e.g., 0.1 + 0.2 = 0.300000004)
    const fix = (n: number) => Number(n.toFixed(2));

    return {
      totalIncome: fix(income),
      totalExpenses: fix(expense),
      totalSavings: fix(saved),
      // Net Balance = Income - Expenses - Money moved to Savings
      netBalance: fix(income - expense - saved)
    };
  }, [transactions]);

  return (
    <FinancialContext.Provider value={{
      transactions,
      addTransaction,
      removeTransaction,
      transferToSavings,
      totalIncome,
      totalExpenses,
      totalSavings,
      netBalance
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) throw new Error('useFinancial must be used within FinancialProvider');
  return context;
};