"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center glow-effect group-hover:scale-110 transition-transform">
              <span className="text-black font-bold text-xl">1</span>
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight">ONETIME</div>
              <div className="text-xs text-zinc-400 -mt-1">One launch. Every chain.</div>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" active={isActive("/")}>Home</NavLink>
            <NavLink href="/launch" active={isActive("/launch")}>Launch</NavLink>
            <NavLink href="/explore" active={isActive("/explore")}>Explore</NavLink>
            <NavLink href="/docs" active={isActive("/docs")}>Docs</NavLink>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="[&_button]:!rounded-lg [&_button]:!text-sm [&_button]:!px-4 [&_button]:!py-2">
              <ConnectButton />
            </div>
            <Link 
              href="/launch"
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-violet-500/50 transition-all"
            >
              Launch Token
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? "bg-white/10 text-white" 
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}
