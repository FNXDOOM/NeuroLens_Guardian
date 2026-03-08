import React from 'react';
import { Navbar } from './Navbar';

export const Layout = ({ children, showNav = true }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {showNav && <Navbar />}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
