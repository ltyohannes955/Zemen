import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './theme-provider';

export const metadata: Metadata = {
  title: 'Zemen - Ethiopian & Gregorian Calendars in Sync',
  description: 'A high-performance calendar engine for modern applications. Seamlessly bridge the calendar gap with React-first components and zero-dependency core logic.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-[#0a0e17] text-gray-900 dark:text-gray-100 antialiased transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
