import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produtos Artesanais',
  description: 'Descubra peças únicas feitas à mão por artesãos de todo o Brasil. Cerâmica, têxteis, madeira, trançados e muito mais.',
  keywords: ['produtos artesanais', 'cerâmica', 'têxteis', 'madeira', 'trançados', 'decoração', 'artesanato brasileiro'],
  openGraph: {
    title: 'Produtos Artesanais | Centro de Artesanato',
    description: 'Descubra peças únicas feitas à mão por artesãos de todo o Brasil',
    type: 'website',
  },
};

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 