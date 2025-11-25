import { useEffect, useCallback } from 'react';
import { useReminders } from '../contexts/ReminderContext';
import { usePatient } from '../contexts/PatientContext';

export const useNotifications = () => {
  const { state: reminderState, dispatch: reminderDispatch } = useReminders();
  const { state: patientState } = usePatient();

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  const playNotificationSound = useCallback((volume: number = 0.8) => {
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, []);

  const showNotification = useCallback((title: string, body: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/pulse-icon.svg',
        badge: '/pulse-badge.png',
        requireInteraction: true,
        ...options,
      });

      // Play notification sound
      const volume = patientState.currentPatient?.settings.notificationVolume || 0.8;
      playNotificationSound(volume);

      return notification;
    }
  }, [patientState.currentPatient?.settings.notificationVolume, playNotificationSound]);

  const checkReminders = useCallback(() => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const currentDay = now.getDay();

    reminderState.reminders.forEach(reminder => {
      if (!reminder.isActive) return;

      const reminderTime = new Date(reminder.scheduledTime);
      const reminderTimeString = reminderTime.toTimeString().slice(0, 5);

      // Check if reminder should trigger now
      const shouldTrigger = reminderTimeString === currentTime;
      
      if (shouldTrigger) {
        // Check if it's a recurring reminder and if today is included
        if (reminder.isRecurring && reminder.recurrencePattern) {
          const pattern = reminder.recurrencePattern;
          if (pattern.daysOfWeek && !pattern.daysOfWeek.includes(currentDay)) {
            return; // Skip if today is not in the schedule
          }
        }

        // Check if not already triggered today
        const lastTriggered = reminder.lastTriggered ? new Date(reminder.lastTriggered) : null;
        const isToday = lastTriggered && 
          lastTriggered.toDateString() === now.toDateString();

        if (!isToday && reminder.snoozeCount < reminder.maxSnoozes) {
          reminderDispatch({ type: 'SET_ACTIVE_REMINDER', payload: reminder });
          
          showNotification(
            `${reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} Reminder`,
            reminder.message,
            {
              tag: reminder.id,
              requireInteraction: reminder.priority === 'critical',
              actions: [
                { action: 'snooze', title: 'Snooze 10 min' },
                { action: 'dismiss', title: 'Done' }
              ]
            }
          );

          // Update last triggered time
          const updatedReminder = { ...reminder, lastTriggered: now };
          reminderDispatch({ type: 'UPDATE_REMINDER', payload: updatedReminder });

          // Create caregiver alert if high priority
          if (reminder.priority === 'high' || reminder.priority === 'critical') {
            const alert = {
              id: Date.now().toString(),
              patientId: patientState.currentPatient?.id || '',
              caregiverId: '', // Will be filled by caregiver system
              type: reminder.type as any,
              title: `${reminder.type} reminder triggered`,
              message: `${reminder.title}: ${reminder.message}`,
              timestamp: now,
              priority: reminder.priority as any,
              isRead: false,
              isResolved: false,
              actionRequired: true,
            };
            reminderDispatch({ type: 'ADD_CAREGIVER_ALERT', payload: alert });
          }
        }
      }
    });
  }, [reminderState.reminders, reminderDispatch, showNotification, patientState.currentPatient?.id]);

  const checkMissedReminders = useCallback(() => {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    reminderState.reminders.forEach(reminder => {
      if (!reminder.isActive) return;

      const reminderTime = new Date(reminder.scheduledTime);
      
      // Check if reminder was scheduled more than 30 minutes ago and not completed
      if (reminderTime < thirtyMinutesAgo && !reminder.lastTriggered) {
        reminderDispatch({ type: 'MARK_MISSED', payload: reminder });

        // Create caregiver alert for missed reminder
        const alert = {
          id: Date.now().toString(),
          patientId: patientState.currentPatient?.id || '',
          caregiverId: '',
          type: 'missed_medication' as any, // Adjust based on reminder type
          title: 'Missed Reminder',
          message: `${reminder.title} was missed at ${reminderTime.toLocaleTimeString()}`,
          timestamp: now,
          priority: 'high' as any,
          isRead: false,
          isResolved: false,
          actionRequired: true,
        };
        reminderDispatch({ type: 'ADD_CAREGIVER_ALERT', payload: alert });
      }
    });
  }, [reminderState.reminders, reminderDispatch, patientState.currentPatient?.id]);

  useEffect(() => {
    // Request notification permission on mount
    requestPermission();

    // Check reminders every minute
    const reminderInterval = setInterval(checkReminders, 60000);
    
    // Check for missed reminders every 5 minutes
    const missedInterval = setInterval(checkMissedReminders, 5 * 60000);

    return () => {
      clearInterval(reminderInterval);
      clearInterval(missedInterval);
    };
  }, [requestPermission, checkReminders, checkMissedReminders]);

  return {
    requestPermission,
    showNotification,
    checkReminders,
    checkMissedReminders,
    playNotificationSound,
  };
};