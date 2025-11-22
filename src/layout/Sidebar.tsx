import React from 'react';
import { X, LayoutDashboard, PlusCircle, PiggyBank, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../utils/translations';

interface SidebarProps {
  isOpen: boolean;
  close: () => void;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, close, onNavigate }) => {
  const { language } = useTheme();
  const t = translations[language];

  const items = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'add', label: t.import, icon: PlusCircle },
    { id: 'savings', label: t.savings, icon: PiggyBank },
    { id: 'account', label: t.account, icon: User },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={close}
      />

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-rg-card border-r border-white/10 z-[70] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-white/10 h-16">
          <span className="font-orbitron font-bold text-lg text-rg-primary">MENU</span>
          <button onClick={close} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); close(); }}
              className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-rg-primary transition-colors group"
            >
              <item.icon className="w-5 h-5 group-hover:animate-pulse" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};