"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Ensure all icons are imported
import { FaRocket, FaGem, FaUserPlus, FaLightbulb, FaBullhorn, FaPlusCircle, FaHistory } from 'react-icons/fa';

// Tip data for the "Did You Know?" section
const crmTips = [
    "Personalize your campaign messages with `{{name}}` to boost engagement!",
    "Regularly review campaign performance to identify what works best for your audience.",
    "Use clear and compelling Call-to-Actions (CTAs) in your campaign messages.",
    "Segmenting your audience allows for more targeted and effective campaigns."
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [userMetrics, setUserMetrics] = useState({ activeCampaigns: 0, totalCustomers: 0 });
  const [quickSegmentQuery, setQuickSegmentQuery] = useState('');
  const [currentTip, setCurrentTip] = useState('');

  useEffect(() => {
    setCurrentTip(crmTips[Math.floor(Math.random() * crmTips.length)]);
  }, []);

  useEffect(() => {
    if (user) {
      setUserMetrics({ activeCampaigns: Math.floor(Math.random() * 3) + 1, totalCustomers: Math.floor(Math.random() * 200) + 50 });
    }
  }, [user]);

  useEffect(() => {
    if (user && userMetrics.totalCustomers > 0) {
      const mockSuggestions = [
        { id: 'sug1', title: `Optimize your ${userMetrics.activeCampaigns} active campaign(s)`, description: "Review performance and consider A/B testing messages.", link: "/dashboard/campaigns", icon: <FaRocket /> },
        { id: 'sug2', title: "Engage high-value customers", description: `You have an estimated ${Math.floor(userMetrics.totalCustomers * 0.15)} high-value customers. Plan an offer.`, link: "/dashboard/campaigns/new", icon: <FaGem /> },
        { id: 'sug3', title: "Grow your audience", description: "Explore strategies to attract new customers, like referral programs.", link: "/dashboard/customers", icon: <FaUserPlus /> },
      ];
      setAiSuggestions(mockSuggestions);
      setLoadingSuggestions(false);
    } else if (user) {
        setLoadingSuggestions(false);
        setAiSuggestions([]);
    }
  }, [user, userMetrics]);

  const handleQuickSegmentSubmit = (e) => {
    e.preventDefault();
    if (!quickSegmentQuery.trim()) return;
    let rules = [];
    const query = quickSegmentQuery.toLowerCase();
    const spendMatch = query.match(/spent over (\d+)/) || query.match(/spends > (\d+)/);
    const inactiveMatch = query.match(/inactive for (\d+) days/) || query.match(/last seen > (\d+) days/);
    if (spendMatch && spendMatch[1]) rules.push({ field: 'totalSpends', operator: '>', value: spendMatch[1], logical: '' });
    if (inactiveMatch && inactiveMatch[1]) rules.push({ field: 'lastSeenDays', operator: '>', value: inactiveMatch[1], logical: rules.length > 0 ? 'AND' : '' });
    if (rules.length > 0) {
      const rulesQuery = encodeURIComponent(JSON.stringify(rules));
      router.push(`/dashboard/campaigns/new?prefill_rules=${rulesQuery}&quick_query=${encodeURIComponent(quickSegmentQuery)}`);
    } else {
      alert("Could not understand the quick segment idea. Try phrases like 'spent over 5000' or 'inactive for 90 days'.");
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-brand-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-brand-text">
        Welcome back, <span className="text-brand-primary">{user?.name || 'User'}</span>!
      </h1>
      
      {/* Quick Segment Creator */}
      <section className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-brand-primary mb-4">Quick Campaign Start</h2>
        <form onSubmit={handleQuickSegmentSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-grow w-full">
            <label htmlFor="quickSegment" className="sr-only">Quick segment idea</label>
            <input 
              id="quickSegment"
              type="text"
              value={quickSegmentQuery}
              onChange={(e) => setQuickSegmentQuery(e.target.value)}
              placeholder="e.g., 'customers spent over 5000' or 'inactive for 90 days'"
              className="w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light focus:border-brand-primary sm:text-sm transition-colors"
            />
            <p className="text-xs text-brand-text-muted mt-1.5">Describe your target audience in a simple phrase.</p>
          </div>
          <button type="submit" className="w-full sm:w-auto bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg shadow-interactive hover:bg-brand-primary-darker transition duration-150 whitespace-nowrap transform hover:scale-105">
            Build Segment &rarr;
          </button>
        </form>
      </section>

      {/* AI Suggestions Section */}
      <section>
        {loadingSuggestions ? (
          <div className="p-6 bg-brand-bg-alt border border-gray-200 rounded-xl shadow-lg animate-pulse">
              <div className="h-7 bg-gray-300 rounded w-1/2 mb-5"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
          </div>
        ) : aiSuggestions.length > 0 ? (
          <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-brand-primary-dark mb-5 flex items-center">
              <FaLightbulb className="mr-3 text-yellow-400" /> Smart Insights & Next Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {aiSuggestions.map(rec => (
                <Link href={rec.link || "#"} key={rec.id} className="group block p-5 bg-white rounded-lg shadow-interactive hover:shadow-interactive-hover border border-gray-200 hover:border-brand-primary transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                      <span className="text-3xl mt-1 text-brand-primary opacity-70 group-hover:opacity-100 transition-opacity">{rec.icon}</span>
                    <div>
                      {/* --- THIS IS THE CORRECTED LINE --- */}
                      <h3 className="font-semibold text-brand-text text-md group-hover:text-brand-primary-dark transition-colors">{rec.title}</h3>
                      <p className="text-sm text-brand-text-secondary mt-1.5 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : ( 
          <div className="p-6 bg-brand-bg-alt border border-gray-200 rounded-xl shadow-md text-center">
              <p className="text-brand-text-light">No specific AI-driven suggestions at this moment.</p>
          </div>
        )}
      </section>
      
      {/* Did You Know Tip */}
      {currentTip && (
        <section className="p-6 bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-yellow-700 mb-2 flex items-center justify-center">
            <span className="text-2xl mr-2">🌟</span> Did You Know?
          </h3>
          <p className="text-yellow-800 text-sm leading-relaxed">{currentTip}</p>
        </section>
      )}

      {/* Dashboard Cards with updated styling */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col">
          <h2 className="text-2xl font-semibold mb-3 text-brand-primary flex items-center">
            <FaBullhorn className="mr-3" /> Manage Campaigns
          </h2>
          <p className="text-brand-text-secondary mb-5 text-sm flex-grow">Create, view, and analyze your marketing campaigns.</p>
          <div className="flex flex-col space-y-3">
            <Link href="/dashboard/campaigns/new" className="w-full text-center bg-brand-primary hover:bg-brand-primary-darker text-white font-medium py-2.5 px-5 rounded-lg transition duration-150 shadow-interactive hover:shadow-interactive-hover text-sm flex items-center justify-center">
              <FaPlusCircle className="mr-2" /> Create New
            </Link>
            <Link href="/dashboard/campaigns" className="w-full text-center bg-slate-200 hover:bg-slate-300 text-brand-text font-medium py-2.5 px-5 rounded-lg transition duration-150 shadow-interactive hover:shadow-interactive-hover text-sm flex items-center justify-center">
              <FaHistory className="mr-2" /> View History
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-semibold mb-3 text-green-600">Rewards Program</h2>
          <p className="text-brand-text-secondary mb-5 text-sm">Define and track customer loyalty.</p>
          <Link href="/dashboard/rewards" className="text-green-600 hover:text-green-700 font-medium text-sm inline-flex items-center">
            Manage Rewards <span className="ml-1">&rarr;</span>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">Your Progress</h2>
          <p className="text-brand-text-secondary mb-5 text-sm">Track milestones and achievements.</p>
          <Link href="/dashboard/my-journey" className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center">
            View My Journey <span className="ml-1">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}