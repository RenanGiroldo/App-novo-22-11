import React, { useState } from 'react';
import { Menu, Sun, Moon, Globe, User as UserIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';

interface NavbarProps {
  toggleSidebar: () => void;
  openLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, openLogin }) => {
  const { language, setLanguage, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-white/10 bg-rg-bg/80 backdrop-blur-lg px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-md lg:hidden">
          <Menu className="w-6 h-6 text-rg-primary" />
        </button>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rg-primary rounded flex items-center justify-center font-orbitron font-bold text-white">R</div>
            <span className="text-xl font-orbitron font-bold tracking-wider hidden sm:block">RG FINANCES</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="p-2 hover:bg-white/10 rounded-full">
                <Globe className="w-5 h-5 text-gray-400" />
            </button>
            {langOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-rg-card border border-white/10 rounded-md shadow-lg py-1">
                    <button onClick={() => { setLanguage(Language.EN); setLangOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10">EN</button>
                    <button onClick={() => { setLanguage(Language.PT); setLangOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10">PT</button>
                </div>
            )}
        </div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2 hover:bg-white/10 rounded-full">
            {isDark ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-400" />}
        </button>

        {/* Auth */}
        {user ? (
            <div className="flex items-center gap-3">
                 <span className="text-sm hidden md:block font-orbitron text-rg-accent">{user.name}</span>
                 <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </div>
        ) : (
            <Button size="sm" onClick={openLogin}>Login</Button>
        )}
      </div>
    </nav>
  );
};