"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaTrophy, FaGift, FaStar } from 'react-icons/fa';

export default function RewardsPage() {
  const { user, loading: authLoading } = useAuth();
  const [rewardsData, setRewardsData] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Wait for auth check to complete
    if (authLoading) {
      setPageLoading(true);
      return;
    }
    if (!user) {
      setPageLoading(false);
      return;
    }
    
    // Simulate fetching rewards data. In a real app, this would be an API call.
    const mockData = [
      { id: 'campaign1', name: 'Summer Sale Extravaganza 2024', rewardDescription: 'Top 5% of spenders received an exclusive 25% discount voucher.', icon: <FaTrophy />, achieved: true },
      { id: 'campaign2', name: 'Loyalty Program Launch - Q3', rewardDescription: 'All customers making 3+ purchases this quarter earned double loyalty points.', icon: <FaStar />, achieved: true },
      { id: 'campaign3', name: 'Upcoming: Holiday Special', rewardDescription: 'Customers who purchase over $200 will receive a free gift.', icon: <FaGift />, achieved: false },
    ];
    setRewardsData(mockData);
    setPageLoading(false);
  }, [user, authLoading]);

  if (pageLoading) {
    return (
      <div className="text-center p-10 min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-brand-text-light">Loading Rewards...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl min-h-[calc(100vh-12rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-brand-text mb-3 sm:mb-0">Campaign Rewards</h1>
        <Link href="/dashboard" className="text-sm text-brand-primary hover:text-brand-primary-darker font-medium transition-colors">
            &larr; Back to Dashboard
        </Link>
      </div>
      
      {rewardsData.length > 0 ? (
        <div className="space-y-8">
          {rewardsData.map(campaign => (
            <div key={campaign.id} className={`p-6 border rounded-lg shadow-interactive hover:shadow-interactive-hover transition-all duration-300 transform hover:scale-[1.01] ${campaign.achieved ? 'bg-gradient-to-br from-green-50 to-teal-50 border-green-200' : 'bg-gray-100 border-gray-200 opacity-80'}`}>
              <div className="flex items-start space-x-4">
                <span className={`text-4xl ${campaign.achieved ? 'text-green-500' : 'text-gray-400'}`}>{campaign.icon}</span>
                <div>
                  <h2 className={`text-xl font-semibold mb-2 ${campaign.achieved ? 'text-green-800' : 'text-brand-text-muted'}`}>{campaign.name}</h2>
                  <p className={`leading-relaxed ${campaign.achieved ? 'text-green-700' : 'text-brand-text-light'}`}>
                    <strong>Reward Status:</strong> {campaign.achieved ? 'Granted' : 'Planned / Not Unlocked'}
                  </p>
                  <p className={`leading-relaxed mt-1 ${campaign.achieved ? 'text-green-700' : 'text-brand-text-light'}`}>
                    <strong>Details:</strong> {campaign.rewardDescription}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-16">
          <h2 className="mt-4 text-2xl font-medium text-brand-text">No Reward Programs Tracked</h2>
          <p className="mt-2 text-brand-text-light">Details about rewards tied to your campaigns will appear here.</p>
        </div>
      )}
    </div>
  );
}