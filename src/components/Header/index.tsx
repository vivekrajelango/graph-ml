import React from 'react';
import SearchBar from './SearchBar';
import { LoggedInUser } from '../../types/types';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loggedInUser: LoggedInUser;
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
  isMapChecked: boolean;
  setMapChecked: (checked: boolean) => void;
}

const Header = ({
  searchTerm,
  setSearchTerm,
  loggedInUser,
  isChecked,
  setIsChecked,
  isMapChecked,
  setMapChecked
}:HeaderProps) => {
  return (
    <>
      <section className='hidden md:flex flex-row py-2 px-4 bg-gray-50'>
        <div className="w-[60%] flex items-center justify-start gap-3">
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
        <div className="w-[20%] flex flex-col items-center justify-center gap-1">
          <div className='flex flex-row gap-2'>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">My Peers</span>
              <span className="text-xs text-gray-900">{loggedInUser.peers}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Following</span>
              <span className="text-xs text-gray-900">{loggedInUser.following}</span>
            </div>
          </div>

          <button className="w-[120px] bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-medium hover:bg-blue-700">
            Create web
          </button>
        </div>

        <div className="w-[20%] flex flex-col items-start justify-center gap-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">Show connections</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isMapChecked}
              onChange={(e) => setMapChecked(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">Show my connections on map</span>
          </label>
        </div>
      </section>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </>
  );
};

export default Header;