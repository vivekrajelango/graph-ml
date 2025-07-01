import React from 'react';
import { X, Users, Award, BookOpen } from 'lucide-react';
import { Node, UserProfile } from '../../types/types';

interface ProfileDetailsProps {
  selectedNode: Node | null;
  sampleProfile: UserProfile;
  onClose: () => void;
}

const ProfileDetails = ({
  selectedNode,
  sampleProfile,
  onClose
}: ProfileDetailsProps) => {
  return (
    <div className="fixed lg:relative left-0 top-0 h-full w-full lg:w-84 bg-white shadow-lg border-l border-gray-200 overflow-y-auto z-50">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Profile Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            {selectedNode?.avatar || sampleProfile.avatar}
          </div>
          <h4 className="text-xl font-semibold text-gray-900">
            {selectedNode?.label || sampleProfile.name}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {selectedNode?.type || sampleProfile.title}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {selectedNode ? `Connections: ${selectedNode.connections}` : `Peers: ${sampleProfile.peers}`}
          </p>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-medium">
            View Profile
          </button>
          <button className="w-full border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            Resume
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Patients Served</span>
            </div>
            <div className="font-semibold text-xl">{sampleProfile.patientsServed}</div>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
              <span>+20</span>
              <span className="text-xs text-gray-500">this month</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Award className="w-4 h-4" />
              <span className="text-sm">Success Rate</span>
            </div>
            <div className="font-semibold text-xl">{sampleProfile.successRate}%</div>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
              <span>+3%</span>
              <span className="text-xs text-gray-500">this month</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">About</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{sampleProfile.about}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Education</h4>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">{sampleProfile.education.institution}</h5>
                <p className="text-sm text-gray-600 mt-1">{sampleProfile.education.degree}</p>
                <p className="text-sm text-gray-600">{sampleProfile.education.specialization}</p>
                <p className="text-xs text-gray-500 mt-2">{sampleProfile.education.period}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;