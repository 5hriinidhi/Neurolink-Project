import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Patient, ActivityLog, BiometricData } from '../types';

interface PatientState {
  currentPatient: Patient | null;
  activityLogs: ActivityLog[];
  biometricData: BiometricData[];
  isLoading: boolean;
  error: string | null;
}

type PatientAction =
  | { type: 'SET_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Partial<Patient> }
  | { type: 'ADD_ACTIVITY_LOG'; payload: ActivityLog }
  | { type: 'ADD_BIOMETRIC_DATA'; payload: BiometricData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_PATIENT' };

const defaultPatient: Patient = {
  id: '1',
  name: 'John',
  dateOfBirth: new Date('1945-06-15'),
  emergencyContacts: [],
  caregivers: [],
  settings: {
    fontSize: 'large',
    highContrast: true,
    voiceEnabled: true,
    voiceSpeed: 1.0,
    notificationVolume: 0.8,
    reminderAdvanceTime: 15,
    autoPlayMemories: false,
    emergencyButtonVisible: true,
    simplifiedInterface: false,
    colorTheme: 'warm',
    language: 'en',
    timeFormat: '12h',
    enableGPS: false,
    enableBiometrics: false,
    enableWeatherAlerts: true,
  },
  currentLocation: 'home',
  lastActivity: new Date(),
};

const initialState: PatientState = {
  currentPatient: defaultPatient,
  activityLogs: [],
  biometricData: [],
  isLoading: false,
  error: null,
};

const patientReducer = (state: PatientState, action: PatientAction): PatientState => {
  switch (action.type) {
    case 'SET_PATIENT':
      return { ...state, currentPatient: action.payload, error: null };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        currentPatient: state.currentPatient
          ? { ...state.currentPatient, ...action.payload }
          : null,
      };
    case 'ADD_ACTIVITY_LOG':
      return {
        ...state,
        activityLogs: [action.payload, ...state.activityLogs].slice(0, 1000), // Keep last 1000 logs
      };
    case 'ADD_BIOMETRIC_DATA':
      return {
        ...state,
        biometricData: [action.payload, ...state.biometricData].slice(0, 500), // Keep last 500 readings
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_PATIENT':
      return { ...initialState, currentPatient: null };
    default:
      return state;
  }
};

const PatientContext = createContext<{
  state: PatientState;
  dispatch: React.Dispatch<PatientAction>;
} | null>(null);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(patientReducer, initialState);

  useEffect(() => {
    // Load patient data from localStorage
    const savedPatient = localStorage.getItem('currentPatient');
    const savedLogs = localStorage.getItem('activityLogs');
    const savedBiometrics = localStorage.getItem('biometricData');

    if (savedPatient) {
      try {
        const patient = JSON.parse(savedPatient);
        // Merge with default settings to ensure all properties exist
        const mergedPatient = {
          ...defaultPatient,
          ...patient,
          settings: {
            ...defaultPatient.settings,
            ...patient.settings
          }
        };
        dispatch({ type: 'SET_PATIENT', payload: mergedPatient });
      } catch (error) {
        console.error('Error loading patient data:', error);
        dispatch({ type: 'SET_PATIENT', payload: defaultPatient });
      }
    }

    if (savedLogs) {
      try {
        const logs = JSON.parse(savedLogs);
        logs.forEach((log: ActivityLog) => {
          dispatch({ type: 'ADD_ACTIVITY_LOG', payload: log });
        });
      } catch (error) {
        console.error('Error loading activity logs:', error);
      }
    }

    if (savedBiometrics) {
      try {
        const biometrics = JSON.parse(savedBiometrics);
        biometrics.forEach((data: BiometricData) => {
          dispatch({ type: 'ADD_BIOMETRIC_DATA', payload: data });
        });
      } catch (error) {
        console.error('Error loading biometric data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save patient data to localStorage
    if (state.currentPatient) {
      localStorage.setItem('currentPatient', JSON.stringify(state.currentPatient));
    }
  }, [state.currentPatient]);

  useEffect(() => {
    // Save activity logs to localStorage
    localStorage.setItem('activityLogs', JSON.stringify(state.activityLogs));
  }, [state.activityLogs]);

  useEffect(() => {
    // Save biometric data to localStorage
    localStorage.setItem('biometricData', JSON.stringify(state.biometricData));
  }, [state.biometricData]);

  return (
    <PatientContext.Provider value={{ state, dispatch }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};