import { useState, useEffect, useCallback } from 'react';
import { usePatient } from '../contexts/PatientContext';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export const useVoiceCommands = (onNavigate: (page: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [lastCommand, setLastCommand] = useState<string>('');
  const { state: patientState } = usePatient();

  const commands: VoiceCommand[] = [
    {
      command: 'go home',
      action: () => onNavigate('dashboard'),
      description: 'Navigate to home screen'
    },
    {
      command: 'show memories',
      action: () => onNavigate('memories'),
      description: 'View memory collection'
    },
    {
      command: 'record memory',
      action: () => onNavigate('record'),
      description: 'Start recording a new memory'
    },
    {
      command: 'show reminders',
      action: () => onNavigate('reminders'),
      description: 'View reminders and alerts'
    },
    {
      command: 'show family',
      action: () => onNavigate('family'),
      description: 'View family members and contacts'
    },
    {
      command: 'show rooms',
      action: () => onNavigate('navigation'),
      description: 'View room labels and navigation'
    },
    {
      command: 'emergency help',
      action: () => onNavigate('emergency'),
      description: 'Access emergency contacts'
    },
    {
      command: 'open settings',
      action: () => onNavigate('settings'),
      description: 'Open app settings'
    },
    {
      command: 'what time is it',
      action: () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        speak(`The time is ${timeString}`);
      },
      description: 'Tell current time'
    },
    {
      command: 'what day is it',
      action: () => {
        const now = new Date();
        const dayString = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
        speak(`Today is ${dayString}`);
      },
      description: 'Tell current date'
    }
  ];

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voiceSpeed = patientState.currentPatient?.settings.voiceSpeed || 1.0;
      utterance.rate = voiceSpeed;
      utterance.volume = patientState.currentPatient?.settings.notificationVolume || 0.8;
      speechSynthesis.speak(utterance);
    }
  }, [patientState.currentPatient?.settings]);

  const processCommand = useCallback((transcript: string) => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    setLastCommand(normalizedTranscript);

    const matchedCommand = commands.find(cmd => 
      normalizedTranscript.includes(cmd.command.toLowerCase())
    );

    if (matchedCommand) {
      speak(`Executing ${matchedCommand.description}`);
      setTimeout(() => {
        matchedCommand.action();
      }, 1000); // Small delay to let the speech finish
    } else {
      speak("I didn't understand that command. Try saying 'go home', 'show memories', or 'emergency help'");
    }
  }, [commands, speak]);

  const startListening = useCallback(() => {
    if (!recognition) return;

    setIsListening(true);
    recognition.start();
    speak("I'm listening. What would you like to do?");
  }, [recognition, speak]);

  const stopListening = useCallback(() => {
    if (!recognition) return;

    setIsListening(false);
    recognition.stop();
  }, [recognition]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processCommand(transcript);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        speak("Microphone access is required for voice commands. Please check your browser settings.");
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [processCommand, speak]);

  return {
    isListening,
    startListening,
    stopListening,
    lastCommand,
    commands,
    speak,
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}