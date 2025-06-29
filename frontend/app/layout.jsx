// Make sure this file is a Server Component (NO "use client" at the top)
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext'; // Import AuthProvider
import Navbar from '@/components/common/Navbar';     // Import Navbar
import Footer from '@/components/common/Footer';     // Import Footer

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EchoCRM | Intelligent Customer Engagement',
  description: 'Customer segmentation, personalized campaign delivery, and intelligent insights.',
};

export default function RootLayout({ children }) {
  // Set consistent top padding for the main content area to account for the fixed navbar
  const navbarHeightPadding = "pt-16"; // Corresponds to h-16 (4rem) navbar height

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col h-full bg-slate-100`}>
        <AuthProvider> {/* AuthProvider MUST wrap everything */}
          <header>
            <Navbar appName="EchoCRM" />
          </header>
          {/* Main content area takes up remaining space */}
          <main className={`${navbarHeightPadding} flex-grow flex flex-col`}>
            {children} {/* All page content, including your HomePage and DashboardLayout, renders here */}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}