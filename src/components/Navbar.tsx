'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/providers/CartProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { user, authenticated, loading, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Verificar se a página atual é admin
  const isAdminPage = pathname?.startsWith('/admin');
  
  // Efeito para detectar o scroll e mudar o estilo da navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Se for uma página do admin, não mostrar a navbar
  if (isAdminPage) return null;
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-amber-800 font-bold text-xl">Centro de Artesanato</span>
          </Link>
          
          {/* Links de navegação - versão desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`hover:text-amber-700 transition-colors ${
                pathname === '/' ? 'text-amber-800 font-medium' : 'text-gray-700'
              }`}
            >
              Início
            </Link>
            <Link 
              href="/produtos" 
              className={`hover:text-amber-700 transition-colors ${
                pathname?.startsWith('/produtos') ? 'text-amber-800 font-medium' : 'text-gray-700'
              }`}
            >
              Produtos
            </Link>
            <Link 
              href="/blog" 
              className={`hover:text-amber-700 transition-colors ${
                pathname?.startsWith('/blog') ? 'text-amber-800 font-medium' : 'text-gray-700'
              }`}
            >
              Blog
            </Link>
            <Link 
              href="/sobre" 
              className={`hover:text-amber-700 transition-colors ${
                pathname === '/sobre' ? 'text-amber-800 font-medium' : 'text-gray-700'
              }`}
            >
              Sobre
            </Link>
            <Link 
              href="/contato" 
              className={`hover:text-amber-700 transition-colors ${
                pathname === '/contato' ? 'text-amber-800 font-medium' : 'text-gray-700'
              }`}
            >
              Contato
            </Link>
          </div>
          
          {/* Botões de ação */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Carrinho sempre visível */}
            <Link 
              href="/carrinho" 
              className="text-gray-700 hover:text-amber-700 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            
            {loading ? (
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-amber-700"></div>
            ) : authenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-amber-700">
                    <span className="mr-1">{user?.nome?.split(' ')[0] || 'Usuário'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10 hidden group-hover:block">
                    <Link 
                      href="/conta/perfil" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Meu Perfil
                    </Link>
                    <Link 
                      href="/conta/pedidos" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Meus Pedidos
                    </Link>
                    {user?.isAdmin && (
                      <Link 
                        href="/admin/dashboard" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Painel Admin
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button 
                      onClick={logout} 
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link 
                  href="/conta/login" 
                  className="text-gray-700 hover:text-amber-700"
                >
                  Entrar
                </Link>
                <Link 
                  href="/conta/cadastro" 
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile buttons */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Carrinho sempre visível (mobile) */}
            <Link 
              href="/carrinho" 
              className="text-gray-700 hover:text-amber-700 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            
            {/* Botão de menu mobile */}
            <button
              className="text-gray-700 hover:text-amber-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className={`hover:text-amber-700 transition-colors ${
                  pathname === '/' ? 'text-amber-800 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                href="/produtos" 
                className={`hover:text-amber-700 transition-colors ${
                  pathname?.startsWith('/produtos') ? 'text-amber-800 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Produtos
              </Link>
              <Link 
                href="/blog" 
                className={`hover:text-amber-700 transition-colors ${
                  pathname?.startsWith('/blog') ? 'text-amber-800 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/sobre" 
                className={`hover:text-amber-700 transition-colors ${
                  pathname === '/sobre' ? 'text-amber-800 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link 
                href="/contato" 
                className={`hover:text-amber-700 transition-colors ${
                  pathname === '/contato' ? 'text-amber-800 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              
              <hr className="my-2" />
              
              {loading ? (
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-amber-700"></div>
              ) : authenticated ? (
                <>
                  <Link 
                    href="/carrinho" 
                    className="text-gray-700 hover:text-amber-700 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Carrinho
                  </Link>
                  <Link 
                    href="/conta/perfil" 
                    className="text-gray-700 hover:text-amber-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  <Link 
                    href="/conta/pedidos" 
                    className="text-gray-700 hover:text-amber-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Pedidos
                  </Link>
                  {user?.isAdmin && (
                    <Link 
                      href="/admin/dashboard" 
                      className="text-gray-700 hover:text-amber-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Painel Admin
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }} 
                    className="text-red-600 hover:text-red-700 text-left"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link 
                    href="/conta/login" 
                    className="text-gray-700 hover:text-amber-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link 
                    href="/conta/cadastro" 
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 