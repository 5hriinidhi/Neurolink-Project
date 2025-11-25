import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { RoomLabel, NavigationBreadcrumb, SafeZone } from '../types';

interface NavigationState {
  roomLabels: RoomLabel[];
  breadcrumbs: NavigationBreadcrumb[];
  safeZones: SafeZone[];
  currentLocation: string;
  isDisoriented: boolean;
  lastKnownLocation: { lat: number; lng: number } | null;
}

type NavigationAction =
  | { type: 'SET_ROOM_LABELS'; payload: RoomLabel[] }
  | { type: 'ADD_ROOM_LABEL'; payload: RoomLabel }
  | { type: 'UPDATE_ROOM_LABEL'; payload: RoomLabel }
  | { type: 'DELETE_ROOM_LABEL'; payload: string }
  | { type: 'ADD_BREADCRUMB'; payload: NavigationBreadcrumb }
  | { type: 'CLEAR_BREADCRUMBS' }
  | { type: 'SET_SAFE_ZONES'; payload: SafeZone[] }
  | { type: 'ADD_SAFE_ZONE'; payload: SafeZone }
  | { type: 'UPDATE_SAFE_ZONE'; payload: SafeZone }
  | { type: 'SET_CURRENT_LOCATION'; payload: string }
  | { type: 'SET_DISORIENTED'; payload: boolean }
  | { type: 'UPDATE_GPS_LOCATION'; payload: { lat: number; lng: number } };

const initialState: NavigationState = {
  roomLabels: [
    {
      id: '1',
      name: 'Living Room',
      description: 'Where you watch TV and relax',
      icon: 'Sofa',
      color: 'bg-blue-500',
      isActive: true,
    },
    {
      id: '2',
      name: 'Kitchen',
      description: 'Where you prepare and eat meals',
      icon: 'ChefHat',
      color: 'bg-green-500',
      isActive: true,
    },
    {
      id: '3',
      name: 'Bedroom',
      description: 'Where you sleep and rest',
      icon: 'Bed',
      color: 'bg-purple-500',
      isActive: true,
    },
    {
      id: '4',
      name: 'Bathroom',
      description: 'Where you wash and use the toilet',
      icon: 'Bath',
      color: 'bg-cyan-500',
      isActive: true,
    },
  ],
  breadcrumbs: [],
  safeZones: [],
  currentLocation: 'home',
  isDisoriented: false,
  lastKnownLocation: null,
};

const navigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  switch (action.type) {
    case 'SET_ROOM_LABELS':
      return { ...state, roomLabels: action.payload };
    case 'ADD_ROOM_LABEL':
      return { ...state, roomLabels: [...state.roomLabels, action.payload] };
    case 'UPDATE_ROOM_LABEL':
      return {
        ...state,
        roomLabels: state.roomLabels.map(room =>
          room.id === action.payload.id ? action.payload : room
        ),
      };
    case 'DELETE_ROOM_LABEL':
      return {
        ...state,
        roomLabels: state.roomLabels.filter(room => room.id !== action.payload),
      };
    case 'ADD_BREADCRUMB':
      return {
        ...state,
        breadcrumbs: [action.payload, ...state.breadcrumbs].slice(0, 50), // Keep last 50 breadcrumbs
      };
    case 'CLEAR_BREADCRUMBS':
      return { ...state, breadcrumbs: [] };
    case 'SET_SAFE_ZONES':
      return { ...state, safeZones: action.payload };
    case 'ADD_SAFE_ZONE':
      return { ...state, safeZones: [...state.safeZones, action.payload] };
    case 'UPDATE_SAFE_ZONE':
      return {
        ...state,
        safeZones: state.safeZones.map(zone =>
          zone.id === action.payload.id ? action.payload : zone
        ),
      };
    case 'SET_CURRENT_LOCATION':
      return { ...state, currentLocation: action.payload };
    case 'SET_DISORIENTED':
      return { ...state, isDisoriented: action.payload };
    case 'UPDATE_GPS_LOCATION':
      return { ...state, lastKnownLocation: action.payload };
    default:
      return state;
  }
};

const NavigationContext = createContext<{
  state: NavigationState;
  dispatch: React.Dispatch<NavigationAction>;
} | null>(null);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  useEffect(() => {
    // Load navigation data from localStorage
    const savedRooms = localStorage.getItem('roomLabels');
    const savedZones = localStorage.getItem('safeZones');

    if (savedRooms) {
      try {
        const rooms = JSON.parse(savedRooms);
        dispatch({ type: 'SET_ROOM_LABELS', payload: rooms });
      } catch (error) {
        console.error('Error loading room labels:', error);
      }
    }

    if (savedZones) {
      try {
        const zones = JSON.parse(savedZones);
        dispatch({ type: 'SET_SAFE_ZONES', payload: zones });
      } catch (error) {
        console.error('Error loading safe zones:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save room labels to localStorage
    localStorage.setItem('roomLabels', JSON.stringify(state.roomLabels));
  }, [state.roomLabels]);

  useEffect(() => {
    // Save safe zones to localStorage
    localStorage.setItem('safeZones', JSON.stringify(state.safeZones));
  }, [state.safeZones]);

  return (
    <NavigationContext.Provider value={{ state, dispatch }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};