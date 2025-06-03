"use client";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect, useState } from 'react';

const crmTips = [
    "Personalize your campaign messages with `{{name}}` to boost engagement!",
    "Regularly review campaign performance to identify what works best for your audience.",
    "Use clear and compelling Call-to-Actions (CTAs) in your campaign messages."
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const [currentTip, setCurrentTip] = useState('');

  useEffect(() => {
    setCurrentTip(crmTips[Math.floor(Math.random() * crmTips.length)]);
  }, []);

  const pageStyle = {
    backgroundImage: `url('/images/homepage-bg.jpg')`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed', 
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center text-center p-6 bg-gray-800 text-white">
        <p className="text-xl">Loading EchoCRM...</p>
        <div className="mt-4 w-12 h-12 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      style={pageStyle}
      className="w-full flex-grow flex flex-col items-center justify-center text-white relative px-4"
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div> 
      <div className="relative z-10 flex flex-col items-center justify-center p-6 w-full max-w-4xl text-center">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-yellow-200" 
          style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(255,223,186,0.3)' }} 
        >
          Welcome to EchoCRM!
        </h1>
        <p 
          className="text-lg sm:text-xl md:text-2xl mb-10 leading-relaxed" 
          style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
        >
          Segment customers, deliver personalized campaigns, and gain intelligent insights with ease.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-center w-full sm:w-auto justify-center">
          {user ? (
            <Link href="/dashboard" className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-3.5 px-10 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-lg transform hover:scale-105">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/login" className="w-full sm:w-auto bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold py-3.5 px-10 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-lg transform hover:scale-105">
              Login / Sign Up
            </Link>
          )}
        </div>

        {currentTip && (
          <section className="mt-16 p-6 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-2xl max-w-2xl w-full">
            <h3 className="text-xl font-semibold text-yellow-300 mb-3 flex items-center justify-center">
              <span className="text-2xl mr-2">💡</span> Did You Know?
            </h3>
            <p className="text-gray-100 text-sm leading-relaxed">{currentTip}</p>
          </section>
        )}

        <p className="mt-12 text-sm text-gray-300" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
          Modern tools for modern marketing.
        </p>
      </div>
    </div>
  );
}