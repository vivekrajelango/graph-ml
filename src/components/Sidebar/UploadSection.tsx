import React from 'react';
import { Upload } from 'lucide-react';

interface UploadSectionProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadSection= ({ handleFileUpload }:UploadSectionProps) => {
  return (
    <div className="p-4 border-t">
      <label className="block w-full">
        <input
          type="file"
          accept=".graphml"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-1 text-center cursor-pointer hover:bg-gray-50">
          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 md:hidden">Upload GraphML File</p>
        </div>
      </label>
    </div>
  );
};

export default UploadSection;