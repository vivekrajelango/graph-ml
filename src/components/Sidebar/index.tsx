import React from 'react';
import { Menu, X } from 'lucide-react';
import Navigation from './Navigation';
import UploadSection from './UploadSection';
import { LoggedInUser } from '../../types/types';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  loggedInUser: LoggedInUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
  isMapChecked: boolean;
  setMapChecked: (checked: boolean) => void;
}

const Sidebar= ({
  sidebarOpen,
  setSidebarOpen,
  loggedInUser,
  activeTab,
  setActiveTab,
  handleFileUpload,
  isChecked,
  setIsChecked,
  isMapChecked,
  setMapChecked
}:SidebarProps) => {
  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className={`${sidebarOpen ? 'translate-x-0 w-80' : '-translate-x-80'} lg:translate-x-0 w-20 bg-white shadow-lg flex flex-col border-r border-gray-200 fixed lg:relative h-full z-40 transition-transform duration-300 ease-in-out`}>
        <div className="md:hidden p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                {loggedInUser.avatar}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{loggedInUser.name}</h2>
                <p className="text-sm text-gray-600">{loggedInUser.role}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center gap-2">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isChecked} 
                onChange={(e) => setIsChecked(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900">Show connections</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isMapChecked} 
                onChange={(e) => setMapChecked(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900">Show my connections on map</span>
            </label>
          </div>
        </div>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <UploadSection handleFileUpload={handleFileUpload} />
      </div>
    </>
  );
};

export default Sidebar;