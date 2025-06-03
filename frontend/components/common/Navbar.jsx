"use client";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar({ appName = "EchoCRM" }) {
  const { user, logout, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/auth/callback');
  const isHomePage = pathname === '/';
  
  const navHeightClass = "h-16"; 

  if (!isMounted || (authLoading && isHomePage)) {
    if (isHomePage) {
      return (
        <nav className={`bg-gray-100 text-gray-700 p-4 fixed top-0 left-0 right-0 z-50 ${navHeightClass} flex items-center shadow`}>
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-xl sm:text-2xl font-bold text-purple-800">{appName}</span>
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </nav>
      );
    }
    return null;
  }

  if (isAuthPage) return null;

  if (isHomePage && !user) {
    return (
      <nav className={`bg-gray-100 text-gray-700 p-4 fixed top-0 left-0 right-0 z-50 ${navHeightClass} flex items-center shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-purple-800 hover:text-purple-900">
            {appName}
          </Link>
          <Link href="/login" className="bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md text-sm transition duration-300">
            Login / Sign Up
          </Link>
        </div>
      </nav>
    );
  }

  const mainNavLinks = [{ name: 'Dashboard', href: '/dashboard' }];

  return (
    <nav className={`bg-slate-800 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50 ${navHeightClass} flex items-center`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href={user ? "/dashboard" : "/"} className="text-xl sm:text-2xl font-bold hover:text-slate-300">
          {appName}
        </Link>

        {user && (
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {mainNavLinks.map(link => (
              <Link key={link.name} href={link.href} className={`px-3 py-2 rounded-md text-xs lg:text-sm font-medium hover:bg-slate-700 transition-colors ${pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard') ? 'bg-slate-950 shadow-inner' : ''}`}>
                  {link.name}
              </Link>
            ))}
            <Link href="/dashboard/subscription" className="bg-brand-accent hover:bg-brand-accent-darker text-white px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors shadow-interactive hover:shadow-interactive-hover">
                Join Echo Pro
            </Link>
            <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors shadow-interactive hover:shadow-interactive-hover">Logout ({user.name})</button>
          </div>
        )}

        {user && (
            <div className="md:hidden">
                <Link href="/dashboard/subscription" className="text-brand-accent hover:text-orange-300 mr-2 text-xs font-semibold">
                    Pro
                </Link>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 hover:text-white focus:outline-none p-1.5 inline-flex items-center">
                    <span className="sr-only">Open menu</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />}</svg>
                </button>
            </div>
        )}
         {!user && !isHomePage && ( <Link href="/login" className="bg-brand-primary hover:bg-brand-primary-dark text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link> )}
      </div>

      {mobileMenuOpen && user && (
        <div className={`md:hidden absolute left-0 right-0 bg-slate-800 z-40 shadow-lg rounded-b-md border-t border-slate-700 top-16`}> {/* Adjusted top to match h-16 */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {mainNavLinks.map(link => ( <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors ${pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard') ? 'bg-slate-950' : ''}`}>{link.name}</Link> ))}
            <Link href="/dashboard/subscription" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-brand-accent hover:bg-slate-700 hover:text-orange-300 transition-colors">Join Echo Pro</Link>
            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">Logout ({user.name})</button>
          </div>
        </div>
      )}
    </nav>
  );
}