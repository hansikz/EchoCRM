// File: EchoCRM/frontend/app/(auth)/login/page.jsx
"use client";
import React, { Suspense } from 'react'; // Import Suspense
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// A simple loading component to use as a fallback for Suspense
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-brand-bg-alt -mt-14 sm:-mt-16">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Create a new component for the actual login form logic.
// This is the component that will use the useSearchParams hook.
function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  let errorMessage = '';

  if (errorParam) {
    switch (errorParam) {
      case 'google_auth_failed':
      case 'google_auth_failed_in_callback':
        errorMessage = 'Google authentication failed. Please try again.';
        break;
      case 'auth_failed_no_user':
      case 'auth_failed_critical_missing_user':
        errorMessage = 'Authentication failed: User information not found after login.';
        break;
      case 'auth_failed':
         errorMessage = 'Authentication process could not be completed.';
         break;
      case 'session_expired':
          errorMessage = 'Your session has expired. Please log in again.';
          break;
      default:
        errorMessage = 'An unknown authentication error occurred.';
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
           <span className="text-3xl font-bold text-brand-primary hover:text-brand-primary-darker transition-colors">{process.env.NEXT_PUBLIC_APP_NAME || "EchoCRM"}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-brand-text">Welcome Back!</h1>
        <p className="mb-6 text-brand-text-secondary">
          Sign in with your Google account to continue to your EchoCRM dashboard.
        </p>

        {errorMessage && (
          <p className="mb-4 text-sm text-brand-error bg-red-50 p-3 rounded-md border border-red-200">
            {errorMessage}
          </p>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-light focus:ring-opacity-50"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5.03,16.26 5.03,12.55C5.03,8.84 8.36,5.83 12.19,5.83C14.03,5.83 15.69,6.46 16.91,7.55L19.07,5.5C17.22,3.92 14.91,3.06 12.19,3.06C7.03,3.06 3,7.3 3,12.55C3,17.79 7.03,22.04 12.19,22.04C16.81,22.04 21.35,18.92 21.35,14.08C21.35,13.09 21.35,12.09 21.35,11.1V11.1Z"/>
          </svg>
          Sign in with Google
        </button>
        <p className="mt-8 text-xs text-brand-text-muted">
          By signing in, you agree to EchoCRM's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

// The main Page component now wraps our form in a Suspense boundary.
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}