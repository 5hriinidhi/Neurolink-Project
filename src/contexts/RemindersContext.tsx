import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Reminder } from '../types';

interface RemindersState {
  reminders: Reminder[];
  activeReminder: Reminder | null;
  snoozedReminders: Set<string>;
}

type RemindersAction =
  | { type: 'SET_REMINDERS'; payload: Reminder[] }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'SET_ACTIVE_REMINDER'; payload: Reminder | null }
  | { type: 'SNOOZE_REMINDER'; payload: string }
  | { type: 'DISMISS_REMINDER'; payload: string };

const initialState: RemindersState = {
  reminders: [],
  activeReminder: null,
  snoozedReminders: new Set(),
};

const remindersReducer = (state: RemindersState, action: RemindersAction): RemindersState => {
  switch (action.type) {
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, action.payload] };
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id ? action.payload : reminder
        ),
      };
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload),
      };
    case 'SET_ACTIVE_REMINDER':
      return { ...state, activeReminder: action.payload };
    case 'SNOOZE_REMINDER':
      return {
        ...state,
        snoozedReminders: new Set([...state.snoozedReminders, action.payload]),
        activeReminder: state.activeReminder?.id === action.payload ? null : state.activeReminder,
      };
    case 'DISMISS_REMINDER':
      return {
        ...state,
        activeReminder: state.activeReminder?.id === action.payload ? null : state.activeReminder,
      };
    default:
      return state;
  }
};

const RemindersContext = createContext<{
  state: RemindersState;
  dispatch: React.Dispatch<RemindersAction>;
} | null>(null);

export const RemindersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(remindersReducer, initialState);

  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      try {
        const reminders = JSON.parse(savedReminders);
        dispatch({ type: 'SET_REMINDERS', payload: reminders });
      } catch (error) {
        console.error('Error loading reminders:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(state.reminders));
  }, [state.reminders]);

  return (
    <RemindersContext.Provider value={{ state, dispatch }}>
      {children}
    </RemindersContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};