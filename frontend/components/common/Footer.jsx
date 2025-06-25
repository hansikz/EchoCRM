import React from 'react';
import Link from 'next/link';
// Assuming you have run `npm install react-icons`
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'; 

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    // MODIFIED: Changed background to a slightly lighter dark grey for better theme cohesion
    <footer className="bg-slate-800 text-slate-300"> 
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">EchoCRM</h3>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              At EchoCRM, every customer story echoes through every corner of your business — because great service isn’t a transaction, it’s a lasting resonance.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-brand-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/dashboard/campaigns" className="hover:text-brand-primary transition-colors">Campaigns</Link></li>
              <li><Link href="/dashboard/subscription" className="hover:text-brand-primary transition-colors">Subscription</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Get In Touch</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: <a href="mailto:justsimplyhans@gmail.com" className="hover:text-brand-primary transition-colors">justsimplyhans@gmail.com</a></li>
              <li className="flex space-x-4 pt-2">
                <a href="#" className="hover:text-brand-primary transition-colors" aria-label="GitHub"><FaGithub size={20} /></a>
                <a href="#" className="hover:text-brand-primary transition-colors" aria-label="LinkedIn"><FaLinkedin size={20} /></a>
                <a href="#" className="hover:text-brand-primary transition-colors" aria-label="Twitter"><FaTwitter size={20} /></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm text-slate-500">
          <p>Developed by Hansika Singhal.</p>
          <p>&copy; {currentYear} EchoCRM. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}