"use client";
import React from 'react';

export default function WhatsNewPage() {
  return (
    <div className="p-0 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">What's New in EchoCRM?</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-indigo-600">AI-Powered Message Suggestions (v1.2)</h2>
          <p className="text-gray-600 mt-1">
            Get creative message ideas based on your campaign objectives directly in the campaign creation flow.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-indigo-600">Enhanced Audience Preview (v1.1)</h2>
          <p className="text-gray-600 mt-1">
            See the estimated audience size for your segments before launching campaigns.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-indigo-600">Streamlined UI (v1.0)</h2>
          <p className="text-gray-600 mt-1">
            Enjoy a cleaner, more intuitive interface for managing your customer relationships.
          </p>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          (More updates and features coming soon!)
        </p>
      </div>
    </div>
  );
}