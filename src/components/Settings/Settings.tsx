import React from 'react';
import { Settings as SettingsIcon, Volume2, Eye, Type, Bell, Smartphone, Palette, Clock, Shield, User, ArrowLeftRight } from 'lucide-react';
import { usePatient } from '../../contexts/PatientContext';

interface SettingsProps {
  onNavigate: (page: string) => void;
  userType?: 'patient' | 'caregiver' | null;
  onSwitchUserType?: (type: 'patient' | 'caregiver') => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate, userType, onSwitchUserType }) => {
  const { state, dispatch } = usePatient();
  const settings = state.currentPatient?.settings || {
    fontSize: 'large',
    highContrast: true,
    voiceEnabled: true,
    notificationVolume: 0.8,
    reminderAdvanceTime: 15,
    autoPlayMemories: false,
    emergencyButtonVisible: true,
    simplifiedInterface: false,
    colorTheme: 'warm',
    language: 'en',
    timeFormat: '12h',
    enableGPS: false,
    enableBiometrics: false,
    enableWeatherAlerts: true,
  };

  const handleSettingChange = (key: string, value: any) => {
    if (state.currentPatient) {
      const updatedPatient = {
        ...state.currentPatient,
        settings: {
          ...state.currentPatient.settings,
          [key]: value
        }
      };
      dispatch({ type: 'UPDATE_PATIENT', payload: updatedPatient });
    }
  };

  const handleSwitchUser = () => {
    if (onSwitchUserType && userType) {
      const newType = userType === 'patient' ? 'caregiver' : 'patient';
      onSwitchUserType(newType);
    }
  };

  const fontSizeOptions = [
    { value: 'small', label: 'Small', preview: 'text-sm' },
    { value: 'medium', label: 'Medium', preview: 'text-base' },
    { value: 'large', label: 'Large', preview: 'text-lg' },
    { value: 'extra-large', label: 'Extra Large', preview: 'text-xl' },
  ];

  const colorThemes = [
    {
      value: 'warm',
      label: 'Warm Orange',
      colors: 'from-orange-400 to-orange-500',
      bgClass: 'bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100'
    },
    {
      value: 'cool',
      label: 'Cool Blue',
      colors: 'from-blue-400 to-blue-500',
      bgClass: 'bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100'
    },
    {
      value: 'nature',
      label: 'Nature Green',
      colors: 'from-green-400 to-green-500',
      bgClass: 'bg-gradient-to-br from-green-100 via-green-50 to-green-100'
    },
    {
      value: 'sunset',
      label: 'Sunset Purple',
      colors: 'from-purple-400 to-purple-500',
      bgClass: 'bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100'
    },
  ];

  // Apply theme to body
  React.useEffect(() => {
    const body = document.body;
    // Remove all theme classes
    body.classList.remove('theme-warm', 'theme-cool', 'theme-nature', 'theme-sunset');
    // Add current theme class
    body.classList.add(`theme-${settings.colorTheme}`);
  }, [settings.colorTheme]);

  const getThemeBackground = () => {
    const theme = colorThemes.find(t => t.value === settings.colorTheme);
    return theme?.bgClass || 'bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100';
  };

  return (
    <div className={`min-h-screen ${getThemeBackground()} relative overflow-hidden`}>
      {/* Soft Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-orange-500/20 rounded-full blur-xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-gray-400/15 to-gray-500/15 rounded-full blur-lg animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-gradient-to-br from-orange-300/25 to-orange-400/25 rounded-full blur-xl animate-float-fast" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-gray-500/20 to-orange-400/20 rounded-full blur-lg animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-br from-orange-500/30 to-gray-500/30 rounded-full blur-2xl animate-float-medium" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 sm:p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <SettingsIcon size={24} className="text-white" />
              </div>
              <div>
                <h1 className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-3xl' :
                    settings.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                  } text-gray-800`}>
                  Settings
                </h1>
                <p className={`${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } text-gray-600`}>
                  Customize your NeuroLink experience
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* User Type Switcher */}
            {userType && onSwitchUserType && (
              <div className="backdrop-blur-sm bg-white/20 border border-gray-300/20 rounded-2xl p-6">
                <h2 className={`font-semibold mb-6 flex items-center gap-3 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
                  } text-gray-800`}>
                  <ArrowLeftRight size={24} className="text-orange-500" />
                  User Type
                </h2>

                <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <div>
                    <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      } text-gray-700`}>
                      Current Mode: {userType === 'patient' ? 'Patient' : 'Caregiver'}
                    </span>
                    <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      } text-gray-500`}>
                      Switch between patient and caregiver interfaces
                    </p>
                  </div>
                  <button
                    onClick={handleSwitchUser}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                  >
                    <ArrowLeftRight size={16} />
                    Switch to {userType === 'patient' ? 'Caregiver' : 'Patient'}
                  </button>
                </div>
              </div>
            )}

            {/* Display Settings */}
            <div className="backdrop-blur-sm bg-white/20 border border-gray-300/20 rounded-2xl p-6">
              <h2 className={`font-semibold mb-6 flex items-center gap-3 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
                } text-gray-800`}>
                <Eye size={24} className="text-orange-500" />
                Display Settings
              </h2>

              <div className="space-y-6">
                {/* Font Size */}
                <div>
                  <label className={`block font-medium mb-3 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700 flex items-center gap-2`}>
                    <Type size={20} className="text-orange-500" />
                    Font Size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {fontSizeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSettingChange('fontSize', option.value)}
                        className={`p-4 border border-gray-300/30 rounded-xl transition-all duration-200 ${settings.fontSize === option.value
                            ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg'
                            : 'bg-white/30 text-gray-700 hover:bg-white/50'
                          }`}
                      >
                        <span className={`font-medium ${option.preview}`}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Theme */}
                <div>
                  <label className={`block font-medium mb-3 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700 flex items-center gap-2`}>
                    <Palette size={20} className="text-orange-500" />
                    Color Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {colorThemes.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => handleSettingChange('colorTheme', theme.value)}
                        className={`p-4 border border-gray-300/30 rounded-xl transition-all duration-200 flex flex-col items-center gap-2 ${settings.colorTheme === theme.value
                            ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg'
                            : 'bg-white/30 text-gray-700 hover:bg-white/50'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.colors}`} />
                        <span className="text-sm font-medium">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-orange-500" />
                    <div>
                      <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                        } text-gray-700`}>
                        High Contrast Mode
                      </span>
                      <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        } text-gray-500`}>
                        Improves readability with stronger colors
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.highContrast}
                      onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                {/* Simplified Interface */}
                <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-orange-500" />
                    <div>
                      <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                        } text-gray-700`}>
                        Simplified Interface
                      </span>
                      <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        } text-gray-500`}>
                        Show only essential features
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.simplifiedInterface}
                      onChange={(e) => handleSettingChange('simplifiedInterface', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Audio Settings */}
            <div className="backdrop-blur-sm bg-white/20 border border-gray-300/20 rounded-2xl p-6">
              <h2 className={`font-semibold mb-6 flex items-center gap-3 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
                } text-gray-800`}>
                <Volume2 size={24} className="text-orange-500" />
                Audio Settings
              </h2>

              <div className="space-y-6">
                {/* Voice Commands */}
                <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <div className="flex items-center gap-3">
                    <Smartphone size={20} className="text-orange-500" />
                    <div>
                      <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                        } text-gray-700`}>
                        Voice Commands
                      </span>
                      <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        } text-gray-500`}>
                        Enable voice navigation and commands
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.voiceEnabled}
                      onChange={(e) => handleSettingChange('voiceEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                {/* Notification Volume */}
                <div className="p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <label className={`block font-medium mb-3 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700`}>
                    Notification Volume
                  </label>
                  <div className="flex items-center gap-4">
                    <span className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      } text-gray-600`}>
                      Quiet
                    </span>
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.notificationVolume}
                        onChange={(e) => handleSettingChange('notificationVolume', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <span className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      } text-gray-600`}>
                      Loud
                    </span>
                  </div>
                  <p className={`mt-2 text-center ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    } text-gray-500`}>
                    Current volume: {Math.round(settings.notificationVolume * 100)}%
                  </p>
                </div>

                {/* Auto-play Memories */}
                <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <div className="flex items-center gap-3">
                    <Volume2 size={20} className="text-orange-500" />
                    <div>
                      <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                        } text-gray-700`}>
                        Auto-play Memory Audio
                      </span>
                      <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        } text-gray-500`}>
                        Automatically play audio when viewing memories
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoPlayMemories}
                      onChange={(e) => handleSettingChange('autoPlayMemories', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Reminder Settings */}
            <div className="backdrop-blur-sm bg-white/20 border border-gray-300/20 rounded-2xl p-6">
              <h2 className={`font-semibold mb-6 flex items-center gap-3 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
                } text-gray-800`}>
                <Bell size={24} className="text-orange-500" />
                Reminder Settings
              </h2>

              <div className="space-y-6">
                {/* Reminder Advance Time */}
                <div className="p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <label className={`block font-medium mb-3 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700`}>
                    Reminder Advance Time
                  </label>
                  <select
                    value={settings.reminderAdvanceTime}
                    onChange={(e) => handleSettingChange('reminderAdvanceTime', parseInt(e.target.value))}
                    className={`w-full px-4 py-3 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      }`}
                  >
                    <option value={0}>At the exact time</option>
                    <option value={5}>5 minutes before</option>
                    <option value={10}>10 minutes before</option>
                    <option value={15}>15 minutes before</option>
                    <option value={30}>30 minutes before</option>
                    <option value={60}>1 hour before</option>
                  </select>
                  <p className={`mt-2 ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    } text-gray-500`}>
                    How early should reminders appear before the scheduled time
                  </p>
                </div>

                {/* Time Format */}
                <div className="p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <label className={`block font-medium mb-3 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700 flex items-center gap-2`}>
                    <Clock size={20} className="text-orange-500" />
                    Time Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSettingChange('timeFormat', '12h')}
                      className={`p-3 border border-gray-300/30 rounded-lg transition-all duration-200 ${settings.timeFormat === '12h'
                          ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg'
                          : 'bg-white/30 text-gray-700 hover:bg-white/50'
                        }`}
                    >
                      12 Hour (2:30 PM)
                    </button>
                    <button
                      onClick={() => handleSettingChange('timeFormat', '24h')}
                      className={`p-3 border border-gray-300/30 rounded-lg transition-all duration-200 ${settings.timeFormat === '24h'
                          ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg'
                          : 'bg-white/30 text-gray-700 hover:bg-white/50'
                        }`}
                    >
                      24 Hour (14:30)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Safety */}
            <div className="backdrop-blur-sm bg-white/20 border border-gray-300/20 rounded-2xl p-6">
              <h2 className={`font-semibold mb-6 flex items-center gap-3 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
                } text-gray-800`}>
                <Shield size={24} className="text-orange-500" />
                Privacy & Safety
              </h2>

              <div className="space-y-4">
                {/* GPS Tracking */}
                <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <div>
                    <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      } text-gray-700`}>
                      GPS Location Tracking
                    </span>
                    <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      } text-gray-500`}>
                      Enable location monitoring for safety
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableGPS}
                      onChange={(e) => handleSettingChange('enableGPS', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                {/* Emergency Button */}
                <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <div>
                    <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      } text-gray-700`}>
                      Emergency Button Visible
                    </span>
                    <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      } text-gray-500`}>
                      Show emergency call button in header
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emergencyButtonVisible}
                      onChange={(e) => handleSettingChange('emergencyButtonVisible', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                {/* Weather Alerts */}
                <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <div>
                    <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      } text-gray-700`}>
                      Weather Alerts
                    </span>
                    <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      } text-gray-500`}>
                      Receive weather-related safety alerts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableWeatherAlerts}
                      onChange={(e) => handleSettingChange('enableWeatherAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="backdrop-blur-sm bg-white/20 border border-gray-300/20 rounded-2xl p-6">
              <h2 className={`font-semibold mb-6 flex items-center gap-3 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
                } text-gray-800`}>
                <Smartphone size={24} className="text-orange-500" />
                Device Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <p className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700 mb-1`}>
                    Browser
                  </p>
                  <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    } text-gray-600`}>
                    {navigator.userAgent.includes('Chrome') ? 'Chrome' :
                      navigator.userAgent.includes('Firefox') ? 'Firefox' :
                        navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown'}
                  </p>
                </div>
                <div className="p-4 bg-white/30 rounded-xl border border-gray-300/20">
                  <p className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700 mb-1`}>
                    Notifications
                  </p>
                  <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    } text-gray-600`}>
                    {Notification.permission === 'granted' ? 'Enabled' :
                      Notification.permission === 'denied' ? 'Disabled' : 'Not requested'}
                  </p>
                </div>
              </div>
            </div>

            {/* Reset Settings */}
            <div className="pt-6 border-t border-gray-300/20">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all settings to default?')) {
                    handleSettingChange('fontSize', 'large');
                    handleSettingChange('highContrast', true);
                    handleSettingChange('voiceEnabled', true);
                    handleSettingChange('notificationVolume', 0.8);
                    handleSettingChange('reminderAdvanceTime', 15);
                    handleSettingChange('autoPlayMemories', false);
                    handleSettingChange('emergencyButtonVisible', true);
                    handleSettingChange('simplifiedInterface', false);
                    handleSettingChange('colorTheme', 'warm');
                    handleSettingChange('timeFormat', '12h');
                    handleSettingChange('enableGPS', false);
                    handleSettingChange('enableWeatherAlerts', true);
                  }
                }}
                className={`bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  }`}
              >
                Reset to Default Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Extra bottom spacing to ensure content is visible above navigation */}
      <div className="h-32"></div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fb923c, #f97316);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fb923c, #f97316);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};