export interface Patient {
  id: string;
  name: string;
  dateOfBirth: Date;
  photo?: string;
  emergencyContacts: EmergencyContact[];
  caregivers: string[];
  settings: PatientSettings;
  currentLocation?: string;
  lastActivity?: Date;
}

export interface Caregiver {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isActive: boolean;
  permissions: CaregiverPermissions;
}

export interface CaregiverPermissions {
  canViewActivity: boolean;
  canReceiveAlerts: boolean;
  canModifySettings: boolean;
  canAccessMemories: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  photo?: string;
}

export interface MemorySnippet {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  videoUrl?: string;
  photos: string[];
  category: 'people' | 'places' | 'tasks' | 'routines';
  tags: string[];
  createdAt: Date;
  triggers?: {
    time?: string;
    location?: string;
    person?: string;
    callerId?: string;
  };
  importance: 'low' | 'medium' | 'high';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  steps: TaskStep[];
  category: 'medication' | 'meal' | 'hygiene' | 'exercise' | 'social' | 'other';
  estimatedDuration: number; // minutes
  isRecurring: boolean;
  schedule?: TaskSchedule;
  completionPhoto?: boolean;
  streakCount: number;
  lastCompleted?: Date;
  isActive: boolean;
}

export interface TaskStep {
  id: string;
  instruction: string;
  photo?: string;
  audioPrompt?: string;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface TaskSchedule {
  times: string[]; // HH:MM format
  daysOfWeek: number[]; // 0-6, Sunday = 0
  startDate: Date;
  endDate?: Date;
}

export interface Reminder {
  id: string;
  title: string;
  message: string;
  type: 'medication' | 'meal' | 'appointment' | 'task' | 'visitor' | 'weather' | 'location';
  scheduledTime: Date;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  lastTriggered?: Date;
  snoozeCount: number;
  maxSnoozes: number;
  associatedTaskId?: string;
  weatherDependent?: boolean;
  locationDependent?: boolean;
  // Caregiver UI properties
  description?: string;
  time?: string;
  category?: 'medication' | 'meal' | 'appointment' | 'routine' | 'task' | 'visitor' | 'weather' | 'location';
  daysOfWeek?: number[];
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  photo?: string;
  voiceNote?: string; // Audio description for caller ID
  lastContact?: Date;
  isEmergencyContact: boolean;
  visitSchedule?: VisitSchedule[];
}

export interface VisitSchedule {
  date: Date;
  time: string;
  duration: number; // minutes
  notes?: string;
  isConfirmed: boolean;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  photo?: string;
  careReminders: PetReminder[];
  lastFed?: Date;
  lastWalk?: Date;
}

export interface PetReminder {
  id: string;
  type: 'feeding' | 'walk' | 'medication' | 'grooming' | 'vet';
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
}

export interface RoomLabel {
  id: string;
  name: string;
  description: string;
  photo?: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface NavigationBreadcrumb {
  timestamp: Date;
  location: string;
  action: string;
  duration: number; // seconds
}

export interface SafeZone {
  id: string;
  name: string;
  description: string;
  boundaries: {
    center: { lat: number; lng: number };
    radius: number; // meters
  };
  isActive: boolean;
  alertOnExit: boolean;
}

export interface PatientSettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  voiceEnabled: boolean;
  voiceSpeed: number; // 0.5 - 2.0
  notificationVolume: number; // 0.0 - 1.0
  reminderAdvanceTime: number; // minutes
  autoPlayMemories: boolean;
  emergencyButtonVisible: boolean;
  simplifiedInterface: boolean;
  colorTheme: 'default' | 'warm' | 'cool' | 'high-contrast';
  language: string;
  timeFormat: '12h' | '24h';
  enableGPS: boolean;
  enableBiometrics: boolean;
  enableWeatherAlerts: boolean;
}

export interface ActivityLog {
  id: string;
  patientId: string;
  timestamp: Date;
  type: 'task_completed' | 'reminder_dismissed' | 'memory_viewed' | 'emergency_triggered' | 'location_changed' | 'app_opened';
  details: Record<string, any>;
  duration?: number; // seconds
}

export interface CaregiverAlert {
  id: string;
  patientId: string;
  caregiverId: string;
  type: 'missed_medication' | 'missed_meal' | 'emergency' | 'unusual_activity' | 'location_alert' | 'task_overdue';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  actionRequired: boolean;
}

export interface BiometricData {
  id: string;
  patientId: string;
  timestamp: Date;
  heartRate?: number;
  steps?: number;
  sleepHours?: number;
  activityLevel: 'low' | 'moderate' | 'high';
  mood?: 'happy' | 'neutral' | 'sad' | 'anxious' | 'confused';
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'snow' | 'heat' | 'cold' | 'storm';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  expiresAt: Date;
  actionSuggestion?: string;
}

export interface MemoryGame {
  id: string;
  title: string;
  description: string;
  type: 'photo_match' | 'name_recall' | 'sequence' | 'story_completion';
  difficulty: 'easy' | 'medium' | 'hard';
  personalData: any; // Customized based on patient's memories
  lastPlayed?: Date;
  bestScore?: number;
  isActive: boolean;
}