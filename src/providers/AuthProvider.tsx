'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth, User } from '@/hooks/useAuth';

// Contexto de autenticação
interface AuthContextType {
  authenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string, lembrar?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (userData: { nome: string; email: string; senha: string; telefone?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  requireAuth: (isAdminRequired?: boolean) => Promise<{ success: boolean; pending?: boolean; message?: string }>;
  setAdminUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto de autenticação
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor de autenticação
export default function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
} 