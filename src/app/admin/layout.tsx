'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminRoute from '@/components/AdminRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="admin-page">
        {children}
      </div>
    </AdminRoute>
  );
} 