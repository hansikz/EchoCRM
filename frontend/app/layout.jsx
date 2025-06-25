// File: EchoCRM/frontend/app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer'; // Import Footer

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EchoCRM | Intelligent Customer Engagement',
  description: 'Customer segmentation, personalized campaign delivery, and intelligent insights.',
};

export default function RootLayout({ children }) {
  const mainContentPaddingTop = "pt-16"; 

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col h-full bg-brand-bg`}>
        <AuthProvider>
          <header>
            <Navbar appName="EchoCRM" />
          </header>
          <main className={`${mainContentPaddingTop} flex-grow flex flex-col`}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}