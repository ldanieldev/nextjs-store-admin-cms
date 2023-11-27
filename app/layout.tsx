import { ModalProvider } from '@/providers/modal-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const font = Poppins({
  weight: ['200', '400', '700'],
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'E-Commerce Admin Dashboard - LDanielDev',
  description: 'E-Commerce Admin Dashboard'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={font.className}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem={true}
          >
            <Toaster richColors position='top-center' />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
