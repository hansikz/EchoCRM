"use client";
import React from 'react';
import Link from 'next/link';

export default function CustomerActivityPage() {
  const hasActivity = false; 

  return (
    <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl min-h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-brand-text">Customer Activity Center</h1>
        {/* Placeholder for future actions like "Import Customers" */}
      </div>

      {hasActivity ? (
        <div>
          <p className="text-brand-text-light">Detailed customer activity logs and analytics will be presented here.</p>
          {/* Add tables, charts, filters for customer activity */}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-12 bg-brand-bg-alt rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-brand-text-muted opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h2 className="mt-6 text-2xl font-semibold text-brand-text">No Customer Activity Yet</h2>
          <p className="mt-2 text-brand-text-light max-w-md">
            This section will light up with insights once your customers begin interacting with campaigns or your platform.
          </p>
          <Link href="/dashboard" className="mt-8 inline-block bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg shadow-interactive hover:bg-brand-primary-darker transition duration-150 transform hover:scale-105">
            &larr; Return to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}