'use client'

import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  title?: string;
  showNav?: boolean;
  variant?: 'landing' | 'user' | 'caregiver';
}

export function Navbar({ title = 'NeuroLens Guardian', showNav = true, variant = 'landing' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = {
    landing: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Safety', href: '#safety' },
    ],
    user: [
      { label: 'Dashboard', href: '/' },
      { label: 'Settings', href: '/user/settings' },
    ],
    caregiver: [
      { label: 'Dashboard', href: '/' },
      { label: 'Settings', href: '/caregiver/settings' },
    ],
  };

  const links = navLinks[variant];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm shadow-black/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Always goes to home page */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">{title}</span>
          </Link>

          {/* Desktop navigation */}
          {showNav && (
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-secondary/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile navigation */}
        {showNav && isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
