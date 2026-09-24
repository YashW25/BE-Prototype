import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'NYAYAVAULT — Secure Digital Document Management System',
  description: 'Case-centric digital document management system for legal and investigation documents with SHA-256 cryptographic integrity verification and audit logging. Prototype 1 for SIH26190.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
