"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import api from '@/services/api'; // Your API service

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await api.get('/campaigns/history');
        setCampaigns(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching campaign history:", err);
        setError(err.response?.data?.message || 'Failed to load campaign history.');
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10">
        <div className="mx-auto w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-3">Loading campaigns...</p>
      </div>
    );
  }

  if (error) return <div className="text-center p-10 text-red-600 bg-red-100 rounded-md">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
        <Link href="/dashboard/campaigns/new" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-150">
            + Create New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-500">No campaigns found yet.</p>
          <p className="mt-2 text-gray-400">Start by creating your first campaign!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-indigo-700 mb-1">{campaign.name || 'Untitled Campaign'}</h2>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    campaign.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    campaign.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                    campaign.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                }`}>
                    {campaign.status || 'DRAFT'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Objective: {campaign.objective || 'N/A'}</p>
              <p className="text-xs text-gray-400 mb-3">
                Created: {new Date(campaign.createdAt).toLocaleDateString()}
                {campaign.lastLaunchedAt && ` | Last Launched: ${new Date(campaign.lastLaunchedAt).toLocaleDateString()}`}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                  <div><span className="font-medium">Targeted:</span> {campaign.audienceSize || 0}</div>
                  <div><span className="font-medium">Sent:</span> {campaign.sentCount || 0}</div>
                  <div><span className="font-medium">Delivered:</span> {campaign.deliveredCount || 0}</div>
                  <div><span className="font-medium">Failed:</span> {campaign.failedCount || 0}</div>
              </div>
              <Link href={`/dashboard/campaigns/${campaign._id}`} className="text-sm text-indigo-600 hover:text-indigo-800 mt-3 inline-block font-medium">
                View Details &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}