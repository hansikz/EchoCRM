"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ConfettiEffect from '@/components/auth/ConfettiEffect';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("Authenticating...");

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');

    if (token && name) {
      login(token, decodeURIComponent(name));
      setShowConfetti(true);
      setMessage(`Welcome, ${decodeURIComponent(name)}! Redirecting...`);
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setMessage("Authentication failed. Redirecting to login...");
      const timer = setTimeout(() => {
        router.push('/login?error=auth_failed');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] -mt-16 sm:-mt-20"> {/* Adjust for navbar height */}
      {showConfetti && <ConfettiEffect />}
      <p className="text-xl text-gray-700">{message}</p>
      {/* You can add a more sophisticated loader here */}
      <div className="mt-4 w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}