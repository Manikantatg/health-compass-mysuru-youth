import { DisableInspect } from '@/components/security/DisableInspect';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PediaPredict - AI-Powered Health Assessment',
  description: 'Advanced health assessment and monitoring system for students',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DisableInspect />
        {children}
      </body>
    </html>
  );
} 