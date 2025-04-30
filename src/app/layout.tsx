import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/providers/AuthProvider';
import { CartProvider } from '@/providers/CartProvider';

// Configurar a fonte Poppins
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Centro de Artesanato',
  description: 'Descubra produtos artesanais únicos e feitos com amor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-poppins">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#363636',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                },
                success: {
                  style: {
                    border: '1px solid #c2e0c6',
                    borderLeft: '4px solid #2da44e',
                  },
                },
                error: {
                  style: {
                    border: '1px solid #ffcacb',
                    borderLeft: '4px solid #e5484d',
                  },
                },
              }}
            />
            <main className="min-h-screen w-full">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 