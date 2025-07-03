"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { FaMagic, FaLightbulb } from 'react-icons/fa';

// RuleBuilder Component (Handles audience segmentation rules)
const RuleBuilder = ({ rules, setRules }) => {
  const addRule = () => {
    const newRuleLogical = rules.length > 0 ? 'AND' : '';
    setRules([...rules, { field: 'totalSpends', operator: '>', value: '', logical: newRuleLogical }]);
  };
  const updateRule = (index, key, value) => {
    const newRules = [...rules]; newRules[index][key] = value; setRules(newRules);
  };
  const removeRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    if (newRules.length > 0 && newRules[0].logical) { newRules[0].logical = ''; }
    setRules(newRules);
  };
  return (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-slate-50 shadow-sm">
      {rules.length === 0 && (
        <p className="text-sm text-brand-text-muted text-center py-2">No audience rules defined yet. Click below to add one.</p>
      )}
      {rules.map((rule, index) => (
        <div key={index} className="p-3 border border-gray-300 rounded-md bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {index > 0 && (
              <select value={rule.logical} onChange={(e) => updateRule(index, 'logical', e.target.value)}
                className="w-full sm:w-auto p-2.5 border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-sm">
                <option value="AND">AND</option> <option value="OR">OR</option>
              </select>
            )}
            <select value={rule.field} onChange={(e) => updateRule(index, 'field', e.target.value)}
              className="w-full sm:w-auto p-2.5 border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-sm">
              <option value="totalSpends">Total Spends (INR)</option>
              <option value="visitCount">Visit Count</option>
              <option value="lastSeenDays">Days Since Last Seen</option>
              <option value="tags">Tags</option>
            </select>
            <select value={rule.operator} onChange={(e) => updateRule(index, 'operator', e.target.value)}
              className="w-full sm:w-auto p-2.5 border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-sm">
              <option value=">">&gt; (Greater than)</option><option value="<">&lt; (Less than)</option><option value="=">= (Equal to)</option>
              <option value=">=">&gt;= (Greater or equal)</option><option value="<=">&lt;= (Less or equal)</option><option value="!=">!= (Not equal to)</option>
              {rule.field === 'tags' && <option value="contains">contains</option>}
              {rule.field === 'tags' && <option value="notContains">does not contain</option>}
            </select>
            <input type={rule.field === 'tags' ? 'text' : 'number'} placeholder="Value" value={rule.value} onChange={(e) => updateRule(index, 'value', e.target.value)}
              className="flex-grow w-full p-2.5 border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-sm"/>
            <button type="button" onClick={() => removeRule(index)}
              className="w-full sm:w-auto bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 text-sm transition-colors shadow-interactive hover:shadow-interactive-hover">
              Remove
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addRule} className="bg-brand-primary hover:bg-brand-primary-dark text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-interactive hover:shadow-interactive-hover">
        + Add Audience Rule
      </button>
    </div>
  );
};

