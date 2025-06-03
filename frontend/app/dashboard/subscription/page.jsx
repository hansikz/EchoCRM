"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

const FREE_TIER_LIMIT = 10;

export default function SubscriptionPage() {
  const { user: authContextUser } = useAuth(); 
  const [currentUserPlan, setCurrentUserPlan] = useState({
    name: "Free Tier",
    isPro: false,
    campaignLimit: FREE_TIER_LIMIT,
    currentCampaignCount: 0,
    aiSuggestions: "Basic",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserSubscriptionDetails = async () => {
      if (authContextUser) { // Check if authContextUser exists
        try {
          setLoading(true);
          setError('');
          const response = await api.get('/auth/me'); // Fetch fresh user details
          const userData = response.data;

          setCurrentUserPlan({
            name: userData.isSubscribed ? "EchoCRM Pro" : "Free Tier",
            isPro: userData.isSubscribed,
            campaignLimit: userData.isSubscribed ? "Unlimited" : FREE_TIER_LIMIT,
            currentCampaignCount: userData.campaignCount || 0,
            aiSuggestions: userData.isSubscribed ? "Advanced & Priority" : "Basic",
          });
        } catch (err) {
          console.error("Error fetching user subscription details:", err);
          setError("Could not load your subscription details. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); 
      }
    };
    fetchUserSubscriptionDetails();
  }, [authContextUser]); 

  const handleUpgradeClick = () => {
    alert('Thank you for your interest! Payment gateway integration is coming soon to complete your upgrade.');
  };

  if (loading) {
    return (
        <div className="text-center p-10 min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-brand-text-light">Loading Your Subscription Details...</p>
        </div>
    );
  }

  if (error) {
     return (
        <div className="text-center p-10 bg-red-50 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-brand-error mb-4">Error</h2>
            <p className="text-brand-text-light mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-brand-primary text-white font-semibold py-2 px-5 rounded-lg shadow-interactive hover:bg-brand-primary-darker transition duration-150">
                Try Again
            </button>
        </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto p-0 sm:p-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-brand-text mb-10 text-center">Manage Your EchoCRM Plan</h1>

      {error && <p className="mb-6 text-center text-sm text-brand-error bg-red-50 p-3 rounded-lg">{error}</p>}

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Free Tier Card */}
        <div className={`p-8 rounded-xl shadow-xl border-2 transition-all duration-300 ${!currentUserPlan.isPro ? 'border-brand-primary ring-4 ring-brand-primary-light' : 'border-gray-200 bg-gray-50 opacity-80 hover:opacity-100'}`}>
          <div className="relative">
            <h2 className="text-2xl font-semibold text-brand-text mb-3">Free Tier</h2>
            {!currentUserPlan.isPro && (
              <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full absolute top-0 right-0 -mt-3 -mr-3 shadow-lg">
                CURRENT PLAN
              </span>
            )}
          </div>
          <p className="text-4xl font-bold text-brand-text mb-1">$0 <span className="text-lg font-normal text-brand-text-muted">/ month</span></p>
          <p className="text-brand-text-light mb-6 min-h-[40px]">Ideal for individuals and small teams getting started.</p>
          <ul className="text-left text-brand-text-light space-y-2.5 mb-8">
            <li className="flex items-start"><span className="text-brand-primary mr-2 mt-1">✓</span>Up to {FREE_TIER_LIMIT} Campaigns</li>
            <li className="flex items-start"><span className="text-brand-primary mr-2 mt-1">✓</span>Standard Audience Segmentation</li>
            <li className="flex items-start"><span className="text-brand-primary mr-2 mt-1">✓</span>Basic AI Message & Subject Suggestions</li>
            <li className="flex items-start"><span className="text-brand-primary mr-2 mt-1">✓</span>Community Forum Support</li>
          </ul>
          {!currentUserPlan.isPro && (
            <div>
              <p className="text-sm text-brand-text-muted mb-1">
                Campaigns used: {currentUserPlan.currentCampaignCount} / {currentUserPlan.campaignLimit}
              </p>
              <div className="mt-1 h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-primary-light to-brand-primary h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${(currentUserPlan.currentCampaignCount / FREE_TIER_LIMIT) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Pro Tier Card */}
        <div className={`p-8 rounded-xl shadow-xl border-2 transition-all duration-300 ${currentUserPlan.isPro ? 'border-brand-accent ring-4 ring-brand-accent-light' : 'border-gray-200 bg-white hover:border-brand-accent'}`}>
          <div className="relative">
            <h2 className="text-2xl font-semibold text-brand-accent mb-3">EchoCRM Pro</h2>
            {currentUserPlan.isPro && (
              <span className="bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full absolute top-0 right-0 -mt-3 -mr-3 shadow-lg">
                CURRENT PLAN
              </span>
            )}
          </div>
          <p className="text-4xl font-bold text-brand-text mb-1">$20 <span className="text-lg font-normal text-brand-text-muted">/ month</span></p>
          <p className="text-brand-text-light mb-6 min-h-[40px]">For growing businesses needing more power and insights.</p>
          <ul className="text-left text-brand-text-light space-y-2.5 mb-8">
            <li className="flex items-start"><span className="text-brand-accent mr-2 mt-1">✓</span>Unlimited Campaigns</li>
            <li className="flex items-start"><span className="text-brand-accent mr-2 mt-1">✓</span>Advanced AI Insights & Suggestions</li>
            <li className="flex items-start"><span className="text-brand-accent mr-2 mt-1">✓</span>Advanced Audience Segmentation</li>
            <li className="flex items-start"><span className="text-brand-accent mr-2 mt-1">✓</span>Priority Email Support</li>
            <li className="flex items-start"><span className="text-brand-accent mr-2 mt-1">✓</span>Early Access to New Features</li>
          </ul>
          {!currentUserPlan.isPro ? (
            <button 
              onClick={handleUpgradeClick}
              className="w-full bg-brand-accent hover:bg-brand-accent-darker text-white font-bold py-3.5 px-6 rounded-lg text-lg shadow-interactive hover:shadow-interactive-hover transition duration-150 transform hover:scale-105"
            >
              Upgrade to Pro
            </button>
          ) : (
            <button 
              disabled 
              className="w-full bg-gray-300 text-gray-500 font-bold py-3.5 px-6 rounded-lg text-lg cursor-not-allowed"
            >
              Your Active Plan
            </button>
          )}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/dashboard" className="text-brand-primary hover:text-brand-primary-darker font-medium transition-colors inline-flex items-center group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform transition-transform duration-150 group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}