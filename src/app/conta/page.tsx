'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/providers/AuthProvider';
import LoadingScreen from '@/components/LoadingScreen';

interface MenuOption {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export default function ContaPage() {
  const { user, authenticated, requireAuth } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await requireAuth();
      if (!result.success) {
        router.push('/conta/login?redirect=/conta');
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [requireAuth, router]);

  const menuOptions: MenuOption[] = [
    {
      title: 'Meu Perfil',
      description: 'Visualize e atualize seus dados pessoais, endereço e configurações da conta.',
      icon: '👤',
      href: '/conta/perfil'
    },
    {
      title: 'Meus Pedidos',
      description: 'Acompanhe seus pedidos, histórico de compras e detalhes de entregas.',
      icon: '📦',
      href: '/conta/pedidos'
    },
    {
      title: 'Endereços',
      description: 'Gerencie seus endereços de entrega para facilitar suas compras.',
      icon: '🏠',
      href: '/conta/enderecos'
    },
    {
      title: 'Favoritos',
      description: 'Produtos que você marcou como favoritos para comprar depois.',
      icon: '❤️',
      href: '/conta/favoritos'
    },
    {
      title: 'Avaliações',
      description: 'Veja e gerencie suas avaliações de produtos comprados.',
      icon: '⭐',
      href: '/conta/avaliacoes'
    },
    {
      title: 'Segurança',
      description: 'Altere sua senha e configure opções de segurança da conta.',
      icon: '🔒',
      href: '/conta/seguranca'
    }
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6 bg-amber-600 text-white">
              <h1 className="text-2xl font-bold">Minha Conta</h1>
              {user && (
                <p className="mt-1">Bem-vindo(a), {user.nome}!</p>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl text-amber-800">
                  {user?.nome?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{user?.nome || 'Usuário'}</h2>
                  <p className="text-gray-600">{user?.email || 'email@exemplo.com'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuOptions.map((option, index) => (
              <Link 
                key={index} 
                href={option.href}
                className="bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{option.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{option.title}</h3>
                      <p className="text-gray-600 text-sm">{option.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => {
                const auth = useAuthContext();
                auth.logout();
                router.push('/');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 