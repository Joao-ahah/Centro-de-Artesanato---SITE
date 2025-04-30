'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const checkAuth = async () => {
    try {
      console.log('Verificando autenticação...');
      // Verificar se estamos no lado do cliente
      if (typeof window === 'undefined') {
        console.log('Executando no servidor, ignorando verificação de autenticação');
        setLoading(false);
        return false;
      }

      // Verificar token
      const token = localStorage.getItem('token');
      console.log('Token encontrado:', token ? 'sim' : 'não');
      
      if (!token) {
        setUser(null);
        setAuthenticated(false);
        setLoading(false);
        return false;
      }

      // Tentar obter usuário do localStorage ou sessionStorage
      let userData: User | null = null;
      
      // Verificar localStorage primeiro (para "lembrar de mim")
      const localStorageUser = localStorage.getItem('user');
      if (localStorageUser) {
        try {
          userData = JSON.parse(localStorageUser);
          console.log('Usuário encontrado no localStorage:', userData);
        } catch (err) {
          console.error('Erro ao fazer parse do usuário do localStorage:', err);
          localStorage.removeItem('user'); // Limpar dados inválidos
        }
      } else {
        // Verificar sessionStorage
        const sessionStorageUser = sessionStorage.getItem('user');
        if (sessionStorageUser) {
          try {
            userData = JSON.parse(sessionStorageUser);
            console.log('Usuário encontrado no sessionStorage:', userData);
          } catch (err) {
            console.error('Erro ao fazer parse do usuário do sessionStorage:', err);
            sessionStorage.removeItem('user'); // Limpar dados inválidos
          }
        }
      }

      if (userData) {
        setUser(userData);
        setAuthenticated(true);
        setLoading(false);
        return true;
      }

      // Se não temos usuário mas temos token, precisaríamos validar o token
      // com o servidor em uma aplicação real
      console.log('Token encontrado, mas nenhum usuário armazenado');
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
      return false;
    } finally {
      setInitialCheckDone(true);
    }
  };

  // Verificar autenticação quando o componente é montado
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, senha: string, lembrar: boolean = false) => {
    setLoading(true);
    try {
      console.log('Tentando login com:', { email, lembrar });
      
      // Usando fetch diretamente para ter mais controle sobre o erro
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha, lembrar })
      });
      
      const data = await response.json();
      console.log('Resposta do login:', data);
      
      if (response.ok && data.success) {
        // Salvar token no localStorage (sempre)
        localStorage.setItem('token', data.token);
        
        // Salvar dados do usuário no localStorage ou sessionStorage
        if (lembrar) {
          localStorage.setItem('user', JSON.stringify(data.usuario));
        } else {
          sessionStorage.setItem('user', JSON.stringify(data.usuario));
        }
        
        setUser(data.usuario);
        setAuthenticated(true);
        console.log('Login bem-sucedido. Usuário:', data.usuario);
        return { success: true };
      } else {
        console.log('Login falhou:', data.message);
        return { 
          success: false, 
          message: data.message || 'Erro ao fazer login' 
        };
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      return { 
        success: false, 
        message: error.message || 'Erro de conexão. Verifique sua internet.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { nome: string; email: string; senha: string; telefone?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Salvar token no localStorage
        localStorage.setItem('token', data.token);
        
        // Salvar dados do usuário no sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.usuario));
        
        setUser(data.usuario);
        setAuthenticated(true);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: data.message || 'Erro ao registrar conta' 
        };
      }
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      return { 
        success: false, 
        message: error.message || 'Erro de conexão. Verifique sua internet.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Função direta para definir dados de usuário admin (usado para bypass de login)
  const setAdminUser = () => {
    const adminUser = {
      id: 'admin-default-id',
      nome: 'Administrador',
      email: 'admin@admin.com',
      isAdmin: true
    };
    
    localStorage.setItem('token', 'token-admin-bypass-' + Date.now());
    localStorage.setItem('user', JSON.stringify(adminUser));
    
    setUser(adminUser);
    setAuthenticated(true);
    setLoading(false);
    
    console.log('Usuário admin definido manualmente:', adminUser);
  };

  const logout = () => {
    console.log('Fazendo logout...');
    // Remover token e dados do usuário
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    // Atualizar estado
    setUser(null);
    setAuthenticated(false);
    
    // Redirecionar para a página de login
    router.push('/conta/login');
  };

  const requireAuth = async (isAdminRequired: boolean = false) => {
    // Não redirecionar durante a verificação inicial
    if (loading && !initialCheckDone) {
      console.log('Aguardando verificação inicial de autenticação...');
      return { success: true, pending: true };
    }

    if (!authenticated) {
      console.log('Usuário não autenticado, redirecionando para login...');
      router.push('/conta/login');
      return { success: false, message: 'Usuário não autenticado' };
    }

    if (isAdminRequired && user && !user.isAdmin) {
      console.log('Acesso restrito a administradores, redirecionando...');
      router.push('/');
      return { success: false, message: 'Acesso restrito a administradores' };
    }

    console.log('Usuário autenticado e autorizado');
    return { success: true };
  };

  return {
    user,
    loading,
    authenticated,
    login,
    register,
    logout,
    checkAuth,
    requireAuth,
    setAdminUser
  };
} 