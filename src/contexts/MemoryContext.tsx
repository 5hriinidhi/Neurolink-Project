import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { MemorySnippet, MemoryGame } from '../types';

interface MemoryState {
  memories: MemorySnippet[];
  currentMemory: MemorySnippet | null;
  memoryGames: MemoryGame[];
  isRecording: boolean;
  isPlaying: boolean;
  searchQuery: string;
  selectedCategory: string;
}

type MemoryAction =
  | { type: 'SET_MEMORIES'; payload: MemorySnippet[] }
  | { type: 'ADD_MEMORY'; payload: MemorySnippet }
  | { type: 'UPDATE_MEMORY'; payload: MemorySnippet }
  | { type: 'DELETE_MEMORY'; payload: string }
  | { type: 'SET_CURRENT_MEMORY'; payload: MemorySnippet | null }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_MEMORY_GAMES'; payload: MemoryGame[] }
  | { type: 'UPDATE_GAME_SCORE'; payload: { gameId: string; score: number } };

const initialState: MemoryState = {
  memories: [],
  currentMemory: null,
  memoryGames: [],
  isRecording: false,
  isPlaying: false,
  searchQuery: '',
  selectedCategory: 'all',
};

const memoryReducer = (state: MemoryState, action: MemoryAction): MemoryState => {
  switch (action.type) {
    case 'SET_MEMORIES':
      return { ...state, memories: action.payload };
    case 'ADD_MEMORY':
      return { ...state, memories: [action.payload, ...state.memories] };
    case 'UPDATE_MEMORY':
      return {
        ...state,
        memories: state.memories.map(memory =>
          memory.id === action.payload.id ? action.payload : memory
        ),
      };
    case 'DELETE_MEMORY':
      return {
        ...state,
        memories: state.memories.filter(memory => memory.id !== action.payload),
      };
    case 'SET_CURRENT_MEMORY':
      return { ...state, currentMemory: action.payload };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_MEMORY_GAMES':
      return { ...state, memoryGames: action.payload };
    case 'UPDATE_GAME_SCORE':
      return {
        ...state,
        memoryGames: state.memoryGames.map(game =>
          game.id === action.payload.gameId
            ? { ...game, bestScore: Math.max(game.bestScore || 0, action.payload.score), lastPlayed: new Date() }
            : game
        ),
      };
    default:
      return state;
  }
};

const MemoryContext = createContext<{
  state: MemoryState;
  dispatch: React.Dispatch<MemoryAction>;
} | null>(null);

export const MemoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(memoryReducer, initialState);

  useEffect(() => {
    // Load memories from localStorage
    const savedMemories = localStorage.getItem('memories');
    const savedGames = localStorage.getItem('memoryGames');

    if (savedMemories) {
      try {
        const memories = JSON.parse(savedMemories);
        dispatch({ type: 'SET_MEMORIES', payload: memories });
      } catch (error) {
        console.error('Error loading memories:', error);
      }
    }

    if (savedGames) {
      try {
        const games = JSON.parse(savedGames);
        dispatch({ type: 'SET_MEMORY_GAMES', payload: games });
      } catch (error) {
        console.error('Error loading memory games:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save memories to localStorage
    localStorage.setItem('memories', JSON.stringify(state.memories));
  }, [state.memories]);

  useEffect(() => {
    // Save memory games to localStorage
    localStorage.setItem('memoryGames', JSON.stringify(state.memoryGames));
  }, [state.memoryGames]);

  return (
    <MemoryContext.Provider value={{ state, dispatch }}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
};