"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api'; 
import Link from 'next/link';
import { FaFlagCheckered, FaRocket, FaTrophy, FaLightbulb, FaStar } from 'react-icons/fa';

const AchievementCard = ({ title, description, icon, achieved, date, ctaLink, ctaText }) => (
  <div className={`p-6 rounded-xl shadow-interactive transition-all duration-300 transform hover:-translate-y-1 ${achieved ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 hover:shadow-interactive-hover' : 'bg-brand-bg-alt border border-gray-200 opacity-70'}`}>
    <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
      <div className={`text-5xl ${achieved ? 'text-green-500' : 'text-gray-400'}`}>{icon}</div>
      <div className="flex-1">
        <h3 className={`text-lg font-semibold ${achieved ? 'text-green-700' : 'text-brand-text-muted'}`}>{title}</h3>
        <p className={`text-sm mt-1 ${achieved ? 'text-green-600' : 'text-brand-text-muted'}`}>{description}</p>
        {achieved && date && <p className="text-xs text-brand-text-muted mt-2">Achieved: {new Date(date).toLocaleDateString()}</p>}
        {!achieved && ctaLink && ctaText && (
            <Link href={ctaLink} className="mt-3 inline-block bg-brand-accent hover:bg-brand-accent-dark text-white text-xs font-semibold py-1.5 px-3 rounded-md shadow-sm transition-colors">
                {ctaText}
            </Link>
        )}
      </div>
    </div>
  </div>
);

export default function MyJourneyPage() {
  const { user: authUser, loading: authContextLoading } = useAuth(); 
  const [journeyData, setJourneyData] = useState({ userDetails: null, campaigns: [] });
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authContextLoading) { setPageLoading(true); return; }
    if (!authUser) { setPageLoading(false); return; }

    const fetchData = async () => {
      setPageLoading(true); setError(null);
      try {
        const userDetailsResponse = await api.get('/auth/me');
        const campaignResponse = await api.get('/campaigns/history');
        
        setJourneyData({
            userDetails: userDetailsResponse.data,
            campaigns: campaignResponse.data || []
        });
      } catch (err) {
        console.error("Error fetching journey data:", err);
        setError(err.response?.data?.message || "Failed to load your journey details. Please try again.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [authUser, authContextLoading]);

  const achievements = useMemo(() => {
    const { userDetails, campaigns } = journeyData;
    if (!userDetails) return [];
    
    const firstCampaignLaunched = campaigns && campaigns.length > 0;
    const sortedCampaigns = campaigns ? [...campaigns].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) : [];
    const firstCampaignDate = firstCampaignLaunched ? sortedCampaigns[0].createdAt : null;

    return [
      { id: 1, title: "Joined EchoCRM!", description: "Welcome aboard! You started your CRM journey.", icon: <FaFlagCheckered />, achieved: true, date: userDetails.createdAt },
      { id: 2, title: "Launched Your First Campaign", description: "You're officially a campaign commander!", icon: <FaRocket />, achieved: firstCampaignLaunched, date: firstCampaignDate, ctaLink: '/dashboard/campaigns/new', ctaText: 'Create Campaign' },
      { id: 3, title: "Created 5 Campaigns", description: `You've launched ${userDetails.campaignCount || 0} out of 5 campaigns.`, icon: <FaTrophy />, achieved: (userDetails.campaignCount || 0) >= 5, date: null, ctaLink: '/dashboard/campaigns/new', ctaText: 'Create More' },
      { id: 4, title: "Used AI Suggestions", description: "Leveraging smart data for better decisions.", icon: <FaLightbulb />, achieved: false, date: null, ctaLink: '/dashboard/campaigns/new', ctaText: 'Try AI Features' },
      { id: 5, title: "Upgraded to EchoCRM Pro", description: "Unlocking unlimited potential!", icon: <FaStar />, achieved: userDetails.isSubscribed, date: null, ctaLink: '/dashboard/subscription', ctaText: 'Explore Pro' },
    ];
  }, [journeyData]);

  if (pageLoading || authContextLoading) {
    return (
      <div className="text-center p-10 min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-brand-text-light">Charting Your Progress...</p>
      </div>
    );
  }
  
  if (error) {
     return (
        <div className="text-center p-10 bg-red-50 rounded-lg shadow min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold text-brand-error mb-4">Oops! Could not load journey.</h2>
            <p className="text-brand-text-light mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-brand-primary text-white font-semibold py-2 px-5 rounded-lg shadow-interactive hover:bg-brand-primary-darker transition duration-150">
                Try Again
            </button>
        </div>
     );
  }
  
  if (!authUser) {
    return (
      <div className="text-center p-10 min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center bg-brand-bg-alt rounded-xl">
        <p className="text-xl font-semibold text-brand-text mb-3">Access Your Journey</p>
        <p className="text-brand-text-light mb-6">Please log in to view your achievements and progress.</p>
        <Link href="/login" className="inline-block bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg shadow-interactive hover:bg-brand-primary-darker transition duration-150 transform hover:scale-105">
          Login to Continue
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-text leading-tight mb-2 sm:mb-0">Your EchoCRM Journey, <span className="text-brand-primary">{journeyData.userDetails?.displayName}!</span></h1>
        <Link href="/dashboard" className="text-sm text-brand-primary hover:text-brand-primary-darker font-medium transition-colors">
            &larr; Back to Dashboard
        </Link>
      </div>

      <p className="text-brand-text-light mb-8 text-center text-lg leading-relaxed max-w-2xl mx-auto">
        Track your milestones and celebrate your progress. Every step forward helps you connect better with your customers!
      </p>

      {achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {achievements.map(ach => (
            <AchievementCard 
              key={ach.id} 
              title={ach.title} 
              description={ach.description} 
              icon={ach.icon} 
              achieved={ach.achieved}
              date={ach.date}
              ctaLink={ach.ctaLink}
              ctaText={ach.ctaText}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-brand-text-light py-8">Your journey is just beginning! Start creating campaigns to unlock achievements.</p>
      )}
    </div>
  );
}