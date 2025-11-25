import React, { useState } from 'react';
import { CheckSquare, Plus, CreditCard as Edit, Trash2, Clock, Target, Calendar } from 'lucide-react';
import { useTasks } from '../../contexts/TaskContext';
import { usePatient } from '../../contexts/PatientContext';
import { Task } from '../../types';

interface CaregiverTasksProps {
  onNavigate: (page: string) => void;
}

export const CaregiverTasks: React.FC<CaregiverTasksProps> = ({ onNavigate }) => {
  const { state, dispatch } = useTasks();
  const { state: patientState } = usePatient();
  const { settings } = patientState.currentPatient || { settings: { fontSize: 'large', highContrast: true } };

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'medication' as 'medication' | 'meal' | 'hygiene' | 'exercise' | 'social' | 'other',
    estimatedDuration: 15,
    steps: [{ instruction: '', photo: '' }],
    schedule: {
      times: ['09:00'],
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0] as number[],
      startDate: new Date(),
    }
  });

  const categories = [
    { value: 'medication', label: 'Medication', color: 'bg-teal-500' },
    { value: 'meal', label: 'Meal', color: 'bg-gray-500' },
    { value: 'hygiene', label: 'Hygiene', color: 'bg-teal-400' },
    { value: 'exercise', label: 'Exercise', color: 'bg-gray-600' },
    { value: 'social', label: 'Social', color: 'bg-teal-300' },
    { value: 'other', label: 'Other', color: 'bg-gray-400' },
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

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const taskData: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      estimatedDuration: formData.estimatedDuration,
      steps: formData.steps.map((step, index) => ({
        id: `step-${index}`,
        instruction: step.instruction,
        photo: step.photo,
        isCompleted: false,
      })),
      isRecurring: true,
      schedule: formData.schedule,
      streakCount: editingTask?.streakCount || 0,
      isActive: true,
    };

    if (editingTask) {
      dispatch({ type: 'UPDATE_TASK', payload: taskData });
    } else {
      dispatch({ type: 'ADD_TASK', payload: taskData });
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'medication',
      estimatedDuration: 15,
      steps: [{ instruction: '', photo: '' }],
      schedule: {
        times: ['09:00'],
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
        startDate: new Date(),
      }
    });
    setShowAddForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      estimatedDuration: task.estimatedDuration,
      steps: task.steps.map(step => ({ instruction: step.instruction, photo: step.photo || '' })),
      schedule: task.schedule || {
        times: ['09:00'],
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
        startDate: new Date(),
      }
    });
    setEditingTask(task);
    setShowAddForm(true);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: id });
    }
  };

  const handleAddStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { instruction: '', photo: '' }]
    });
  };

  const handleRemoveStep = (index: number) => {
    if (formData.steps.length > 1) {
      setFormData({
        ...formData,
        steps: formData.steps.filter((_, i) => i !== index)
      });
    }
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, steps: newSteps });
  };

  const handleDayToggle = (day: number) => {
    const newDays = formData.schedule.daysOfWeek.includes(day)
      ? formData.schedule.daysOfWeek.filter(d => d !== day)
      : [...formData.schedule.daysOfWeek, day];
    setFormData({
      ...formData,
      schedule: { ...formData.schedule, daysOfWeek: newDays }
    });
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'bg-gray-500';
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
                Manage Patient Tasks
              </h1>
              <p className={`mt-1 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } text-gray-600`}>
                Create and monitor daily tasks for patient care
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
            >
              <Plus size={20} />
              Create Task
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 mb-8">
            <h2 className={`font-bold mb-6 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
              } text-gray-800`}>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700`}>
                    Task Title *
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

                {/* Duration */}
                <div>
                  <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700`}>
                    Estimated Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })}
                    min="5"
                    max="120"
                    className={`w-full px-4 py-3 border border-gray-300/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      }`}
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
                  placeholder="Additional details about this task..."
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value as any })}
                      className={`p-3 rounded-xl border transition-all duration-200 ${formData.category === cat.value
                        ? `${cat.color} text-white border-transparent shadow-lg`
                        : 'border-gray-300/30 text-gray-700 hover:border-teal-400 bg-white/30'
                        }`}
                    >
                      <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        }`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Task Steps */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } text-gray-700`}>
                    Task Steps
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="bg-gradient-to-br from-gray-500 to-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    Add Step
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={step.instruction}
                          onChange={(e) => handleStepChange(index, 'instruction', e.target.value)}
                          placeholder={`Step ${index + 1} instruction`}
                          className="w-full px-3 py-2 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white/50"
                        />
                      </div>
                      {formData.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(index)}
                          className="text-red-500 hover:text-red-600 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className={`block font-medium mb-3 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } text-gray-700`}>
                  Schedule
                </label>

                <div className="space-y-4">
                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.schedule.times[0]}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: { ...formData.schedule, times: [e.target.value] }
                      })}
                      className="px-3 py-2 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white/50"
                    />
                  </div>

                  {/* Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Days of Week</label>
                    <div className="flex gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleDayToggle(day.value)}
                          className={`w-12 h-12 rounded-full border transition-all duration-200 font-medium ${formData.schedule.daysOfWeek.includes(day.value)
                            ? 'bg-gradient-to-br from-teal-400 to-teal-500 text-white border-teal-500 shadow-lg'
                            : 'border-gray-300/30 text-gray-700 hover:border-teal-400 bg-white/30'
                            }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`flex-1 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    }`}
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTask(null);
                    setFormData({
                      title: '',
                      description: '',
                      category: 'medication',
                      estimatedDuration: 15,
                      steps: [{ instruction: '', photo: '' }],
                      schedule: {
                        times: ['09:00'],
                        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
                        startDate: new Date(),
                      }
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
        {
          state.tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.tasks.map((task) => (
                <div
                  key={task.id}
                  className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getCategoryColor(task.category)
                      }`}>
                      {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 rounded text-gray-500 hover:text-teal-500 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 rounded text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Task Content */}
                  <div className="mb-4">
                    <h3 className={`font-bold mb-2 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
                      } text-gray-800`}>
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className={`mb-3 ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        } text-gray-600`}>
                        {task.description}
                      </p>
                    )}

                    {/* Task Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{task.estimatedDuration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target size={12} />
                        <span>{task.steps.length} steps</span>
                      </div>
                      {task.schedule && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{getDayNames(task.schedule.daysOfWeek)}</span>
                        </div>
                      )}
                    </div>

                    {/* Schedule Info */}
                    {task.schedule && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Time:</span> {task.schedule.times.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Task Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${task.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      <span className="text-sm text-gray-600">
                        {task.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {task.streakCount > 0 && (
                      <div className="flex items-center gap-1 text-teal-500">
                        <span className="text-sm font-bold">🔥 {task.streakCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-12 text-center">
              <CheckSquare size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className={`font-semibold mb-2 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
                } text-gray-800`}>
                No tasks created yet
              </h3>
              <p className={`mb-6 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } text-gray-600`}>
                Create your first task to help guide patient care
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className={`bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  }`}
              >
                Create First Task
              </button>
            </div>
          )
        }
      </div >
    </div >
  );
};