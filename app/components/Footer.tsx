"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState(2026);
  
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <span className="text-black font-bold text-xl">1</span>
              </div>
              <div>
                <div className="font-bold text-lg">ONETIME</div>
                <div className="text-xs text-zinc-400">One launch. Every chain.</div>
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              Launch your token once, deploy everywhere.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/launch" className="hover:text-white transition-colors">Launch Token</Link></li>
              <li><Link href="/explore" className="hover:text-white transition-colors">Explore</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/docs" className="hover:text-white transition-colors">Docs</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">𝕏 (Twitter)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-zinc-400">
          © {year} ONETIME. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
