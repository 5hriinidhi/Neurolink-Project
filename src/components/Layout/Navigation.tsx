import React from 'react';
import {
  Home,
  Brain,
  Mic,
  Clock,
  Users,
  MapPin,
  CheckSquare,
  Settings,
  BarChart3,
  Activity,
  Bell
} from 'lucide-react';
import { usePatient } from '../../contexts/PatientContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userType?: 'patient' | 'caregiver' | null;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, userType }) => {
  const { state } = usePatient();
  const { settings } = state.currentPatient || { settings: { fontSize: 'large', highContrast: true, simplifiedInterface: false } };

  // Different navigation items based on user type
  const patientNavigationItems = [
    { id: 'dashboard', label: 'Home', icon: Home, color: 'bg-gradient-to-br from-teal-500 to-teal-600' },
    { id: 'memories', label: 'Memories', icon: Brain, color: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'bg-gradient-to-br from-teal-600 to-emerald-400' },
    { id: 'reminders', label: 'Reminders', icon: Clock, color: 'bg-gradient-to-br from-emerald-300 to-teal-400' },
    { id: 'family', label: 'Family', icon: Users, color: 'bg-gradient-to-br from-teal-400 to-emerald-300' },
    { id: 'navigation', label: 'Rooms', icon: MapPin, color: 'bg-gradient-to-br from-emerald-500 to-teal-500' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gradient-to-br from-gray-500 to-teal-400' },
  ];

  const caregiverNavigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'bg-gradient-to-br from-teal-500 to-teal-600' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
    { id: 'reminders', label: 'Reminders', icon: Bell, color: 'bg-gradient-to-br from-teal-600 to-emerald-400' },
    { id: 'family', label: 'Network', icon: Users, color: 'bg-gradient-to-br from-emerald-300 to-teal-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gradient-to-br from-gray-500 to-teal-400' },
  ];

  const navigationItems = userType === 'caregiver' ? caregiverNavigationItems : patientNavigationItems;

  // Show simplified navigation for patients if enabled
  const visibleItems = userType === 'patient' && settings.simplifiedInterface
    ? navigationItems.filter(item => ['dashboard', 'memories', 'tasks', 'family', 'navigation'].includes(item.id))
    : navigationItems;

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-t border-gray-300/20">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center py-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 min-w-0 ${isActive
                    ? `${item.color} text-white shadow-lg`
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
                  }`}
              >
                <Icon size={settings.fontSize === 'extra-large' ? 28 : 20} />
                <span className={`font-medium leading-tight text-center ${settings.fontSize === 'extra-large' ? 'text-sm' :
                    settings.fontSize === 'large' ? 'text-xs' : 'text-xs'
                  }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};