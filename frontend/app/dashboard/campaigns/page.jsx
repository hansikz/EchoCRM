"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { FaPlusCircle, FaHistory } from 'react-icons/fa';

export default function CampaignsPage() {
  const { user, loading: authLoading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) {
      setPageLoading(true);
      return;
    }
    if (!user) {
      setPageLoading(false);
      return;
    }

    const fetchCampaigns = async () => {
      setPageLoading(true);
      setError(null);
      try {
        const response = await api.get('/campaigns/history');
        setCampaigns(response.data);
      } catch (err) {
        console.error("Error fetching campaign history:", err);
        setError(err.response?.data?.message || 'Failed to load campaign history.');
        setCampaigns([]);
      } finally {
        setPageLoading(false);
      }
    };
    fetchCampaigns();
  }, [user, authLoading]);

  if (pageLoading) {
    return (
      <div className="text-center p-10">
        <div className="mx-auto w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-brand-text-light">Loading Campaigns...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 bg-red-50 rounded-lg shadow"><p className="text-brand-error font-semibold">Error: {error}</p></div>;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-brand-text mb-3 sm:mb-0">Campaign History</h1>
        <Link href="/dashboard/campaigns/new" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2.5 px-5 rounded-lg shadow-interactive hover:shadow-interactive-hover transition-all duration-300 transform hover:scale-105 inline-flex items-center">
            <FaPlusCircle className="mr-2" />
            Create New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-brand-bg-alt rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-brand-text-muted opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 className="mt-4 text-2xl font-semibold text-brand-text">No Campaigns Found</h2>
          <p className="mt-2 text-brand-text-secondary">Start by creating your first campaign to engage your customers!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-brand-primary hover:text-brand-primary-dark mb-1">
                    <Link href={`/dashboard/campaigns/${campaign._id}`}>{campaign.name || 'Untitled Campaign'}</Link>
                  </h2>
                  <p className="text-sm text-brand-text-light mb-2">Objective: {campaign.objective || 'Not specified'}</p>
                </div>
                <span className={`mt-2 sm:mt-0 text-xs font-semibold px-3 py-1.5 rounded-full self-start ${
                    campaign.status === 'COMPLETED' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
                    campaign.status === 'ACTIVE' || campaign.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' :
                    'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
                }`}>
                    {campaign.status || 'DRAFT'}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-brand-text-secondary mb-3 sm:mb-0">
                  <div><span className="font-medium text-brand-text">Targeted:</span> {campaign.audienceSize || 0}</div>
                  <div><span className="font-medium text-brand-text">Sent:</span> {campaign.sentCount || 0}</div>
                  <div><span className="font-medium text-brand-text">Delivered:</span> {campaign.deliveredCount || 0}</div>
                  <div><span className="font-medium text-brand-text">Failed:</span> {campaign.failedCount || 0}</div>
                </div>
                <Link href={`/dashboard/campaigns/${campaign._id}`} className="text-sm bg-slate-200 hover:bg-slate-300 text-brand-text font-semibold py-2 px-4 rounded-md transition-colors w-full sm:w-auto text-center">
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}