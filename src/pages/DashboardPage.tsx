import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { translations } from '../utils/translations';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TransactionType } from '../types';
import { extractTransactionsFromMedia, extractTransactionsFromText, extractTransactionsFromExcel, getFinancialAdvice } from '../services/geminiService';
import { Input } from '../components/Input';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { Upload, Type as TypeIcon, Plus, ArrowRight, Wallet, TrendingDown, TrendingUp, PiggyBank, Bot, AlertCircle, FileSpreadsheet } from 'lucide-react';

export const DashboardPage: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { transactions, totalIncome, totalExpenses, totalSavings, netBalance, addTransaction, transferToSavings } = useFinancial();
  const { language } = useTheme();
  const { user } = useAuth();
  const t = translations[language];

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // --- Add Transaction Logic ---
  const [addTab, setAddTab] = useState<'upload' | 'text' | 'manual'>('manual');
  const [processingAI, setProcessingAI] = useState(false);
  const [manualForm, setManualForm] = useState({
    description: '', amount: '', date: '', category: '', type: TransactionType.EXPENSE
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProcessingAI(true);
      const file = e.target.files[0];
      let extracted: any[] = [];

      // Check for Excel file types
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.type.includes('spreadsheet') || file.type.includes('excel')) {
        extracted = await extractTransactionsFromExcel(file);
      } else {
        // Default to media (PDF/Image)
        extracted = await extractTransactionsFromMedia(file);
      }

      extracted.forEach((tx: any) => addTransaction(tx));
      setProcessingAI(false);
      setAddModalOpen(false);
    }
  };

  const handleTextSubmit = async (text: string) => {
    setProcessingAI(true);
    const extracted = await extractTransactionsFromText(text);
    extracted.forEach((tx: any) => addTransaction(tx));
    setProcessingAI(false);
    setAddModalOpen(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      description: manualForm.description,
      amount: Number(manualForm.amount),
      date: manualForm.date,
      category: manualForm.category,
      type: manualForm.type
    });
    setAddModalOpen(false);
  };

  // --- Transfer Logic ---
  const [transferAmount, setTransferAmount] = useState('');
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferToSavings(Number(transferAmount))) {
      setTransferModalOpen(false);
      setTransferAmount('');
    } else {
      alert(t.insufficientFunds);
    }
  };

  // --- AI Advice ---
  useEffect(() => {
    if (activeTab === 'dashboard' && transactions.length > 0) {
      setLoadingAdvice(true);
      const summary = JSON.stringify(transactions.slice(0, 10)); // Last 10 transactions
      getFinancialAdvice(summary).then(tips => {
        setAiTips(tips);
        setLoadingAdvice(false);
      });
    }
  }, [activeTab, transactions]);

  // --- Charts Data ---
  const dataPie = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc: any[], t) => {
        const existing = acc.find(x => x.name === t.category);
        if (existing) existing.value += t.amount;
        else acc.push({ name: t.category, value: t.amount });
        return acc;
    }, []);

  const dataBar = [
    { name: t.totalIncome, value: totalIncome },
    { name: t.totalExpenses, value: totalExpenses },
  ];

  const COLORS = ['#ef4444', '#22d3ee', '#22c55e', '#eab308', '#a855f7'];

  // --- Auto Open Modals based on Sidebar Selection ---
  useEffect(() => {
    if (activeTab === 'add') setAddModalOpen(true);
    if (activeTab === 'savings') setTransferModalOpen(true);
  }, [activeTab]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-gray-400 text-sm font-orbitron">{t.welcome}, {user?.name?.split(' ')[0]}</h2>
          <h1 className="text-3xl font-orbitron font-bold text-white">{t.dashboard}</h1>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t.addTransaction}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-rg-success">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-400 text-xs font-orbitron uppercase tracking-wider">{t.totalIncome}</p>
                    <h3 className="text-2xl font-bold text-rg-success mt-1">£{totalIncome.toFixed(2)}</h3>
                </div>
                <TrendingUp className="text-rg-success w-6 h-6 opacity-50" />
            </div>
        </Card>
        <Card className="border-l-4 border-l-rg-primary">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-400 text-xs font-orbitron uppercase tracking-wider">{t.totalExpenses}</p>
                    <h3 className="text-2xl font-bold text-rg-primary mt-1">£{totalExpenses.toFixed(2)}</h3>
                </div>
                <TrendingDown className="text-rg-primary w-6 h-6 opacity-50" />
            </div>
        </Card>
        <Card className="border-l-4 border-l-rg-accent">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-400 text-xs font-orbitron uppercase tracking-wider">{t.totalSaved}</p>
                    <h3 className="text-2xl font-bold text-rg-accent mt-1">£{totalSavings.toFixed(2)}</h3>
                </div>
                <PiggyBank className="text-rg-accent w-6 h-6 opacity-50" />
            </div>
        </Card>
        <Card className="border-l-4 border-l-white">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-400 text-xs font-orbitron uppercase tracking-wider">{t.netBalance}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">£{netBalance.toFixed(2)}</h3>
                </div>
                <Wallet className="text-white w-6 h-6 opacity-50" />
            </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-[350px]">
            <h3 className="font-orbitron font-bold mb-4">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataPie} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#242424', borderColor: '#333', color: '#fff' }} formatter={(value) => `£${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          
          <Card>
             <h3 className="font-orbitron font-bold mb-4">{t.recentTransactions}</h3>
             <div className="space-y-3">
                {transactions.slice(0, 5).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                tx.type === 'INCOME' ? 'bg-rg-success/20 text-rg-success' : 
                                tx.type === 'SAVINGS' ? 'bg-rg-accent/20 text-rg-accent' : 'bg-rg-primary/20 text-rg-primary'
                            }`}>
                                {tx.type === 'INCOME' ? <TrendingUp className="w-5 h-5" /> : 
                                 tx.type === 'SAVINGS' ? <PiggyBank className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-medium">{tx.description}</p>
                                <p className="text-xs text-gray-500">{tx.date} • {tx.category}</p>
                            </div>
                        </div>
                        <span className={`font-orbitron ${
                            tx.type === 'INCOME' ? 'text-rg-success' : 
                            tx.type === 'SAVINGS' ? 'text-rg-accent' : 'text-rg-primary'
                        }`}>
                            {tx.type === 'INCOME' ? '+' : '-'}£{Number(tx.amount).toFixed(2)}
                        </span>
                    </div>
                ))}
             </div>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
            {/* AI Consultant */}
            <Card className="bg-gradient-to-b from-rg-card to-black border-rg-primary/20 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-rg-primary/10 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-2 mb-4 text-rg-primary">
                    <Bot className="w-6 h-6" />
                    <h3 className="font-orbitron font-bold text-lg">{t.aiConsultant}</h3>
                </div>
                {loadingAdvice ? (
                    <div className="text-sm text-gray-400 animate-pulse">{t.analyzing}</div>
                ) : (
                    <div className="space-y-3">
                        {aiTips.map((tip, idx) => (
                            <div key={idx} className="p-3 bg-white/5 rounded-lg text-sm text-gray-300 border-l-2 border-rg-primary">
                                {tip}
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <Card className="h-[300px]">
                <h3 className="font-orbitron font-bold mb-4">Income vs Expense</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataBar}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#242424', borderColor: '#333', color: '#fff' }} formatter={(value) => `£${value}`} />
                        <Bar dataKey="value" fill="#ef4444">
                            {dataBar.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <Card className="w-full max-w-lg bg-rg-bg border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-orbitron font-bold">{t.addTransaction}</h3>
                    <button onClick={() => setAddModalOpen(false)}><TypeIcon className="rotate-45 w-6 h-6" /></button>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-2 mb-6 p-1 bg-black/50 rounded-lg">
                    {(['upload', 'text', 'manual'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setAddTab(tab)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${addTab === tab ? 'bg-rg-card text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                           {tab === 'upload' ? t.upload : tab === 'text' ? t.text : t.manual} 
                        </button>
                    ))}
                </div>

                {processingAI ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-rg-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-rg-primary animate-pulse">{t.processing}</p>
                    </div>
                ) : (
                    <>
                        {addTab === 'upload' && (
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center hover:border-rg-primary transition-colors relative group">
                                <input 
                                    type="file" 
                                    accept="image/*,application/pdf,.xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" 
                                    onChange={handleFileUpload} 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                />
                                <div className="group-hover:scale-110 transition-transform duration-300">
                                    <div className="flex justify-center gap-4 mb-4">
                                        <Upload className="w-10 h-10 text-gray-500 group-hover:text-rg-primary" />
                                        <FileSpreadsheet className="w-10 h-10 text-gray-500 group-hover:text-green-500" />
                                    </div>
                                    <p className="text-sm text-gray-400 font-orbitron">Drop PDF, Excel or Image</p>
                                </div>
                            </div>
                        )}
                        {addTab === 'text' && (
                            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleTextSubmit(fd.get('txt') as string); }}>
                                <textarea name="txt" className="w-full h-32 bg-black/30 border border-gray-700 rounded-md p-3 text-sm mb-4 focus:border-rg-primary outline-none" placeholder="Paste bank statement text here..."></textarea>
                                <Button type="submit" className="w-full">{t.submit}</Button>
                            </form>
                        )}
                        {addTab === 'manual' && (
                            <form onSubmit={handleManualSubmit} className="space-y-4">
                                <Input label={t.description} value={manualForm.description} onChange={e => setManualForm({...manualForm, description: e.target.value})} required />
                                <div className="flex gap-4">
                                    <Input label={t.amount} type="number" value={manualForm.amount} onChange={e => setManualForm({...manualForm, amount: e.target.value})} required />
                                    <Input label={t.date} type="date" value={manualForm.date} onChange={e => setManualForm({...manualForm, date: e.target.value})} required />
                                </div>
                                <div className="flex gap-4">
                                    <Input label={t.category} value={manualForm.category} onChange={e => setManualForm({...manualForm, category: e.target.value})} required />
                                    <div className="w-full">
                                        <label className="block text-xs font-medium text-gray-400 mb-1 font-orbitron">{t.type}</label>
                                        <select 
                                            className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:border-rg-primary outline-none"
                                            value={manualForm.type}
                                            onChange={e => setManualForm({...manualForm, type: e.target.value as any})}
                                        >
                                            <option value="EXPENSE">Expense</option>
                                            <option value="INCOME">Income</option>
                                            <option value="SAVINGS">Savings</option>
                                        </select>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-4">{t.submit}</Button>
                            </form>
                        )}
                    </>
                )}
            </Card>
        </div>
      )}

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <Card className="w-full max-w-md bg-rg-bg border-rg-accent/30">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-orbitron font-bold text-rg-accent">{t.savings}</h3>
                    <button onClick={() => setTransferModalOpen(false)}><TypeIcon className="rotate-45 w-6 h-6" /></button>
                </div>
                <div className="mb-6 p-4 bg-rg-accent/10 rounded-lg border border-rg-accent/20 text-center">
                    <p className="text-sm text-gray-400">Current Liquid Balance</p>
                    <p className="text-2xl font-bold text-white">£{netBalance.toFixed(2)}</p>
                </div>
                <form onSubmit={handleTransfer}>
                    <Input 
                        label="Amount to Transfer" 
                        type="number" 
                        value={transferAmount} 
                        onChange={e => setTransferAmount(e.target.value)} 
                        className="text-lg font-bold text-center"
                        placeholder="0.00"
                        required
                    />
                    <Button type="submit" className="w-full mt-6 bg-rg-accent hover:bg-cyan-600 text-black font-bold">
                        {t.transfer} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </form>
             </Card>
        </div>
      )}

    </div>
  );
};