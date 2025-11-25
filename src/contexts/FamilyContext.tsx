import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { FamilyMember, Pet } from '../types';

interface FamilyState {
  familyMembers: FamilyMember[];
  pets: Pet[];
  upcomingVisits: any[];
  recentCalls: any[];
}

type FamilyAction =
  | { type: 'SET_FAMILY_MEMBERS'; payload: FamilyMember[] }
  | { type: 'ADD_FAMILY_MEMBER'; payload: FamilyMember }
  | { type: 'UPDATE_FAMILY_MEMBER'; payload: FamilyMember }
  | { type: 'DELETE_FAMILY_MEMBER'; payload: string }
  | { type: 'SET_PETS'; payload: Pet[] }
  | { type: 'ADD_PET'; payload: Pet }
  | { type: 'UPDATE_PET'; payload: Pet }
  | { type: 'DELETE_PET'; payload: string }
  | { type: 'ADD_RECENT_CALL'; payload: any }
  | { type: 'UPDATE_VISIT_SCHEDULE'; payload: { memberId: string; visits: any[] } };

const initialState: FamilyState = {
  familyMembers: [],
  pets: [],
  upcomingVisits: [],
  recentCalls: [],
};

const familyReducer = (state: FamilyState, action: FamilyAction): FamilyState => {
  switch (action.type) {
    case 'SET_FAMILY_MEMBERS':
      return { ...state, familyMembers: action.payload };
    case 'ADD_FAMILY_MEMBER':
      return { ...state, familyMembers: [...state.familyMembers, action.payload] };
    case 'UPDATE_FAMILY_MEMBER':
      return {
        ...state,
        familyMembers: state.familyMembers.map(member =>
          member.id === action.payload.id ? action.payload : member
        ),
      };
    case 'DELETE_FAMILY_MEMBER':
      return {
        ...state,
        familyMembers: state.familyMembers.filter(member => member.id !== action.payload),
      };
    case 'SET_PETS':
      return { ...state, pets: action.payload };
    case 'ADD_PET':
      return { ...state, pets: [...state.pets, action.payload] };
    case 'UPDATE_PET':
      return {
        ...state,
        pets: state.pets.map(pet =>
          pet.id === action.payload.id ? action.payload : pet
        ),
      };
    case 'DELETE_PET':
      return {
        ...state,
        pets: state.pets.filter(pet => pet.id !== action.payload),
      };
    case 'ADD_RECENT_CALL':
      return {
        ...state,
        recentCalls: [action.payload, ...state.recentCalls].slice(0, 20),
      };
    case 'UPDATE_VISIT_SCHEDULE':
      return {
        ...state,
        familyMembers: state.familyMembers.map(member =>
          member.id === action.payload.memberId
            ? { ...member, visitSchedule: action.payload.visits }
            : member
        ),
      };
    default:
      return state;
  }
};

const FamilyContext = createContext<{
  state: FamilyState;
  dispatch: React.Dispatch<FamilyAction>;
} | null>(null);

export const FamilyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(familyReducer, initialState);

  useEffect(() => {
    // Load family data from localStorage
    const savedFamily = localStorage.getItem('familyMembers');
    const savedPets = localStorage.getItem('pets');

    if (savedFamily) {
      try {
        const family = JSON.parse(savedFamily);
        dispatch({ type: 'SET_FAMILY_MEMBERS', payload: family });
      } catch (error) {
        console.error('Error loading family members:', error);
      }
    }

    if (savedPets) {
      try {
        const pets = JSON.parse(savedPets);
        dispatch({ type: 'SET_PETS', payload: pets });
      } catch (error) {
        console.error('Error loading pets:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save family data to localStorage
    localStorage.setItem('familyMembers', JSON.stringify(state.familyMembers));
  }, [state.familyMembers]);

  useEffect(() => {
    // Save pets data to localStorage
    localStorage.setItem('pets', JSON.stringify(state.pets));
  }, [state.pets]);

  return (
    <FamilyContext.Provider value={{ state, dispatch }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};