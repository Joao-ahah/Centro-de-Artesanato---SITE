'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className={`bg-white shadow-md transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b flex justify-between items-center">
        {!collapsed && <h2 className="text-xl font-bold text-amber-800">Admin</h2>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-amber-600"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
      
      <ul className="p-2">
        <li className="mb-1">
          <Link 
            href="/admin/dashboard" 
            className={`flex items-center p-2 rounded ${
              isActive('/admin/dashboard') 
                ? 'bg-amber-100 text-amber-800 font-medium' 
                : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {!collapsed && <span>Dashboard</span>}
          </Link>
        </li>
        <li className="mb-1">
          <Link 
            href="/admin/produtos" 
            className={`flex items-center p-2 rounded ${
              isActive('/admin/produtos') 
                ? 'bg-amber-100 text-amber-800 font-medium' 
                : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            {!collapsed && <span>Produtos</span>}
          </Link>
        </li>
        <li className="mb-1">
          <Link 
            href="/admin/pedidos" 
            className={`flex items-center p-2 rounded ${
              isActive('/admin/pedidos') 
                ? 'bg-amber-100 text-amber-800 font-medium' 
                : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {!collapsed && <span>Pedidos</span>}
          </Link>
        </li>
        <li className="mb-1">
          <Link 
            href="/admin/clientes" 
            className={`flex items-center p-2 rounded ${
              isActive('/admin/clientes') 
                ? 'bg-amber-100 text-amber-800 font-medium' 
                : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {!collapsed && <span>Clientes</span>}
          </Link>
        </li>
      </ul>
      
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t">
        <button
          onClick={logout}
          className="flex items-center p-2 w-full text-left text-red-600 hover:bg-red-50 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
} 