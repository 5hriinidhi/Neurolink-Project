import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Reminder, CaregiverAlert, WeatherAlert } from '../types';

interface ReminderState {
  reminders: Reminder[];
  activeReminder: Reminder | null;
  caregiverAlerts: CaregiverAlert[];
  weatherAlerts: WeatherAlert[];
  snoozedReminders: Set<string>;
  missedReminders: Reminder[];
}

type ReminderAction =
  | { type: 'SET_REMINDERS'; payload: Reminder[] }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'SET_ACTIVE_REMINDER'; payload: Reminder | null }
  | { type: 'SNOOZE_REMINDER'; payload: string }
  | { type: 'DISMISS_REMINDER'; payload: string }
  | { type: 'MARK_MISSED'; payload: Reminder }
  | { type: 'ADD_CAREGIVER_ALERT'; payload: CaregiverAlert }
  | { type: 'UPDATE_CAREGIVER_ALERT'; payload: CaregiverAlert }
  | { type: 'ADD_WEATHER_ALERT'; payload: WeatherAlert }
  | { type: 'CLEAR_EXPIRED_WEATHER_ALERTS' };

const initialState: ReminderState = {
  reminders: [],
  activeReminder: null,
  caregiverAlerts: [],
  weatherAlerts: [],
  snoozedReminders: new Set(),
  missedReminders: [],
};

const reminderReducer = (state: ReminderState, action: ReminderAction): ReminderState => {
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
      const newSnoozed = new Set(state.snoozedReminders);
      newSnoozed.add(action.payload);
      return {
        ...state,
        snoozedReminders: newSnoozed,
        activeReminder: state.activeReminder?.id === action.payload ? null : state.activeReminder,
      };
    case 'DISMISS_REMINDER':
      return {
        ...state,
        activeReminder: state.activeReminder?.id === action.payload ? null : state.activeReminder,
      };
    case 'MARK_MISSED':
      return {
        ...state,
        missedReminders: [action.payload, ...state.missedReminders].slice(0, 50),
      };
    case 'ADD_CAREGIVER_ALERT':
      return {
        ...state,
        caregiverAlerts: [action.payload, ...state.caregiverAlerts].slice(0, 100),
      };
    case 'UPDATE_CAREGIVER_ALERT':
      return {
        ...state,
        caregiverAlerts: state.caregiverAlerts.map(alert =>
          alert.id === action.payload.id ? action.payload : alert
        ),
      };
    case 'ADD_WEATHER_ALERT':
      return {
        ...state,
        weatherAlerts: [action.payload, ...state.weatherAlerts].slice(0, 10),
      };
    case 'CLEAR_EXPIRED_WEATHER_ALERTS':
      const now = new Date();
      return {
        ...state,
        weatherAlerts: state.weatherAlerts.filter(alert => alert.expiresAt > now),
      };
    default:
      return state;
  }
};

const ReminderContext = createContext<{
  state: ReminderState;
  dispatch: React.Dispatch<ReminderAction>;
} | null>(null);

export const ReminderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reminderReducer, initialState);

  useEffect(() => {
    // Load reminders from localStorage
    const savedReminders = localStorage.getItem('reminders');
    const savedAlerts = localStorage.getItem('caregiverAlerts');

    if (savedReminders) {
      try {
        const reminders = JSON.parse(savedReminders);
        dispatch({ type: 'SET_REMINDERS', payload: reminders });
      } catch (error) {
        console.error('Error loading reminders:', error);
      }
    }

    if (savedAlerts) {
      try {
        const alerts = JSON.parse(savedAlerts);
        alerts.forEach((alert: CaregiverAlert) => {
          dispatch({ type: 'ADD_CAREGIVER_ALERT', payload: alert });
        });
      } catch (error) {
        console.error('Error loading caregiver alerts:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save reminders to localStorage
    localStorage.setItem('reminders', JSON.stringify(state.reminders));
  }, [state.reminders]);

  useEffect(() => {
    // Save caregiver alerts to localStorage
    localStorage.setItem('caregiverAlerts', JSON.stringify(state.caregiverAlerts));
  }, [state.caregiverAlerts]);

  return (
    <ReminderContext.Provider value={{ state, dispatch }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};