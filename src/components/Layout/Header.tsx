import React from 'react';
import { Heart, Phone, Mic, MicOff, Calendar } from 'lucide-react';
import { usePatient } from '../../contexts/PatientContext';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import { format } from 'date-fns';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onEmergencyCall: () => void;
  userType?: 'patient' | 'caregiver' | null;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onEmergencyCall, userType }) => {
  const { state } = usePatient();
  const { settings } = state.currentPatient || { settings: { fontSize: 'large', highContrast: true, voiceEnabled: true, emergencyButtonVisible: true, timeFormat: '12h' } };
  const { isListening, startListening, stopListening, isSupported } = useVoiceCommands(onNavigate);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return userType === 'caregiver' ? 'Caregiver Dashboard' : 'NeuroLink Home';
      case 'memories': return 'My Memories';
      case 'record': return 'Record Memory';
      case 'reminders': return 'Reminders';
      case 'family': return 'Family & Contacts';
      case 'navigation': return 'Room Guide';
      case 'tasks': return userType === 'caregiver' ? 'Manage Tasks' : 'Daily Tasks';
      case 'emergency': return 'Emergency Help';
      case 'settings': return 'Settings';
      case 'caregiver': return 'Caregiver Dashboard';
      default: return 'NeuroLink';
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const timeFormat = settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a';
    return format(now, timeFormat);
  };

  const getCurrentDate = () => {
    const now = new Date();
    return format(now, 'EEEE, MMMM do');
  };

  return (
    <header className="bg-gradient-to-r from-teal-900/90 to-emerald-600/90 backdrop-blur-lg text-white shadow-xl border-b border-teal-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          {/* Left: Logo and Home with Bolt logo beside */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-white/20 backdrop-blur-sm"
            >
              <Heart size={settings.fontSize === 'extra-large' ? 36 : 28} className="text-teal-300" />
              <div className="text-left">
                <h1 className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-2xl' :
                  settings.fontSize === 'large' ? 'text-xl' : 'text-lg'
                  }`}>
                  NeuroLink
                </h1>
                <p className={`text-gray-100 ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                  }`}>
                  {userType === 'caregiver' ? 'Caregiver Portal' : 'Care Assistant'}
                </p>
              </div>
            </button>


          </div>

          {/* Center: Page Title and Date/Time */}
          <div className="text-center flex-1 mx-4">
            <h2 className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-2xl' :
              settings.fontSize === 'large' ? 'text-xl' : 'text-lg'
              }`}>
              {getPageTitle()}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                  } text-gray-100`}>
                  {getCurrentDate()}
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <span className={`font-mono ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } text-gray-100`}>
                  {getCurrentTime()}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Voice Commands and Emergency */}
          <div className="flex items-center gap-3">
            {/* Voice Command Button - Only for patients */}
            {userType === 'patient' && settings.voiceEnabled && isSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 backdrop-blur-sm ${isListening
                  ? 'bg-red-500/80 hover:bg-red-600/80 animate-pulse'
                  : 'bg-gray-500/80 hover:bg-gray-600/80'
                  } shadow-lg border border-white/20`}
                title={isListening ? 'Stop listening' : 'Start voice command'}
              >
                {isListening ? (
                  <MicOff size={settings.fontSize === 'extra-large' ? 28 : 20} />
                ) : (
                  <Mic size={settings.fontSize === 'extra-large' ? 28 : 20} />
                )}
              </button>
            )}

            {/* Emergency Button */}
            {settings.emergencyButtonVisible && (
              <button
                onClick={onEmergencyCall}
                className="bg-red-500/90 hover:bg-red-600/90 text-white px-4 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-bold backdrop-blur-sm border border-white/20"
              >
                <Phone size={settings.fontSize === 'extra-large' ? 28 : 20} />
                <span className={`${settings.fontSize === 'extra-large' ? 'text-xl' :
                  settings.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                  Emergency
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Today's Context Banner */}
        <div className="pb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <p className={`text-center ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              } text-gray-100`}>
              {state.currentPatient?.name && (
                <span className="font-semibold">Hello, {state.currentPatient.name}!</span>
              )}
              {userType === 'caregiver' && (
                <span className="font-semibold">Caregiver Dashboard</span>
              )}
              {!userType && (
                <span className="font-semibold">Welcome to NeuroLink</span>
              )}
              <span className="ml-2">• Have a wonderful day filled with joy and peace</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};