import React from 'react';
import { Clock, X, SunSnow as Snooze, Check } from 'lucide-react';
import { useReminders } from '../../contexts/RemindersContext';
import { useSettings } from '../../contexts/SettingsContext';

export const ReminderAlert: React.FC = () => {
  const { state, dispatch } = useReminders();
  const { state: settingsState } = useSettings();
  const { settings } = settingsState;

  if (!state.activeReminder) return null;

  const handleSnooze = () => {
    if (state.activeReminder) {
      dispatch({ type: 'SNOOZE_REMINDER', payload: state.activeReminder.id });
      
      // Set a timeout to show the reminder again in 10 minutes
      setTimeout(() => {
        dispatch({ type: 'SET_ACTIVE_REMINDER', payload: state.activeReminder });
      }, 10 * 60 * 1000); // 10 minutes
    }
  };

  const handleDismiss = () => {
    if (state.activeReminder) {
      dispatch({ type: 'DISMISS_REMINDER', payload: state.activeReminder.id });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'bg-red-500';
      case 'meal': return 'bg-green-500';
      case 'appointment': return 'bg-blue-500';
      default: return 'bg-purple-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 ${settings.highContrast ? 'border-4 border-black' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
              getCategoryColor(state.activeReminder.category)
            }`}>
              <Clock size={24} />
            </div>
            <div>
              <h2 className={`font-bold ${
                settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
              } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
                Reminder
              </h2>
              <p className={`${
                settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
              } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
                {state.activeReminder.time}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              settings.highContrast ? 'text-black hover:bg-gray-200' : 'text-gray-400'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className={`font-bold mb-2 ${
            settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
          } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
            {state.activeReminder.title}
          </h3>
          
          {state.activeReminder.description && (
            <p className={`${
              settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
            } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
              {state.activeReminder.description}
            </p>
          )}

          <div className="mt-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
              getCategoryColor(state.activeReminder.category)
            }`}>
              {state.activeReminder.category.charAt(0).toUpperCase() + state.activeReminder.category.slice(1)}
            </span>
            
            {state.activeReminder.priority === 'high' && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                High Priority
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSnooze}
            className={`flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
            }`}
          >
            <Snooze size={20} />
            Snooze 10min
          </button>
          
          <button
            onClick={handleDismiss}
            className={`flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
            }`}
          >
            <Check size={20} />
            Done
          </button>
        </div>

        {/* Emergency Note */}
        {state.activeReminder.priority === 'high' && (
          <div className={`mt-4 p-3 rounded-lg bg-red-50 border border-red-200 ${
            settings.highContrast ? 'border-red-500' : ''
          }`}>
            <p className={`text-red-800 font-medium text-center ${
              settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
            }`}>
              This is a high priority reminder. Please take action promptly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};