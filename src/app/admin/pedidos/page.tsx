'use client';

import React from 'react';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';

export default function GerenciamentoPedidos() {
  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Pedidos</h1>
            </div>
            
            <div className="bg-white p-10 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Em Desenvolvimento</h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                O módulo de gerenciamento de pedidos está em desenvolvimento e será disponibilizado em breve. 
                Por enquanto, você pode gerenciar seus produtos e monitorar seu painel.
              </p>
              
              <div className="flex space-x-4 justify-center">
                <Link 
                  href="/admin/dashboard" 
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
                >
                  Voltar ao Dashboard
                </Link>
                <Link 
                  href="/admin/produtos" 
                  className="bg-white border border-amber-600 text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-md"
                >
                  Gerenciar Produtos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 