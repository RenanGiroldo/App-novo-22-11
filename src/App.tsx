import React, { useState, PropsWithChildren } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FinancialProvider } from './context/FinancialContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './layout/Navbar';
import { Sidebar } from './layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { Card } from './components/Card';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { X } from 'lucide-react';

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const AppContent = () => {
  const { user, login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  
  // Mock Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Dashboard Navigation State (passed as props to trigger modals inside dashboard)
  const [dashTab, setDashTab] = useState('dashboard');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    setAuthModal(null);
    navigate('/dashboard');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ email, name: 'New User' });
    setAuthModal(null);
    navigate('/dashboard');
  };

  const handleSidebarNavigate = (page: string) => {
    if (page === 'dashboard') {
        setDashTab('dashboard');
        navigate('/dashboard');
    } else if (page === 'add') {
        setDashTab('add');
        navigate('/dashboard'); // Ensure we are on dashboard to show modal
    } else if (page === 'savings') {
        setDashTab('savings');
        navigate('/dashboard');
    } else if (page === 'account') {
        alert('Account settings would open here.');
    }
  };

  return (
    <div className="min-h-screen bg-rg-bg text-rg-text selection:bg-rg-primary selection:text-white font-sans">
      <Navbar 
        toggleSidebar={() => setSidebarOpen(true)} 
        openLogin={() => setAuthModal('login')}
      />
      
      <Sidebar 
        isOpen={sidebarOpen && isAuthenticated} 
        close={() => setSidebarOpen(false)} 
        onNavigate={handleSidebarNavigate}
      />

      <Routes>
        <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage onLogin={() => setAuthModal('login')} onSignup={() => setAuthModal('signup')} />
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage activeTab={dashTab} />
          </PrivateRoute>
        } />
      </Routes>

      {/* Auth Modals */}
      {authModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <Card className="w-full max-w-md border-rg-primary/30 relative">
                <button onClick={() => setAuthModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6"/></button>
                <h2 className="text-2xl font-orbitron font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {authModal === 'login' ? 'SYSTEM ACCESS' : 'NEW IDENTITY'}
                </h2>
                
                <form onSubmit={authModal === 'login' ? handleLogin : handleSignup} className="space-y-4">
                    <Input 
                        label="Email Access Key" 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        placeholder="user@net.com"
                        required 
                    />
                    {authModal === 'signup' && (
                        <>
                             <Input label="Full Designation" placeholder="John Doe" />
                             <div className="flex gap-2">
                                <select className="w-24 bg-black/30 border border-gray-700 rounded-md text-sm px-2 text-white">
                                    <option>+1</option>
                                    <option>+55</option>
                                    <option>+44</option>
                                </select>
                                <Input className="flex-1" label="Comms Link" placeholder="Phone Number" />
                             </div>
                        </>
                    )}
                    <Input 
                        label="Security Sequence" 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required 
                    />
                    
                    <Button type="submit" className="w-full mt-6" size="lg">
                        {authModal === 'login' ? 'AUTHENTICATE' : 'INITIALIZE'}
                    </Button>
                </form>
                
                <div className="mt-4 text-center">
                    <button className="text-xs text-rg-primary hover:underline">
                        {authModal === 'login' ? 'Lost Access Key?' : ''}
                    </button>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FinancialProvider>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </FinancialProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;