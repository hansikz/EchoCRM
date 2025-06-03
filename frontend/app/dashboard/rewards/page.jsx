"use client";
import React from 'react';
import Link from 'next/link';

export default function RewardsPage() {
  const campaignsWithRewards = [
    { id: 'campaign1', name: 'Summer Sale Extravaganza 2024', rewardDescription: 'Top 5% of spenders received an exclusive 25% discount voucher, automatically applied to their next order.', icon: '🏆' },
    { id: 'campaign2', name: 'Loyalty Program Launch - Q3', rewardDescription: 'All customers making 3+ purchases this quarter earned double loyalty points.', icon: '💎' },
    { id: 'campaign3', name: 'Refer-a-Friend Bonus', rewardDescription: 'Both referrer and referred friend received a $10 store credit upon successful referral.', icon: '🎁' },
  ];

  return (
    <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl min-h-[calc(100vh-12rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-brand-text mb-3 sm:mb-0">Campaign Rewards Ledger</h1>
        <Link href="/dashboard" className="text-sm text-brand-primary hover:text-brand-primary-darker font-medium transition-colors">
            &larr; Back to Dashboard
        </Link>
      </div>
      
      {campaignsWithRewards.length > 0 ? (
        <div className="space-y-8">
          {campaignsWithRewards.map(campaign => (
            <div key={campaign.id} className="p-6 border border-gray-200 rounded-lg shadow-interactive hover:shadow-interactive-hover bg-gradient-to-r from-brand-primary-lightest via-sky-50 to-purple-50 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex items-start space-x-4">
                <span className="text-4xl opacity-80">{campaign.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-brand-primary-darker mb-2">{campaign.name}</h2>
                  <p className="text-brand-text-light leading-relaxed"><strong>Reward Implemented:</strong> {campaign.rewardDescription}</p>
                  {/* Future: Add stats like "Rewards Claimed", "Impact on CLTV" */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-brand-text-muted opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-2xl font-medium text-brand-text">No Reward Programs Tracked</h2>
          <p className="mt-2 text-brand-text-light">Details about rewards tied to your campaigns will appear here.</p>
        </div>
      )}
      {}
    </div>
  );
}