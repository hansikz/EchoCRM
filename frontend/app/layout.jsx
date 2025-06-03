import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/common/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EchoCRM Platform',
  description: 'Customer Segmentation & Campaign Delivery with EchoCRM',
};

export default function RootLayout({ children }) {
    const mainContentPaddingTop = "pt-16"; 

  return (
    <html lang="en" className="h-full"> {}
      <body className={`${inter.className} flex flex-col h-full`}> {}
        <AuthProvider>
          <Navbar appName="EchoCRM" /> {}
          <main className={`${mainContentPaddingTop} flex-grow flex flex-col`}> {}
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}