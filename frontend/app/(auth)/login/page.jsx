"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginPageContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  let errorMessage = '';

  if (errorParam) {
    // example error message logic
    switch (errorParam) {
      case 'Unauthorized':
        errorMessage = 'Unauthorized access. Please try again.';
        break;
      case 'InvalidRequest':
        errorMessage = 'Invalid request. Please try again.';
        break;
      default:
        errorMessage = 'An unexpected error occurred. Please try again.';
    }
  }

  const handleGoogleLogin = () => {
    const backendRoot = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
    window.location.href = `${backendRoot}/api/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-brand-bg-alt -mt-14 sm:-mt-16">
      <div className="p-8 sm:p-10 bg-white shadow-2xl rounded-xl text-center w-full max-w-md border border-gray-200">
        <Link href="/" className="inline-block mb-6">
          <span className="text-3xl font-bold text-brand-primary hover:text-brand-primary-darker transition-colors">
            {process.env.NEXT_PUBLIC_APP_NAME || "EchoCRM"}
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-brand-text">Welcome Back!</h1>
        <p className="mb-6 text-brand-text-light">
          Sign in with your Google account to continue to your EchoCRM dashboard.
        </p>
        {errorMessage && (
          <p className="mb-4 text-sm text-brand-error bg-red-50 p-3 rounded-md border border-red-200">
            {errorMessage}
          </p>
        )}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-brand-primary hover:bg-brand-primary-darker text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
