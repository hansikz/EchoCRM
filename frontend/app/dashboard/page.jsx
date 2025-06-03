"use client";
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [userMetrics, setUserMetrics] = useState({ activeCampaigns: 0, totalCustomers: 0 });

  useEffect(() => {
    if (user) {
      setUserMetrics({ activeCampaigns: 2, totalCustomers: 157 });
    }
  }, [user]);

  useEffect(() => {
    if (user && userMetrics.totalCustomers > 0) {
      const mockSuggestions = [
        {
          id: 'sug1',
          title: userMetrics.activeCampaigns > 0 ? `Optimize your ${userMetrics.activeCampaigns} active campaign(s)` : "Launch your first campaign!",
          description: userMetrics.activeCampaigns > 0 ? "Review their performance and consider A/B testing messages for better engagement." : "Define an audience segment and create a compelling offer to get started.",
          link: userMetrics.activeCampaigns > 0 ? "/dashboard/campaigns" : "/dashboard/campaigns/new", // CHANGED
          icon: "🚀"
        },
        {
          id: 'sug2',
          title: "Engage your high-value customers",
          description: `You have a segment of ${Math.floor(userMetrics.totalCustomers * 0.15)} (est.) high-value customers. Plan a special offer for them.`,
          link: "/dashboard/campaigns/new", 
          icon: "💎"
        },
        {
          id: 'sug3',
          title: "Explore recent customer activity",
          description: "Check for new customer sign-ups or recent purchases to identify engagement opportunities.",
          link: "/dashboard/customers", 
          icon: "📈"
        },
      ];
      setAiSuggestions(mockSuggestions);
      setLoadingSuggestions(false);
    } else if (user) {
        setLoadingSuggestions(false);
        setAiSuggestions([]);
    }
  }, [user, userMetrics]);


  if (authLoading) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            <p className="ml-3 text-gray-700">Loading dashboard content...</p>
        </div>
    );
  }

  return (
    <div className="p-0 sm:p-2 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Welcome back, {user?.name || 'User'}!
      </h1>

      {loadingSuggestions ? (
         <div className="mb-8 p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="space-y-2">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
            </div>
        </div>
      ) : aiSuggestions.length > 0 ? (
        <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">✨ Smart Insights & Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiSuggestions.map(rec => (
              <Link href={rec.link || "#"} key={rec.id} className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 hover:border-indigo-400">
                <div className="flex items-start space-x-3">
                    <span className="text-2xl">{rec.icon}</span>
                    <div>
                        <h3 className="font-semibold text-indigo-600 text-md">{rec.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
            <p className="text-gray-600">No specific AI suggestions at this moment. Explore your campaigns or customer data!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-purple-700">Manage Campaigns</h2>
          <p className="text-gray-600 mb-4 text-sm md:text-base">Create, view, and analyze your marketing campaigns.</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Link href="/dashboard/campaigns/new" className="w-full sm:w-auto text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 text-sm">
              + Create New {}
            </Link>
            <Link href="/dashboard/campaigns" className="w-full sm:w-auto text-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150 text-sm">
              View History {}
            </Link>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-green-700">Rewards Program</h2>
          <p className="text-gray-600 mb-4 text-sm md:text-base">Define and manage customer loyalty. (Sample)</p>
          <Link href="/dashboard/rewards" className="text-green-600 hover:text-green-800 font-medium text-sm md:text-base">
            Manage Rewards &rarr; {}
          </Link>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-blue-700">Your Progress</h2>
          <p className="text-gray-600 mb-4 text-sm md:text-base">Track milestones and achievements. (Sample)</p>
          <Link href="/dashboard/my-journey" className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base">
            View My Journey &rarr; {}
          </Link>
        </div>
      </div>
    </div>
  );
}