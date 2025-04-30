'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from './LoadingScreen';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, authenticated } = useAuth();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Só executar esta verificação quando não estiver mais carregando
    if (!loading) {
      console.log('AdminRoute: Verificação de autenticação concluída');
      console.log('- Autenticado:', authenticated);
      console.log('- É admin:', user?.isAdmin);
      
      // Se não estiver autenticado, redirecionar para login
      if (!authenticated) {
        console.log('AdminRoute: Redirecionando para login (não autenticado)');
        router.push('/conta/login');
      } 
      // Se estiver autenticado mas não for admin, redirecionar para home
      else if (!user?.isAdmin) {
        console.log('AdminRoute: Redirecionando para home (não é admin)');
        router.push('/');
      } 
      // Se estiver autenticado e for admin, marcar a verificação como concluída
      else {
        console.log('AdminRoute: Usuário admin autenticado');
        setAuthChecked(true);
      }
    }
  }, [loading, authenticated, user, router]);

  // Se ainda estiver carregando, mostrar tela de carregamento
  if (loading || (!authChecked && (authenticated === false || !user?.isAdmin))) {
    return <LoadingScreen />;
  }

  // Se a verificação foi concluída e o usuário está autenticado como admin, renderizar os filhos
  return <>{children}</>;
} 