"use client";
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) { 
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-xl text-brand-text-light">Initializing Dashboard...</p>
      </div>
    );
  }

  if (!user) { 
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        <div className="w-16 h-16 border-4 border-brand-error border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-xl text-brand-text-light">Redirecting to login...</p>
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Dashboard Home', href: '/dashboard', icon: '🏠' },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: '📊' },
    { name: 'Rewards', href: '/dashboard/rewards', icon: '🎁' },
    { name: 'My Journey', href: '/dashboard/my-journey', icon: '🚀' },
    { name: "Subscription", href: '/dashboard/subscription', icon: '⭐'},
    { name: "What's New", href: '/dashboard/whats-new', icon: '🎉' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-brand-bg"> {/* Adjusted for new navbar height */}
      <aside className="w-64 bg-slate-800 text-slate-200 p-5 hidden md:flex flex-col fixed top-14 sm:top-16 left-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] shadow-lg print:hidden"> {/* Adjusted for new navbar height */}
        <nav className="flex-grow mb-4">
          <ul className="space-y-1.5">
            {sidebarLinks.map(link => (
              <li key={link.name}>
                <Link href={link.href} className={`group flex items-center px-3 py-2.5 rounded-md hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium ${pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard' && link.href !== '/') ? 'bg-brand-primary text-white shadow-md' : 'text-slate-300'}`}>
                  <span className="mr-3 text-lg opacity-75 group-hover:opacity-100">{link.icon}</span>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Footer section in sidebar */}
        <div className="mt-auto pt-5 border-t border-slate-700 text-xs text-slate-400 space-y-3">
           <p className="font-semibold text-brand-primary-light text-center text-sm italic leading-tight">
            "At EchoCRM, every customer story echoes..."
           </p>
           <p className="text-center text-slate-500 text-[0.65rem] leading-relaxed mb-2">
            ...because great service isn’t a transaction, it’s a lasting resonance.
           </p>
          <p className="text-center">Contact: <a href="mailto:justsimplyhans@gmail.com" className="hover:text-brand-primary-light underline">justsimplyhans@gmail.com</a></p>
          <p className="text-center">Developed by Hansika Singhal.</p>
          <p className="text-center">&copy; {currentYear} EchoCRM. All rights reserved.</p>
        </div>
      </aside>
      <main className="flex-1 md:ml-64 bg-brand-bg">
        <div className="container mx-auto p-4 py-6 sm:p-6 lg:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}