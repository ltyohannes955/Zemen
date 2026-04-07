import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zemen',
  description: 'Ethiopian calendar platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">{children}</body>
    </html>
  );
}

