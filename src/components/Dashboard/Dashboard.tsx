import React from 'react';
import {
  Brain,
  Clock,
  Users,
  CheckSquare,
  MapPin,
  Calendar,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Heart,
  Activity,
  Shield,
  Coffee,
  Utensils,
  BookOpen,
  BarChart3,
  Bell,
  Settings as SettingsIcon,
  Home,
  User,
  Navigation
} from 'lucide-react';
import { usePatient } from '../../contexts/PatientContext';
import { useMemory } from '../../contexts/MemoryContext';
import { useReminders } from '../../contexts/RemindersContext';
import { useTasks } from '../../contexts/TaskContext';
import { useFamily } from '../../contexts/FamilyContext';
import { format } from 'date-fns';

interface DashboardProps {
  onNavigate: (page: string) => void;
  userType?: 'patient' | 'caregiver' | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userType }) => {
  const { state: patientState } = usePatient();
  const { state: memoryState } = useMemory();
  const { state: reminderState } = useReminders();
  const { state: taskState } = useTasks();
  const { state: familyState } = useFamily();

  const { settings } = patientState.currentPatient || {
    settings: {
      fontSize: 'large',
      highContrast: true,
      colorTheme: 'warm'
    }
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: 'Good Morning', icon: Sunrise };
    if (hour < 17) return { greeting: 'Good Afternoon', icon: Sun };
    if (hour < 21) return { greeting: 'Good Evening', icon: Sunset };
    return { greeting: 'Good Night', icon: Moon };
  };

  const { greeting, icon: GreetingIcon } = getTimeOfDayGreeting();

  const todaysTasks = taskState.tasks.filter(task => {
    if (!task.isActive || !task.schedule) return false;
    const today = new Date().getDay();
    return task.schedule.daysOfWeek.includes(today);
  });

  const completedTasks = todaysTasks.filter(task =>
    task.steps.every(step => step.isCompleted)
  );

  const upcomingReminders = reminderState.reminders
    .filter(reminder => reminder.isActive)
    .slice(0, 3);

  const recentMemories = memoryState.memories.slice(0, 3);

  const upcomingVisits = familyState.familyMembers
    .flatMap(member => member.visitSchedule || [])
    .filter(visit => new Date(visit.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  // Handle location and identity functions
  const handleTakeMeHome = () => {
    // Get user's current location and open maps with directions home
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Replace with actual home address - for demo using a sample address
          const homeAddress = "123 Main Street, Your City, State";
          const mapsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${encodeURIComponent(homeAddress)}`;
          window.open(mapsUrl, '_blank');
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback - just open maps
          window.open('https://www.google.com/maps', '_blank');
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      window.open('https://www.google.com/maps', '_blank');
    }
  };

  const handleWhoAmI = () => {
    // Show identity information
    const patient = patientState.currentPatient;
    const identityInfo = `
Name: ${patient?.name || 'John'}
Date of Birth: ${patient?.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMMM do, yyyy') : 'June 15, 1945'}
Address: 123 Main Street, Your City, State
Emergency Contact: ${familyState.familyMembers.find(m => m.isEmergencyContact)?.name || 'Family Member'}
Phone: ${familyState.familyMembers.find(m => m.isEmergencyContact)?.phone || '(555) 123-4567'}
    `;

    alert(identityInfo);
  };

  // Get varied today context based on time and day
  const getTodayContext = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (hour < 9) {
      return {
        icon: Coffee,
        text: `It's ${dayNames[day]} morning - time for breakfast and morning routines`
      };
    } else if (hour < 12) {
      return {
        icon: BookOpen,
        text: `Mid-morning on ${dayNames[day]} - perfect time for activities and light tasks`
      };
    } else if (hour < 14) {
      return {
        icon: Utensils,
        text: `Lunch time on this lovely ${dayNames[day]} - remember to stay hydrated`
      };
    } else if (hour < 17) {
      return {
        icon: Activity,
        text: `${dayNames[day]} afternoon - great time for social activities or gentle exercise`
      };
    } else if (hour < 20) {
      return {
        icon: Users,
        text: `${dayNames[day]} evening - time to connect with family and wind down`
      };
    } else {
      return {
        icon: Moon,
        text: `${dayNames[day]} night - time to relax and prepare for rest`
      };
    }
  };

  const todayContext = getTodayContext();
  const ContextIcon = todayContext.icon;

  // Different quick actions based on user type
  const patientQuickActions = [
    {
      id: 'take-me-home',
      title: 'Take Me Home',
      description: 'Get directions to home',
      icon: Home,
      color: 'bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600',
      onClick: handleTakeMeHome,
    },
    {
      id: 'who-am-i',
      title: 'Who Am I?',
      description: 'View my information',
      icon: User,
      color: 'bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600',
      onClick: handleWhoAmI,
    },
    {
      id: 'record',
      title: 'Record Memory',
      description: 'Save a special moment',
      icon: Brain,
      color: 'bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600',
      onClick: () => onNavigate('record'),
    },
    {
      id: 'tasks',
      title: 'Daily Tasks',
      description: `${completedTasks.length}/${todaysTasks.length} completed`,
      icon: CheckSquare,
      color: 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
      onClick: () => onNavigate('tasks'),
    },
    {
      id: 'family',
      title: 'Family & Contacts',
      description: 'Connect with loved ones',
      icon: Users,
      color: 'bg-gradient-to-br from-emerald-300 to-emerald-400 hover:from-emerald-400 hover:to-emerald-500',
      onClick: () => onNavigate('family'),
    },
    {
      id: 'navigation',
      title: 'Room Guide',
      description: 'Find your way around',
      icon: MapPin,
      color: 'bg-gradient-to-br from-gray-400 to-teal-400 hover:from-gray-500 hover:to-teal-500',
      onClick: () => onNavigate('navigation'),
    },
  ];

  const caregiverQuickActions = [
    {
      id: 'tasks',
      title: 'Manage Tasks',
      description: 'Create and monitor patient tasks',
      icon: CheckSquare,
      color: 'bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600',
      onClick: () => onNavigate('tasks'),
    },
    {
      id: 'reminders',
      title: 'Set Reminders',
      description: 'Schedule patient reminders',
      icon: Bell,
      color: 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
      onClick: () => onNavigate('reminders'),
    },
    {
      id: 'family',
      title: 'Care Network',
      description: 'Manage care team',
      icon: Users,
      color: 'bg-gradient-to-br from-emerald-300 to-emerald-400 hover:from-emerald-400 hover:to-emerald-500',
      onClick: () => onNavigate('family'),
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure care preferences',
      icon: SettingsIcon,
      color: 'bg-gradient-to-br from-gray-400 to-teal-400 hover:from-gray-500 hover:to-teal-500',
      onClick: () => onNavigate('settings'),
    },
  ];

  const quickActions = userType === 'caregiver' ? caregiverQuickActions : patientQuickActions;

  // Feature Cards for Homepage - Only show for patients
  const featureCards = [
    {
      id: 'gentle-care',
      title: 'Gentle Care',
      description: 'Designed with empathy for elderly users with intuitive interfaces and calming interactions',
      icon: Shield,
      color: 'bg-gradient-to-br from-gray-500 to-gray-600',
      features: ['Large, clear buttons', 'High contrast options', 'Voice guidance', 'Simple navigation']
    },
    {
      id: 'memory-support',
      title: 'Memory Support',
      description: 'Preserve and recall precious moments with audio recordings and photo memories',
      icon: Brain,
      color: 'bg-gradient-to-br from-teal-400 to-teal-500',
      features: ['Audio memories', 'Photo albums', 'Memory games', 'Daily reminders']
    },
    {
      id: 'family-connection',
      title: 'Family Connection',
      description: 'Keep loved ones close and informed with real-time updates and easy communication',
      icon: Users,
      color: 'bg-gradient-to-br from-gray-600 to-emerald-400',
      features: ['Video calls', 'Family updates', 'Visit scheduling', 'Emergency contacts']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-teal-50 relative overflow-hidden">
      {/* Soft Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-teal-500/20 rounded-full blur-xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-gray-400/15 to-gray-500/15 rounded-full blur-lg animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-gradient-to-br from-emerald-300/25 to-emerald-400/25 rounded-full blur-xl animate-float-fast" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-gray-500/20 to-teal-400/20 rounded-full blur-lg animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-br from-teal-500/30 to-gray-500/30 rounded-full blur-2xl animate-float-medium" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pb-40">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="backdrop-blur-xl bg-white/20 border border-gray-300/20 rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <GreetingIcon size={settings.fontSize === 'extra-large' ? 48 : 36} className="text-teal-500" />
              <div>
                <h1 className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-4xl' :
                    settings.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
                  } text-gray-800`}>
                  {greeting}, {userType === 'caregiver' ? 'Caregiver' : patientState.currentPatient?.name || 'Friend'}!
                </h1>
                <p className={`${settings.fontSize === 'extra-large' ? 'text-xl' :
                    settings.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } text-gray-600`}>
                  {format(new Date(), 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
            </div>

            {/* Today's Context Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50/50 to-gray-50/50 border border-gray-300/10">
              <div className="flex items-center gap-3">
                <ContextIcon size={24} className="text-teal-500" />
                <p className={`${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } text-gray-700`}>
                  {userType === 'caregiver' ?
                    `Monitoring patient care on ${format(new Date(), 'EEEE, MMMM do')}` :
                    todayContext.text
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`font-semibold mb-4 ${settings.fontSize === 'extra-large' ? 'text-2xl' :
            settings.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } text-gray-800`}>
            {userType === 'caregiver' ? 'Caregiver Tools' : 'What would you like to do?'}
          </h2>
          <div className={`grid gap-4 ${userType === 'caregiver'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`${action.color} text-white p-6 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl`}
                >
                  <Icon size={settings.fontSize === 'extra-large' ? 48 : 32} className="mb-3" />
                  <h3 className={`font-bold mb-1 ${settings.fontSize === 'extra-large' ? 'text-xl' :
                    settings.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>
                    {action.title}
                  </h3>
                  <p className={`${settings.fontSize === 'extra-large' ? 'text-base' :
                    settings.fontSize === 'large' ? 'text-sm' : 'text-xs'
                    } opacity-90`}>
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Progress */}
          <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-semibold flex items-center gap-2 ${settings.fontSize === 'extra-large' ? 'text-2xl' :
                  settings.fontSize === 'large' ? 'text-xl' : 'text-lg'
                } text-gray-800`}>
                <Activity size={24} className="text-teal-500" />
                {userType === 'caregiver' ? 'Patient Progress' : 'Today\'s Progress'}
              </h2>
              <button
                onClick={() => onNavigate('tasks')}
                className={`text-teal-500 hover:text-teal-600 ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                  }`}
              >
                View all
              </button>
            </div>

            {todaysTasks.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700`}>
                    {completedTasks.length} of {todaysTasks.length} tasks completed
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${(completedTasks.length / todaysTasks.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-teal-600">
                      {Math.round((completedTasks.length / todaysTasks.length) * 100)}%
                    </span>
                  </div>
                </div>

                {todaysTasks.slice(0, 3).map((task) => {
                  const isCompleted = task.steps.every(step => step.isCompleted);
                  return (
                    <div
                      key={task.id}
                      className={`p-3 border border-gray-300/20 rounded-lg transition-colors ${isCompleted ? 'bg-teal-50/50' : 'bg-white/30'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-teal-500 text-white' : 'bg-gray-200'
                          }`}>
                          {isCompleted && <CheckSquare size={16} />}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                            } text-gray-800`}>
                            {task.title}
                          </h3>
                          <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                            } text-gray-600`}>
                            {task.steps.length} steps • {task.estimatedDuration} min
                          </p>
                        </div>
                        {task.streakCount > 0 && (
                          <div className="text-right">
                            <div className="text-teal-500 font-bold">🔥</div>
                            <div className="text-xs text-gray-500">{task.streakCount} days</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare size={48} className="mx-auto mb-3 text-gray-400" />
                <p className={`${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } text-gray-600`}>
                  No tasks scheduled for today
                </p>
                <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                  } text-gray-500`}>
                  Enjoy your free time!
                </p>
              </div>
            )}
          </div>

          {/* Upcoming & Recent */}
          <div className="space-y-6">
            {/* Upcoming Reminders */}
            <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`font-semibold flex items-center gap-2 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
                  } text-gray-800`}>
                  <Clock size={20} className="text-teal-500" />
                  Coming Up
                </h2>
                <button
                  onClick={() => onNavigate('reminders')}
                  className={`text-teal-500 hover:text-teal-600 ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    }`}
                >
                  View all
                </button>
              </div>

              {upcomingReminders.length > 0 ? (
                <div className="space-y-2">
                  {upcomingReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="p-3 border border-gray-300/20 rounded-lg bg-white/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${reminder.priority === 'high' ? 'bg-red-500' :
                            reminder.priority === 'medium' ? 'bg-teal-500' :
                              'bg-gray-500'
                          }`} />
                        <div className="flex-1">
                          <h3 className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                            } text-gray-800`}>
                            {reminder.title}
                          </h3>
                          <p className={`${settings.fontSize === 'extra-large' ? 'text-sm' : 'text-xs'
                            } text-gray-600`}>
                            {reminder.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-4 ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                  } text-gray-600`}>
                  No reminders scheduled
                </p>
              )}
            </div>

            {/* Upcoming Visits */}
            {upcomingVisits.length > 0 && (
              <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6">
                <h2 className={`font-semibold flex items-center gap-2 mb-4 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
                  } text-gray-800`}>
                  <Calendar size={20} className="text-teal-500" />
                  Upcoming Visits
                </h2>

                <div className="space-y-2">
                  {upcomingVisits.map((visit, index) => {
                    const member = familyState.familyMembers.find(m =>
                      m.visitSchedule?.some(v => v.date === visit.date && v.time === visit.time)
                    );
                    return (
                      <div
                        key={index}
                        className="p-3 border border-gray-300/20 rounded-lg bg-white/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <Users size={16} className="text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                              } text-gray-800`}>
                              {member?.name || 'Family Visit'}
                            </h3>
                            <p className={`${settings.fontSize === 'extra-large' ? 'text-sm' : 'text-xs'
                              } text-gray-600`}>
                              {format(new Date(visit.date), 'MMM do')} at {visit.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};