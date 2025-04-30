'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/AdminRoute';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para o dashboard
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <AdminRoute>
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700 mb-4"></div>
          <p className="text-gray-600">Redirecionando para o dashboard...</p>
        </div>
      </div>
    </AdminRoute>
  );
} 