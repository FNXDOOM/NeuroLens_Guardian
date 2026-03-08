import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Users, Settings, Map, Camera, MessageSquare } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/user', icon: User, label: 'Dashboard' },
    { path: '/ar-vision', icon: Camera, label: 'AR Vision' },
    { path: '/ai-assistant', icon: MessageSquare, label: 'Assistant' },
    { path: '/safe-zones', icon: Map, label: 'Safe Zones' },
    { path: '/caregiver', icon: Users, label: 'Caregiver' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NL</span>
            </div>
            <span className="font-bold text-lg">NeuroLens Guardian</span>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
