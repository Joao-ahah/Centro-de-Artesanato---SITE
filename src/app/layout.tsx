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
  title: {
    default: 'Centro de Artesanato',
    template: '%s | Centro de Artesanato'
  },
  description: 'Descubra produtos artesanais únicos feitos à mão por artesãos de todo o Brasil. Valorizando tradições e cultura brasileira.',
  keywords: ['artesanato', 'artesanato brasileiro', 'produtos artesanais', 'feito à mão', 'cultura brasileira', 'tradição'],
  authors: [{ name: 'Centro de Artesanato' }],
  creator: 'Centro de Artesanato',
  publisher: 'Centro de Artesanato',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://centro-artesanato.com',
    siteName: 'Centro de Artesanato',
    title: 'Centro de Artesanato - Produtos Artesanais Brasileiros',
    description: 'Descubra produtos artesanais únicos feitos à mão por artesãos de todo o Brasil.',
    images: [
      {
        url: '/banner-artesanato-generico.jpg',
        width: 1200,
        height: 630,
        alt: 'Centro de Artesanato',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Centro de Artesanato',
    description: 'Produtos artesanais únicos feitos à mão por artesãos brasileiros',
    images: ['/banner-artesanato-generico.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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