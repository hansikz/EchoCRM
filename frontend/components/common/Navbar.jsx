"use client";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar({ appName = "EchoCRM" }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/auth/callback');
  const navHeightClass = "h-16"; // Consistent height

  // On route change, close the mobile menu
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!isMounted) return <div className={`${navHeightClass} w-full bg-white`}></div>;
  if (isAuthPage) return null;

  // Links to show in the navbar when a user is logged in
  const loggedInNavLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Campaigns', href: '/dashboard/campaigns' },
    { name: 'Subscription', href: '/dashboard/subscription' },
  ];

  // Links to show in the navbar when a user is logged out
  const loggedOutNavLinks = [
    { name: 'Features', href: '/#features' }, // Example link to a section on the homepage
    { name: 'Pricing', href: '/dashboard/subscription' }, // Link to subscription page
  ];

  return (
    <nav className={`bg-white text-brand-text p-4 fixed top-0 left-0 right-0 z-50 ${navHeightClass} flex items-center shadow-md border-b border-brand-border`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold text-brand-text hover:text-brand-primary transition-colors">
          {appName}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            // Logged In User Links
            loggedInNavLinks.map(link => (
              <Link key={link.name} href={link.href} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith(link.href) ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary'}`}>
                  {link.name}
              </Link>
            ))
          ) : (
            // Logged Out User Links
            loggedOutNavLinks.map(link => (
              <Link key={link.name} href={link.href} className="px-4 py-2 rounded-md text-sm font-medium hover:text-brand-primary transition-colors">
                  {link.name}
              </Link>
            ))
          )}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <button onClick={logout} className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Logout ({user.name})</button>
          ) : (
            <Link href="/login" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-5 rounded-lg shadow-interactive hover:shadow-interactive-hover transition-all duration-300">
              Login / Sign Up
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-brand-text hover:text-brand-primary">
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* --- CORRECTED MOBILE MENU DRAWER --- */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white z-40 shadow-lg rounded-b-md border-t border-brand-border">
          <div className="px-3 pt-2 pb-4 space-y-2">
            {user ? (
              // Logged In Mobile Links
              <>
                {loggedInNavLinks.map(link => (
                  <Link key={link.name} href={link.href} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${pathname.startsWith(link.href) ? 'text-brand-primary bg-blue-50' : 'hover:text-brand-primary hover:bg-gray-50'}`}>
                      {link.name}
                  </Link>
                ))}
                <button onClick={logout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-brand-error hover:bg-red-50">Logout</button>
              </>
            ) : (
              // Logged Out Mobile Links
              <>
                {loggedOutNavLinks.map(link => (
                  <Link key={link.name} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium hover:text-brand-primary hover:bg-gray-50">
                      {link.name}
                  </Link>
                ))}
                 <Link href="/login" className="block text-center mt-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300">
                  Login / Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}