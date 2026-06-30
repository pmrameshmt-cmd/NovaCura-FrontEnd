import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'NOVACURA GLOBAL',
  description: 'Bespoke medical services and luxurious care experiences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Defensive polyfill for server-side localStorage issues
  if (typeof window === 'undefined') {
    if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') {
      const noop = () => null;
      (global as any).localStorage = {
        getItem: noop,
        setItem: noop,
        removeItem: noop,
        clear: noop,
        length: 0,
        key: noop,
      };
    }
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Belleza&family=Inter:wght@400;500;600;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