export default function NewCampaignPage() {
  const [campaignName, setCampaignName] = useState('');
  const [campaignObjective, setCampaignObjective] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [rules, setRules] = useState([]);
  
  const [audienceSize, setAudienceSize] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  
  const [messageSuggestions, setMessageSuggestions] = useState([]);
  const [loadingMessageSuggestions, setLoadingMessageSuggestions] = useState(false);
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);
  const [loadingSubjectSuggestions, setLoadingSubjectSuggestions] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const prefillRulesQuery = searchParams.get('prefill_rules');
    const quickQuery = searchParams.get('quick_query');
    if (prefillRulesQuery) {
      try {
        const parsedRules = JSON.parse(decodeURIComponent(prefillRulesQuery));
        if (Array.isArray(parsedRules) && parsedRules.length > 0) {
          setRules(parsedRules);
          if (quickQuery) {
            setCampaignName(`Campaign for "${decodeURIComponent(quickQuery)}"`);
          }
        }
      } catch (e) {
        console.error("Failed to parse prefill_rules:", e);
        setError("Could not apply quick segment rules. Please define them manually.");
      }
    }
  }, [searchParams]);

  const handlePreviewAudience = async () => {
    if (!rules || rules.length === 0 || rules.some(rule => !rule.value.toString().trim())) {
      setError("Please define all rule values completely before previewing.");
      return;
    }
    setError(''); setLoadingPreview(true); setAudienceSize(null);
    try {
      // CORRECTED: Removed /api prefix
      const response = await api.post('/segments/preview', { rules });
      setAudienceSize(response.data.count);
    } catch (err) {
      setError(`Error previewing audience: ${err.response?.data?.message || err.message}`);
      setAudienceSize(0);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleGetAISuggestions = async (type) => {
    if (!campaignObjective.trim() && (type === 'message' || (type === 'subject' && !campaignMessage.trim()))) {
      setError("Please enter a campaign objective to get AI suggestions.");
      return;
    }
    setError('');
    if (type === 'message') setLoadingMessageSuggestions(true);
    if (type === 'subject') setLoadingSubjectSuggestions(true);
    try {
      const payload = { objective: campaignObjective, type };
      if (type === 'subject') payload.message = campaignMessage;
      // CORRECTED: Removed /api prefix
      const response = await api.post('/ai/suggest-messages', payload);
      const suggestions = response.data || [];
      if (type === 'message') {
        setMessageSuggestions(suggestions);
        if (suggestions.length > 0 && !campaignMessage) setCampaignMessage(suggestions[0].text);
      } else if (type === 'subject') {
        setSubjectSuggestions(suggestions);
        if (suggestions.length > 0 && !campaignSubject) setCampaignSubject(suggestions[0].text);
      }
    } catch (err) {
      setError(`AI ${type} suggestions failed: ${err.response?.data?.message || err.message}`);
    } finally {
      if (type === 'message') setLoadingMessageSuggestions(false);
      if (type === 'subject') setLoadingSubjectSuggestions(false);
    }
  };

  const handleSubmitCampaign = async (e) => {
    e.preventDefault();
    if (!campaignName.trim() || !campaignMessage.trim() || rules.length === 0 || rules.some(r => !r.value.toString().trim())) {
      setError("Campaign Title, Message, and fully defined Audience Rules are required.");
      return;
    }
    if (audienceSize === 0 && audienceSize !== null) {
      if (!confirm("Audience preview resulted in 0 customers. This campaign will not reach anyone. Do you still want to save this campaign definition? (It will not be launched immediately)")) {
        setIsSubmitting(false);
        return;
      }
    }
    setError(''); setSuccessInfo(null); setIsSubmitting(true);
    try {
      const payload = { name: campaignName, objective: campaignObjective, rules, message: campaignMessage };
      // CORRECTED: Removed /api prefix
      const response = await api.post('/campaigns/create', payload);
      setSuccessInfo({
        message: `Campaign "${response.data.campaignName}" created and queued!`,
        campaignId: response.data.campaignId,
        count: response.data.campaignCount,
        limit: response.data.limit,
        isPro: response.data.limit === null
      });
      alert(`Campaign "${response.data.campaignName}" has been successfully created!`);
      setTimeout(() => { router.push('/dashboard/campaigns'); }, 1500);
    } catch (err) {
      const apiErrorMessage = err.response?.data?.message || err.message;
      setError(`Campaign creation failed: ${apiErrorMessage}`);
      if (err.response?.data?.limitReached) {
        setError(prev => `${prev} Please upgrade to create more campaigns.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-2xl border border-slate-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-text">Create New Campaign</h1>
        <Link href="/dashboard/campaigns" className="text-sm text-brand-primary hover:text-brand-primary-darker font-medium transition-colors">
            &larr; Back to Campaigns
        </Link>
      </div>

      {error && <div className="mb-6 text-sm text-red-700 bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>}
      {successInfo && (
        <div className="mb-6 text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="font-semibold">{successInfo.message}</p>
          <p>Campaigns created: {successInfo.count} / {successInfo.isPro ? 'Unlimited (Pro)' : successInfo.limit}</p>
          <Link href={`/dashboard/campaigns/${successInfo.campaignId}`} className="text-brand-primary hover:underline font-semibold mt-1 inline-block">View Campaign Details &rarr;</Link>
        </div>
      )}
      
      <form onSubmit={handleSubmitCampaign} className="space-y-8">
        {/* All form fields and JSX are the same from response #71, no changes needed here */}
        {/* ... */}
         <div className="space-y-1">
          <label htmlFor="campaignName" className="block text-md font-semibold text-brand-text-secondary">
            Campaign Title <span className="text-red-500">*</span>
          </label>
          <input type="text" id="campaignName" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} required
            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light focus:border-brand-primary sm:text-sm transition-colors"/>
        </div>

        <div className="space-y-1">
          <label htmlFor="campaignObjective" className="block text-md font-semibold text-brand-text-secondary">
            Campaign Objective <span className="text-xs text-brand-text-muted">(for AI & tracking)</span>
          </label>
          <input type="text" id="campaignObjective" value={campaignObjective} onChange={(e) => setCampaignObjective(e.target.value)}
            placeholder="e.g., Win back inactive users"
            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light focus:border-brand-primary sm:text-sm transition-colors"/>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-brand-text-secondary mb-2">Target Audience <span className="text-red-500">*</span></h2>
          <RuleBuilder rules={rules} setRules={setRules} />
          <div className="mt-4 flex items-center space-x-4">
            <button type="button" onClick={handlePreviewAudience} disabled={loadingPreview || rules.length === 0 || rules.some(r => !r.value.toString().trim())}
              className="bg-slate-500 hover:bg-slate-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm disabled:opacity-60 transition duration-150 shadow-interactive hover:shadow-interactive-hover">
              {loadingPreview ? 'Calculating...' : 'Preview Audience'}
            </button>
            {audienceSize !== null && <p className="text-brand-text-light text-sm">Est. Audience: <strong className="text-lg text-brand-text">{audienceSize}</strong> customer(s)</p>}
          </div>
        </div>
        
        <div className="space-y-1">
            <label htmlFor="campaignSubject" className="block text-md font-semibold text-brand-text-secondary">
                Subject Line <span className="text-xs text-brand-text-muted">(For Email Campaigns)</span>
            </label>
            <div className="flex items-center space-x-2 mt-1">
                <input type="text" id="campaignSubject" value={campaignSubject} onChange={(e) => setCampaignSubject(e.target.value)}
                placeholder="e.g., 🎉 A special offer just for you, {{name}}!"
                className="flex-grow block w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light focus:border-brand-primary sm:text-sm transition-colors"/>
                <button type="button" onClick={() => handleGetAISuggestions('subject')} disabled={(!campaignObjective.trim() && !campaignMessage.trim()) || loadingSubjectSuggestions}
                title="Get AI Subject Line Suggestions"
                className="bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold py-3 px-4 rounded-lg text-sm disabled:opacity-60 transition duration-150 shadow-interactive hover:shadow-interactive-hover whitespace-nowrap flex items-center">
                  <FaMagic className="mr-2" /> {loadingSubjectSuggestions ? '...' : 'AI Subjects'}
                </button>
            </div>
            {subjectSuggestions.length > 0 && (
              <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-brand-text-muted">AI Suggestions (click to use):</p>
                  <div className="flex flex-wrap gap-2">
                      {subjectSuggestions.map(suggestion => (
                      <button type="button" key={suggestion.id} onClick={() => setCampaignSubject(suggestion.text)}
                          className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2.5 py-1.5 rounded-md transition-colors shadow-sm hover:shadow-md">
                          {suggestion.text}
                      </button>
                      ))}
                  </div>
              </div>
            )}
        </div>

        <div className="space-y-1">
          <label htmlFor="campaignMessage" className="block text-md font-semibold text-brand-text-secondary">
            Message / Content <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2 mt-1">
            <textarea id="campaignMessage" rows="5" value={campaignMessage} onChange={(e) => setCampaignMessage(e.target.value)} required
              placeholder="e.g., Hi {{name}}, here’s 10% off on your next order!"
              className="flex-grow block w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light focus:border-brand-primary sm:text-sm transition-colors"></textarea>
            <button type="button" onClick={() => handleGetAISuggestions('message')} disabled={!campaignObjective.trim() || loadingMessageSuggestions}
              title="Get AI Message Suggestions based on objective"
              className="bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold py-3 px-4 rounded-lg text-sm disabled:opacity-60 transition duration-150 shadow-interactive hover:shadow-interactive-hover whitespace-nowrap h-full self-stretch flex items-center">
              <FaLightbulb className="mr-2" /> {loadingMessageSuggestions ? '...' : 'AI Messages'}
            </button>
          </div>
          {messageSuggestions.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-brand-text-muted">AI Suggestions (click to use):</p>
              <div className="flex flex-wrap gap-2">
                {messageSuggestions.map(suggestion => (
                  <button type="button" key={suggestion.id} onClick={() => setCampaignMessage(suggestion.text)}
                    className="text-xs bg-teal-50 text-teal-800 hover:bg-teal-100 px-2.5 py-1.5 rounded-md transition-colors shadow-sm hover:shadow-md">
                    {suggestion.text.substring(0, 70)}{suggestion.text.length > 70 ? '...' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-brand-text-muted mt-1">Use personalization tags like {'{{name}}'}.</p>
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-brand-success hover:bg-green-600 text-white font-bold py-3.5 px-5 rounded-lg text-lg shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 transition duration-200 transform hover:scale-105"
        >
          {isSubmitting ? 
            (<span className="flex items-center justify-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creating & Launching...</span>) : 
            'Save & Launch Campaign'
          }
        </button>
      </form>
    </div>
  );
}