"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaTachometerAlt, FaBullhorn, FaGift, FaRoute, FaLightbulb, FaStar, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth(); // This component consumes the context, which is allowed
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // This is the authentication guard for dashboard pages
    if (!loading && !user) { 
      router.push('/login'); 
    }
  }, [user, loading, router]);

  // Show a loading spinner while the auth state is being determined
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-xl text-brand-text-light">Initializing...</p>
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: <FaBullhorn /> },
    { name: 'Rewards', href: '/dashboard/rewards', icon: <FaGift /> },
    { name: 'My Journey', href: '/dashboard/my-journey', icon: <FaRoute /> },
    { name: "Subscription", href: '/dashboard/subscription', icon: <FaStar />},
    { name: "What's New", href: '/dashboard/whats-new', icon: <FaLightbulb />},
  ];
  
  // NOTE: The main navbar and footer are now handled by the RootLayout.
  // This layout provides the collapsible sidebar and the main content area for dashboard pages.
  return (
    <div className={`flex flex-grow w-full transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
      <aside className={`bg-slate-800 text-slate-200 p-4 hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] shadow-lg print:hidden transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <nav className="flex-grow">
          <ul className="space-y-1.5">
            {sidebarLinks.map(link => (
              <li key={link.name} title={isSidebarOpen ? '' : link.name}>
                <Link href={link.href} className={`group flex items-center p-3 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium ${pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard') ? 'bg-brand-primary text-white shadow-md' : 'text-slate-300'}`}>
                  <span className="text-lg transition-opacity">{link.icon}</span>
                  <span className={`ml-3 transition-opacity duration-200 whitespace-nowrap ${!isSidebarOpen && 'opacity-0 scale-0 hidden'}`}>
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Sidebar Toggle Button */}
        <div className="pt-4 border-t border-slate-700">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center justify-center p-3 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" title={isSidebarOpen ? 'Collapse Menu' : 'Expand Menu'}>
                {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
                <span className={`ml-2 text-sm transition-opacity duration-200 whitespace-nowrap ${!isSidebarOpen && 'opacity-0 scale-0 hidden'}`}>Collapse</span>
            </button>
        </div>
      </aside>
      <main className="flex-1 w-full">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}