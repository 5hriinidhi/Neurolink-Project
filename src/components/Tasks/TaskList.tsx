import React, { useState } from 'react';
import { CheckSquare, Plus, Play, Pause, Clock, Calendar, Target, Flame, CreditCard as Edit, Trash2 } from 'lucide-react';
import { useTasks } from '../../contexts/TaskContext';
import { usePatient } from '../../contexts/PatientContext';
import { Task, TaskStep } from '../../types';

interface TaskListProps {
  onNavigate: (page: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onNavigate }) => {
  const { state, dispatch } = useTasks();
  const { state: patientState } = usePatient();
  const { settings } = patientState.currentPatient || { settings: { fontSize: 'large', highContrast: true } };
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const todaysTasks = state.tasks.filter(task => {
    if (!task.isActive || !task.schedule) return false;
    const today = new Date().getDay();
    return task.schedule.daysOfWeek.includes(today);
  });

  const completedTasks = todaysTasks.filter(task => 
    task.steps.every(step => step.isCompleted)
  );

  const handleStartTask = (task: Task) => {
    setSelectedTask(task);
    setCurrentStep(0);
  };

  const handleCompleteStep = (stepId: string) => {
    if (!selectedTask) return;
    dispatch({ type: 'COMPLETE_STEP', payload: { taskId: selectedTask.id, stepId } });
    
    const updatedTask = {
      ...selectedTask,
      steps: selectedTask.steps.map(step =>
        step.id === stepId ? { ...step, isCompleted: true } : step
      )
    };
    setSelectedTask(updatedTask);

    // Move to next step
    const nextIncompleteStep = updatedTask.steps.findIndex(step => !step.isCompleted);
    if (nextIncompleteStep === -1) {
      // Task completed
      dispatch({ type: 'COMPLETE_TASK', payload: { taskId: selectedTask.id } });
      setSelectedTask(null);
      setCurrentStep(0);
    } else {
      setCurrentStep(nextIncompleteStep);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'bg-gradient-to-br from-orange-500 to-orange-600';
      case 'meal': return 'bg-gradient-to-br from-gray-500 to-gray-600';
      case 'hygiene': return 'bg-gradient-to-br from-orange-300 to-orange-400';
      case 'exercise': return 'bg-gradient-to-br from-gray-600 to-orange-400';
      case 'social': return 'bg-gradient-to-br from-orange-400 to-orange-500';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-500';
    }
  };

  if (selectedTask) {
    const currentStepData = selectedTask.steps[currentStep];
    const progress = (selectedTask.steps.filter(s => s.isCompleted).length / selectedTask.steps.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-orange-50 relative overflow-hidden">
        {/* Background Balls */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-20 animate-float-slow blur-sm" />
          <div className="absolute bottom-32 right-20 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-15 animate-float-medium" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full opacity-25 animate-float-fast blur-xs" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-6 sm:p-8">
            {/* Task Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className={`font-bold ${
                  settings.fontSize === 'extra-large' ? 'text-3xl' : 'text-2xl'
                } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
                  {selectedTask.title}
                </h1>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-orange-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Current Step */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="text-center mb-6">
                <h2 className={`font-bold mb-2 ${
                  settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
                } text-gray-800`}>
                  Step {currentStep + 1} of {selectedTask.steps.length}
                </h2>
                <p className={`${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } text-gray-600`}>
                  {currentStepData?.instruction}
                </p>
              </div>

              {currentStepData?.photo && (
                <div className="mb-6 text-center">
                  <img
                    src={currentStepData.photo}
                    alt="Step illustration"
                    className="max-w-xs mx-auto rounded-lg shadow-lg"
                  />
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={() => handleCompleteStep(currentStepData.id)}
                  className="bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <CheckSquare size={24} className="inline mr-2" />
                  Complete Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-orange-50 relative overflow-hidden">
      {/* Background Balls */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-20 animate-float-slow blur-sm" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-15 animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full opacity-25 animate-float-fast blur-xs" />
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-gray-500 to-orange-400 rounded-full opacity-20 animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-br from-orange-500 to-gray-500 rounded-full opacity-30 animate-float-medium blur-sm" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pb-40">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-3xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`font-bold ${
                settings.fontSize === 'extra-large' ? 'text-3xl' : 'text-2xl'
              } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
                Daily Tasks
              </h1>
              <p className={`mt-1 ${
                settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
                {completedTasks.length} of {todaysTasks.length} tasks completed today
              </p>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              }`}
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>

          {/* Progress Overview */}
          {todaysTasks.length > 0 && (
            <div className="mt-6 p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Today's Progress</span>
                <span className="font-bold text-orange-600">
                  {Math.round((completedTasks.length / todaysTasks.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(completedTasks.length / todaysTasks.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Task Cards */}
        {todaysTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todaysTasks.map((task) => {
              const isCompleted = task.steps.every(step => step.isCompleted);
              const completedSteps = task.steps.filter(step => step.isCompleted).length;
              
              return (
                <div
                  key={task.id}
                  className={`backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl hover:scale-105 ${
                    settings.highContrast ? 'border-black/50' : ''
                  }`}
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
                      getCategoryColor(task.category)
                    }`}>
                      {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </span>
                    {task.streakCount > 0 && (
                      <div className="flex items-center gap-1 text-orange-500">
                        <Flame size={16} />
                        <span className="text-sm font-bold">{task.streakCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Task Content */}
                  <div className="mb-4">
                    <h3 className={`font-bold mb-2 ${
                      settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
                    } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className={`mb-3 ${
                        settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                    )}

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">
                          {completedSteps}/{task.steps.length} steps
                        </span>
                        <span className="text-xs text-orange-600">
                          {Math.round((completedSteps / task.steps.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(completedSteps / task.steps.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Task Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{task.estimatedDuration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target size={12} />
                        <span>{task.steps.length} steps</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-center">
                    {isCompleted ? (
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <CheckSquare size={16} />
                        Completed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartTask(task)}
                        className="bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                      >
                        <Play size={16} />
                        Start Task
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-3xl shadow-2xl p-12 text-center">
            <CheckSquare size={64} className={`mx-auto mb-4 ${settings.highContrast ? 'text-black' : 'text-gray-400'}`} />
            <h3 className={`font-semibold mb-2 ${
              settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
            } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
              No tasks scheduled for today
            </h3>
            <p className={`mb-6 ${
              settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
            } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
              Enjoy your free time or add a new task to get started
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className={`bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              }`}
            >
              Add Your First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};