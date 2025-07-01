import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar = ({ searchTerm, setSearchTerm }:SearchBarProps) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-3 flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0 justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;