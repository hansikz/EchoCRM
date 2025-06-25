"use client";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { FaChartLine, FaBullhorn, FaLightbulb, FaUserShield, FaCog, FaRocket } from 'react-icons/fa';

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
    <div className="text-brand-primary text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-brand-text mb-3">{title}</h3>
    <p className="text-brand-text-secondary leading-relaxed">{children}</p>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="w-full bg-brand-bg-alt text-center py-20 sm:py-28 lg:py-32">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-text leading-tight max-w-4xl mx-auto">
            Turn Customer Data into <span className="text-brand-primary">Lasting Resonance</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-brand-text-secondary max-w-2xl mx-auto">
            EchoCRM helps you understand your audience, engage them with personalized campaigns, and unlock intelligent insights to grow your business.
          </p>
          <div className="mt-10 flex justify-center items-center gap-4">
            <Link href={user ? "/dashboard" : "/login"} className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-3 px-8 rounded-lg shadow-interactive-lg hover:shadow-interactive-hover transition-all duration-300 text-lg transform hover:scale-105">
              {user ? "Go to Your Dashboard" : "Get Started For Free"}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full bg-brand-bg py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-brand-text mb-4">Everything You Need to Connect</h2>
          <p className="text-lg text-brand-text-secondary mb-12 max-w-2xl mx-auto">From audience building to AI-powered suggestions, our tools are designed for impact.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<FaUserShield />} title="Audience Segmentation">
              Create dynamic customer segments with our flexible rule builder to target the right people with the right message.
            </FeatureCard>
            <FeatureCard icon={<FaBullhorn />} title="Campaign Creation">
              Design and launch personalized campaigns with ease. Track performance and see what resonates with your audience.
            </FeatureCard>
            <FeatureCard icon={<FaLightbulb />} title="AI-Powered Suggestions">
              Overcome writer's block with AI-generated message and subject line ideas tailored to your campaign objective.
            </FeatureCard>
            <FeatureCard icon={<FaCog />} title="Asynchronous Processing">
              Our architecture ensures data ingestion and message processing happen reliably in the background without slowing you down.
            </FeatureCard>
            <FeatureCard icon={<FaChartLine />} title="Actionable Insights">
              Go beyond simple stats. Use AI to generate summaries and suggestions on how to improve your next campaign.
            </FeatureCard>
            <FeatureCard icon={<FaRocket />} title="Seamless Deployment">
              Built with modern, scalable technologies, ready to be deployed on platforms like Vercel and Render.
            </FeatureCard>
          </div>
        </div>
      </section>

       {/* Call-to-Action Section */}
      <section className="w-full bg-slate-800"> {/* Darker grey background for contrast */}
        <div className="container mx-auto px-6 py-20 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Amplify Your Customer Relationships?</h2>
          <p className="text-lg text-slate-300 mb-8">Start using EchoCRM today and build connections that last.</p>
          <Link href={user ? "/dashboard" : "/login"} className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-10 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-lg transform hover:scale-105">
            {/* MODIFIED: Changed button color from accent to grey */}
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}