import React, { createContext, useState, useContext, ReactNode, PropsWithChildren } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    setUser({
      id: '123',
      name: 'Cyber User',
      email: email,
      address: 'Neo Tokyo, District 9',
      avatar: 'https://picsum.photos/100/100'
    });
  };

  const signup = (data: any) => {
    setUser({
      id: '123',
      name: data.name,
      email: data.email,
      address: data.address,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};