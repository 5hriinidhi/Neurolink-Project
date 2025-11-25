import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task } from '../types';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  completedTasks: Task[];
  streaks: Record<string, number>;
}

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_CURRENT_TASK'; payload: Task | null }
  | { type: 'COMPLETE_TASK'; payload: { taskId: string; completionPhoto?: string } }
  | { type: 'COMPLETE_STEP'; payload: { taskId: string; stepId: string } }
  | { type: 'RESET_TASK'; payload: string }
  | { type: 'UPDATE_STREAK'; payload: { taskId: string; count: number } };

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Medication',
    description: 'Take prescribed morning pills with water',
    category: 'medication',
    estimatedDuration: 5,
    steps: [
      { id: 's1', instruction: 'Locate pill organizer', isCompleted: false },
      { id: 's2', instruction: 'Take pills from "Morning" slot', isCompleted: false },
      { id: 's3', instruction: 'Drink a full glass of water', isCompleted: false }
    ],
    isRecurring: true,
    schedule: {
      times: ['08:00'],
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      startDate: new Date()
    },
    streakCount: 5,
    isActive: true
  },
  {
    id: '2',
    title: 'Afternoon Walk',
    description: 'Light exercise in the garden',
    category: 'exercise',
    estimatedDuration: 20,
    steps: [
      { id: 'w1', instruction: 'Put on comfortable shoes', isCompleted: false },
      { id: 'w2', instruction: 'Walk for 15 minutes', isCompleted: false },
      { id: 'w3', instruction: 'Drink water afterwards', isCompleted: false }
    ],
    isRecurring: true,
    schedule: {
      times: ['16:00'],
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      startDate: new Date()
    },
    streakCount: 3,
    isActive: true
  },
  {
    id: '3',
    title: 'Hydration Check',
    description: 'Drink a glass of water',
    category: 'hygiene',
    estimatedDuration: 2,
    steps: [
      { id: 'h1', instruction: 'Fill glass with water', isCompleted: false },
      { id: 'h2', instruction: 'Drink slowly', isCompleted: false }
    ],
    isRecurring: true,
    schedule: {
      times: ['11:00', '14:00', '17:00'],
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      startDate: new Date()
    },
    streakCount: 12,
    isActive: true
  }
];

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  completedTasks: [],
  streaks: {},
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'SET_CURRENT_TASK':
      return { ...state, currentTask: action.payload };
    case 'COMPLETE_TASK':
      const taskToComplete = state.tasks.find(t => t.id === action.payload.taskId);
      if (!taskToComplete) return state;

      const completedTask = {
        ...taskToComplete,
        lastCompleted: new Date(),
        streakCount: taskToComplete.streakCount + 1,
        steps: taskToComplete.steps.map(step => ({ ...step, isCompleted: true })),
      };

      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId ? completedTask : task
        ),
        completedTasks: [completedTask, ...state.completedTasks].slice(0, 100),
        streaks: {
          ...state.streaks,
          [action.payload.taskId]: completedTask.streakCount,
        },
      };
    case 'COMPLETE_STEP':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? {
              ...task,
              steps: task.steps.map(step =>
                step.id === action.payload.stepId
                  ? { ...step, isCompleted: true, completedAt: new Date() }
                  : step
              ),
            }
            : task
        ),
      };
    case 'RESET_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? {
              ...task,
              steps: task.steps.map(step => ({ ...step, isCompleted: false, completedAt: undefined })),
            }
            : task
        ),
      };
    case 'UPDATE_STREAK':
      return {
        ...state,
        streaks: {
          ...state.streaks,
          [action.payload.taskId]: action.payload.count,
        },
      };
    default:
      return state;
  }
};

const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
} | null>(null);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    const savedStreaks = localStorage.getItem('taskStreaks');

    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        if (tasks.length > 0) {
          dispatch({ type: 'SET_TASKS', payload: tasks });
        } else {
          // Seed default tasks if empty
          dispatch({ type: 'SET_TASKS', payload: defaultTasks });
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        // Fallback to default tasks on error
        dispatch({ type: 'SET_TASKS', payload: defaultTasks });
      }
    } else {
      // Seed default tasks if no storage
      dispatch({ type: 'SET_TASKS', payload: defaultTasks });
    }

    if (savedStreaks) {
      try {
        const streaks = JSON.parse(savedStreaks);
        Object.entries(streaks).forEach(([taskId, count]) => {
          dispatch({ type: 'UPDATE_STREAK', payload: { taskId, count: count as number } });
        });
      } catch (error) {
        console.error('Error loading task streaks:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  useEffect(() => {
    // Save streaks to localStorage
    localStorage.setItem('taskStreaks', JSON.stringify(state.streaks));
  }, [state.streaks]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};