import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../utils/translations';
import { ShieldCheck, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingPage: React.FC<LandingProps> = ({ onLogin, onSignup }) => {
  const { language } = useTheme();
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 relative overflow-hidden bg-rg-bg transition-colors duration-300">
      {/* Background Glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-rg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-rg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Content */}
      <div className="z-10 text-center max-w-4xl px-4 mb-16">
        <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rg-primary via-emerald-400 to-teal-500">
          {t.heroTitle}
        </h1>
        <p className="text-xl text-rg-muted mb-8 font-light">
          {t.heroSubtitle}
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={onSignup} className="shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            {t.signUp}
          </Button>
          <Button size="lg" variant="outline" onClick={onLogin}>
            <ShieldCheck className="w-4 h-4 mr-2" />
            {t.secureLogin}
          </Button>
        </div>
      </div>

      {/* Mockup Section */}
      <div className="z-10 w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center pb-20">
        {/* Left Card: Chaos (Falling Stock Market) */}
        <Card className="hidden md:block transform -rotate-6 translate-y-12 opacity-80 hover:opacity-100 hover:rotate-0 transition-all duration-500 hover:z-20 border-red-500/30 bg-rg-card shadow-2xl">
           <div className="h-48 bg-gray-900/50 rounded-md mb-4 overflow-hidden relative border border-red-500/10 p-4 flex flex-col justify-end">
                {/* Red Falling Chart SVG */}
                <svg viewBox="0 0 100 50" className="w-full h-full absolute top-0 left-0 opacity-70">
                    <polyline 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="2" 
                        points="0,10 10,15 20,12 30,20 40,18 50,35 60,30 70,45 80,42 90,48 100,46" 
                        vectorEffect="non-scaling-stroke"
                    />
                    <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                    <polygon 
                        fill="url(#gradRed)" 
                        points="0,10 10,15 20,12 30,20 40,18 50,35 60,30 70,45 80,42 90,48 100,46 100,60 0,60" 
                    />
                </svg>
                <div className="relative z-10 flex items-center gap-2 text-red-500 font-bold font-orbitron">
                    <TrendingDown className="w-6 h-6" />
                    <span>-45.2%</span>
                </div>
           </div>
           <h3 className="text-xl font-bold text-red-400 mb-2">{t.chaos}</h3>
           <p className="text-xs text-gray-400">Uncontrolled expenses leading to financial collapse.</p>
        </Card>

        {/* Center: Phone Mockup (Minimalist Tech) */}
        <div className="relative mx-auto w-72 h-[580px] bg-gray-900 rounded-[3.5rem] border-[8px] border-gray-800 shadow-[0_0_40px_rgba(16,185,129,0.2)] overflow-hidden z-30 animate-float">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-gray-800 rounded-b-xl z-40"></div>
          
          {/* Screen Content */}
          <div className="w-full h-full bg-rg-bg flex flex-col font-sans">
              {/* App Header */}
              <div className="pt-12 pb-6 px-6 flex justify-between items-center">
                 <div>
                    <div className="text-[10px] text-gray-400 font-orbitron uppercase tracking-wider">Total Balance</div>
                    <div className="text-3xl font-bold text-rg-text font-orbitron">£24,500</div>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-rg-primary/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-rg-primary" />
                 </div>
              </div>

              {/* Minimalist Graph */}
              <div className="px-0 mb-6">
                 <svg viewBox="0 0 100 40" className="w-full h-32">
                     <defs>
                        <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                     <path 
                        d="M0,30 Q10,28 20,20 T40,15 T60,25 T80,10 T100,18 V40 H0 Z" 
                        fill="url(#gradGreen)" 
                     />
                     <path 
                        d="M0,30 Q10,28 20,20 T40,15 T60,25 T80,10 T100,18" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2"
                     />
                 </svg>
              </div>

              {/* Transaction List Preview */}
              <div className="flex-1 bg-rg-card rounded-t-3xl p-6 space-y-5 shadow-inner border-t border-white/5">
                 <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-2 opacity-20"></div>
                 
                 {[1, 2, 3].map((i) => (
                     <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${i === 2 ? 'bg-red-500/10' : 'bg-rg-primary/10'}`}>
                                {i === 2 ? <TrendingDown className="w-5 h-5 text-red-500" /> : <TrendingUp className="w-5 h-5 text-rg-primary" />}
                            </div>
                            <div className="space-y-1">
                                <div className="w-24 h-3 bg-gray-500/20 rounded"></div>
                                <div className="w-16 h-2 bg-gray-500/10 rounded"></div>
                            </div>
                        </div>
                        <div className={`w-16 h-4 rounded ${i === 2 ? 'bg-red-500/10' : 'bg-rg-primary/10'}`}></div>
                     </div>
                 ))}
                 
                 {/* Floating Action Button Mockup */}
                 <div className="absolute bottom-8 right-6 w-12 h-12 bg-rg-primary rounded-full shadow-lg shadow-rg-primary/40 flex items-center justify-center text-white">
                    <div className="w-6 h-0.5 bg-white rounded absolute"></div>
                    <div className="h-6 w-0.5 bg-white rounded absolute"></div>
                 </div>
              </div>
          </div>
        </div>

        {/* Right Card: Freedom */}
        <Card className="hidden md:block transform rotate-6 translate-y-12 opacity-80 hover:opacity-100 hover:rotate-0 transition-all duration-500 hover:z-20 border-rg-primary/30 bg-rg-card shadow-2xl">
           <div className="h-48 bg-gray-900/50 rounded-md mb-4 overflow-hidden relative group">
               {/* Rising Graph Visualization */}
               <div className="w-full h-full bg-gray-900 flex items-end px-4 pb-4 relative">
                    {/* Green Rising Chart SVG */}
                     <svg viewBox="0 0 100 50" className="w-full h-full absolute top-0 left-0 opacity-70">
                        <polyline 
                            fill="none" 
                            stroke="#10b981" 
                            strokeWidth="2" 
                            points="0,45 10,40 20,42 30,35 40,38 50,25 60,28 70,15 80,18 90,5 100,8" 
                            vectorEffect="non-scaling-stroke"
                        />
                        <linearGradient id="gradGreenRight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                        <polygon 
                            fill="url(#gradGreenRight)" 
                            points="0,45 10,40 20,42 30,35 40,38 50,25 60,28 70,15 80,18 90,5 100,8 100,60 0,60" 
                        />
                    </svg>
                    <div className="relative z-10 w-full flex justify-center">
                        <div className="bg-rg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full border border-rg-primary/50 text-rg-primary font-orbitron font-bold text-sm">
                            + Growth
                        </div>
                    </div>
               </div>
           </div>
           <h3 className="text-xl font-bold text-rg-primary mb-2">{t.freedom}</h3>
           <div className="flex items-center gap-2 text-rg-success mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-mono">+145% Growth</span>
           </div>
        </Card>
      </div>
    </div>
  );
};