import React, { useState } from 'react';
import { Clock, Plus, Bell, BellOff, CreditCard as Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { useReminders } from '../../contexts/RemindersContext';
import { usePatient } from '../../contexts/PatientContext';
import { Reminder } from '../../types';

interface CaregiverRemindersProps {
  onNavigate: (page: string) => void;
}

export const CaregiverReminders: React.FC<CaregiverRemindersProps> = () => {
  const { state, dispatch } = useReminders();
  const { state: patientState } = usePatient();
  const { settings } = patientState.currentPatient || { settings: { fontSize: 'large', highContrast: true } };

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    category: 'medication' as 'medication' | 'meal' | 'appointment' | 'routine',
    isRecurring: true,
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0] as number[],
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const categories = [
    { value: 'medication', label: 'Medication', color: 'bg-teal-500', description: 'Medicine reminders' },
    { value: 'meal', label: 'Meal', color: 'bg-gray-500', description: 'Eating reminders' },
    { value: 'appointment', label: 'Appointment', color: 'bg-teal-400', description: 'Medical appointments' },
    { value: 'routine', label: 'Routine', color: 'bg-gray-600', description: 'Daily activities' },
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'bg-gray-400', description: 'Optional reminder' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-teal-400', description: 'Important reminder' },
    { value: 'high', label: 'High Priority', color: 'bg-teal-500', description: 'Critical reminder' },
  ];

  const daysOfWeek = [
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 0, label: 'Sun' },
  ];

  const handleToggleActive = (reminder: Reminder) => {
    const updatedReminder = { ...reminder, isActive: !reminder.isActive };
    dispatch({ type: 'UPDATE_REMINDER', payload: updatedReminder });
  };

  const handleDeleteReminder = (id: string) => {
    if (confirm('Are you sure you want to delete this reminder? This will also remove it from the patient\'s view.')) {
      dispatch({ type: 'DELETE_REMINDER', payload: id });
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    const reminderData: Reminder = {
      ...formData,
      id: editingReminder?.id || Date.now().toString(),
      isActive: true,
      message: formData.description || formData.title,
      type: formData.category === 'routine' ? 'task' : formData.category as any,
      scheduledTime: new Date(), // This would ideally be set based on time
      snoozeCount: 0,
      maxSnoozes: 3,
      isRecurring: formData.isRecurring,
      daysOfWeek: formData.daysOfWeek,
      priority: formData.priority as 'low' | 'medium' | 'high' | 'critical',
    };

    if (editingReminder) {
      dispatch({ type: 'UPDATE_REMINDER', payload: reminderData });
    } else {
      dispatch({ type: 'ADD_REMINDER', payload: reminderData });
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      time: '',
      category: 'medication',
      isRecurring: true,
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      priority: 'medium',
    });
    setShowAddForm(false);
    setEditingReminder(null);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      time: reminder.time || '',
      category: (reminder.category || 'medication') as 'medication' | 'meal' | 'appointment' | 'routine',
      isRecurring: reminder.isRecurring,
      daysOfWeek: reminder.daysOfWeek || [1, 2, 3, 4, 5, 6, 0],
      priority: (reminder.priority === 'critical' ? 'high' : reminder.priority) as 'low' | 'medium' | 'high',
    });
    setEditingReminder(reminder);
    setShowAddForm(true);
  };

  const handleDayToggle = (day: number) => {
    const newDays = formData.daysOfWeek.includes(day)
      ? formData.daysOfWeek.filter(d => d !== day)
      : [...formData.daysOfWeek, day];
    setFormData({ ...formData, daysOfWeek: newDays });
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const p = priorityLevels.find(p => p.value === priority);
    return p?.color || 'bg-gray-400';
  };

  const getDayNames = (days: number[]) => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return 'Weekdays';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
    return days.map(d => daysOfWeek.find(day => day.value === d)?.label).join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-teal-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-teal-500/20 rounded-full blur-xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-gray-400/15 to-gray-500/15 rounded-full blur-lg animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-emerald-300/25 to-emerald-400/25 rounded-full blur-xl animate-float-fast" />
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-gray-500/20 to-teal-400/20 rounded-full blur-lg animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-br from-teal-500/30 to-gray-500/30 rounded-full blur-xl animate-float-medium" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pb-40">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-3xl' : 'text-2xl'
                } text-gray-800`}>
                Patient Reminders
              </h1>
              <p className={`mt-1 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } text-gray-600`}>
                Create and manage reminders that will appear for the patient
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
            >
              <Plus size={20} />
              Create Reminder
            </button>
          </div>

          {/* Info Banner */}
          <div className="mt-6 p-4 bg-teal-50/50 border border-teal-200/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-teal-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`font-medium text-teal-800 ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                  }`}>
                  Caregiver Reminder Management
                </p>
                <p className={`text-teal-700 ${settings.fontSize === 'extra-large' ? 'text-sm' : 'text-xs'
                  }`}>
                  Reminders created here will automatically appear for the patient at the scheduled times. High priority reminders will also send alerts to caregivers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 mb-8">
            <h2 className={`font-bold mb-6 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
              } text-gray-800`}>
              {editingReminder ? 'Edit Patient Reminder' : 'Create Patient Reminder'}
            </h2>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700`}>
                    Reminder Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Take morning medication"
                    className={`w-full px-4 py-3 border border-gray-300/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      }`}
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700`}>
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      }`}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } text-gray-700`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details for the patient..."
                  rows={3}
                  className={`w-full px-4 py-3 border border-gray-300/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    }`}
                />
              </div>

              {/* Category */}
              <div>
                <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } text-gray-700`}>
                  Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value as any })}
                      className={`p-4 rounded-xl border transition-all duration-200 text-left ${formData.category === cat.value
                        ? `${cat.color} text-white border-transparent shadow-lg`
                        : 'border-gray-300/30 text-gray-700 hover:border-teal-400 bg-white/30'
                        }`}
                    >
                      <span className={`font-medium block ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        }`}>
                        {cat.label}
                      </span>
                      <span className={`text-xs opacity-75 ${formData.category === cat.value ? 'text-white' : 'text-gray-500'
                        }`}>
                        {cat.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } text-gray-700`}>
                  Priority Level
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {priorityLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: level.value as any })}
                      className={`p-4 rounded-xl border transition-all duration-200 text-left ${formData.priority === level.value
                        ? `${level.color} text-white border-transparent shadow-lg`
                        : 'border-gray-300/30 text-gray-700 hover:border-teal-400 bg-white/30'
                        }`}
                    >
                      <span className={`font-medium block ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        }`}>
                        {level.label}
                      </span>
                      <span className={`text-xs opacity-75 ${formData.priority === level.value ? 'text-white' : 'text-gray-500'
                        }`}>
                        {level.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recurring */}
              <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-gray-300/20">
                <div>
                  <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700`}>
                    Recurring reminder
                  </span>
                  <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    } text-gray-500`}>
                    Repeat this reminder on selected days
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>

              {/* Days of Week */}
              {formData.isRecurring && (
                <div>
                  <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700`}>
                    Days of Week
                  </label>
                  <div className="flex gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => handleDayToggle(day.value)}
                        className={`w-12 h-12 rounded-full border transition-all duration-200 font-medium ${formData.daysOfWeek.includes(day.value)
                          ? 'bg-gradient-to-br from-teal-400 to-teal-500 text-white border-teal-500 shadow-lg'
                          : 'border-gray-300/30 text-gray-700 hover:border-teal-400 bg-white/30'
                          }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`flex-1 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    }`}
                >
                  {editingReminder ? 'Update Reminder' : 'Create Reminder'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReminder(null);
                    setFormData({
                      title: '',
                      description: '',
                      time: '',
                      category: 'medication',
                      isRecurring: true,
                      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
                      priority: 'medium',
                    });
                  }}
                  className={`px-6 py-3 border border-gray-300/30 rounded-xl font-semibold transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-700 hover:border-teal-400 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reminder List */}
        {state.reminders.length > 0 ? (
          <div className="space-y-4">
            {state.reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getCategoryColor(reminder.category || 'medication')
                        }`}>
                        {(reminder.category || 'medication').charAt(0).toUpperCase() + (reminder.category || 'medication').slice(1)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${getPriorityColor(reminder.priority)
                        }`}>
                        {reminder.priority} priority
                      </span>
                      {reminder.priority === 'high' && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100/50 text-red-800">
                          Caregiver Alert
                        </span>
                      )}
                    </div>

                    <h3 className={`font-bold mb-1 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
                      } text-gray-800`}>
                      {reminder.title}
                    </h3>

                    {reminder.description && (
                      <p className={`mb-2 ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        } text-gray-600`}>
                        {reminder.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{reminder.time}</span>
                      </div>
                      {reminder.isRecurring && (
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{getDayNames(reminder.daysOfWeek || [])}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(reminder)}
                      className={`p-2 rounded-xl transition-all duration-200 ${reminder.isActive
                        ? 'bg-green-100/50 text-green-600 hover:bg-green-200/50'
                        : 'bg-gray-100/50 text-gray-400 hover:bg-gray-200/50'
                        }`}
                      title={reminder.isActive ? 'Active' : 'Inactive'}
                    >
                      {reminder.isActive ? <Bell size={20} /> : <BellOff size={20} />}
                    </button>

                    <button
                      onClick={() => handleEditReminder(reminder)}
                      className="p-2 rounded-xl bg-teal-100/50 text-teal-600 hover:bg-teal-200/50 transition-all duration-200"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>

                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="p-2 rounded-xl bg-red-100/50 text-red-600 hover:bg-red-200/50 transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-12 text-center">
            <Clock size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className={`font-semibold mb-2 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
              } text-gray-800`}>
              No patient reminders yet
            </h3>
            <p className={`mb-6 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              } text-gray-600`}>
              Create reminders to help guide patient care throughout the day
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className={`bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
            >
              Create First Reminder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};