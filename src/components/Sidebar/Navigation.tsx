import React from 'react';
import { Search, Users, BookOpen, Bell, MessageCircle, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation= ({ activeTab, setActiveTab }:NavigationProps) => {
  const navItems = [
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'network', icon: Users, label: 'Network' },
    { id: 'publications', icon: BookOpen, label: 'Publications' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="p-4 space-y-1">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg ${
            activeTab === id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab(id)}
        >
          <Icon className={`w-5 h-5 ${activeTab === id ? 'text-blue-600' : 'text-gray-500'}`} />
          <span className='md:hidden'>{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;