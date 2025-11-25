import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { UserSettings, EmergencyContact } from '../types';

interface SettingsState {
  settings: UserSettings;
  emergencyContacts: EmergencyContact[];
}

type SettingsAction =
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_EMERGENCY_CONTACTS'; payload: EmergencyContact[] }
  | { type: 'ADD_EMERGENCY_CONTACT'; payload: EmergencyContact }
  | { type: 'UPDATE_EMERGENCY_CONTACT'; payload: EmergencyContact }
  | { type: 'DELETE_EMERGENCY_CONTACT'; payload: string };

const defaultSettings: UserSettings = {
  fontSize: 'large',
  highContrast: true,
  voiceEnabled: true,
  notificationVolume: 0.8,
  reminderAdvanceTime: 15,
  autoPlayMemories: false,
};

const initialState: SettingsState = {
  settings: defaultSettings,
  emergencyContacts: [],
};

const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'SET_EMERGENCY_CONTACTS':
      return { ...state, emergencyContacts: action.payload };
    case 'ADD_EMERGENCY_CONTACT':
      return {
        ...state,
        emergencyContacts: [...state.emergencyContacts, action.payload],
      };
    case 'UPDATE_EMERGENCY_CONTACT':
      return {
        ...state,
        emergencyContacts: state.emergencyContacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        ),
      };
    case 'DELETE_EMERGENCY_CONTACT':
      return {
        ...state,
        emergencyContacts: state.emergencyContacts.filter(
          contact => contact.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

const SettingsContext = createContext<{
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
} | null>(null);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    const savedContacts = localStorage.getItem('emergencyContacts');
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    if (savedContacts) {
      try {
        const contacts = JSON.parse(savedContacts);
        dispatch({ type: 'SET_EMERGENCY_CONTACTS', payload: contacts });
      } catch (error) {
        console.error('Error loading emergency contacts:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(state.settings));
  }, [state.settings]);

  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(state.emergencyContacts));
  }, [state.emergencyContacts]);

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};