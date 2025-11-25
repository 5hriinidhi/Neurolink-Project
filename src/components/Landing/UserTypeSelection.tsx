import React from 'react';
import { Heart, Users, Stethoscope, ArrowRight, Shield, Activity } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelect: (type: 'patient' | 'caregiver') => void;
  onNavigate: (page: string) => void;
}

export const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelect, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-teal-100 relative overflow-hidden">
      {/* Very Light Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-teal-300/8 to-teal-400/8 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-gray-300/6 to-gray-400/6 rounded-full blur-xl animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-gradient-to-br from-teal-200/10 to-teal-300/10 rounded-full blur-2xl animate-float-fast" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-gray-400/8 to-teal-300/8 rounded-full blur-xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-br from-teal-400/12 to-gray-400/12 rounded-full blur-3xl animate-float-medium" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Heart size={32} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">NeuroLink</h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Choose your role to access personalized features
            </p>
          </div>

          {/* User Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Patient Card */}
            <div className="group backdrop-blur-xl bg-white/20 border border-gray-200/30 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Users size={40} className="text-white" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">Patient</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Access your personal dashboard with memory tools, reminders, family contacts, and daily tasks designed for your comfort and independence.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                      <Heart size={12} className="text-teal-500" />
                    </div>
                    <span>Memory recording and playback</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                      <Shield size={12} className="text-teal-500" />
                    </div>
                    <span>Gentle reminders and guidance</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                      <Users size={12} className="text-teal-500" />
                    </div>
                    <span>Family connection tools</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelect('patient')}
                  className="group/btn w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  Continue as Patient
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Caregiver Card */}
            <div className="group backdrop-blur-xl bg-white/20 border border-gray-200/30 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope size={40} className="text-white" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">Caregiver</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Monitor patient activity, manage care plans, receive alerts, and coordinate with family members through advanced caregiver tools.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Activity size={12} className="text-gray-500" />
                    </div>
                    <span>Real-time patient monitoring</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Shield size={12} className="text-gray-500" />
                    </div>
                    <span>Advanced alert system</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users size={12} className="text-gray-500" />
                    </div>
                    <span>Care team coordination</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelect('caregiver')}
                  className="group/btn w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  Continue as Caregiver
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};