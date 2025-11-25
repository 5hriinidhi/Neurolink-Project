import React, { useState } from 'react';
import { PatientProvider } from './contexts/PatientContext';
import { MemoryProvider } from './contexts/MemoryContext';
import { TaskProvider } from './contexts/TaskContext';
import { ReminderProvider } from './contexts/ReminderContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { RemindersProvider } from './contexts/RemindersContext';
import { useNotifications } from './hooks/useNotifications';
import { LandingScreen } from './components/Landing/LandingScreen';
import { UserTypeSelection } from './components/Landing/UserTypeSelection';
import { AboutPage } from './components/About/AboutPage';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { MemoryList } from './components/Memory/MemoryList';
import { RecordMemory } from './components/Memory/RecordMemory';
import { TaskList } from './components/Tasks/TaskList';
import { ReminderList } from './components/Reminders/ReminderList';
import { FamilyContacts } from './components/Family/FamilyContacts';
import { RoomGuide } from './components/Navigation/RoomGuide';
import { CaregiverDashboard } from './components/Caregiver/CaregiverDashboard';
import { CaregiverTasks } from './components/Caregiver/CaregiverTasks';
import { CaregiverReminders } from './components/Caregiver/CaregiverReminders';
import { Settings } from './components/Settings/Settings';

type Page = 'landing' | 'userSelection' | 'about' | 'dashboard' | 'memories' | 'record' | 'tasks' | 'reminders' | 'family' | 'navigation' | 'emergency' | 'settings' | 'caregiver' | 'caregiverTasks' | 'caregiverReminders';
type UserType = 'patient' | 'caregiver' | null;

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [userType, setUserType] = useState<UserType>(null);
  useNotifications(); // Initialize notifications

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleLandingComplete = () => {
    setCurrentPage('userSelection');
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setCurrentPage('dashboard');
  };

  const handleSwitchUserType = (newType: UserType) => {
    setUserType(newType);
    setCurrentPage('dashboard');
  };

  const handleEmergencyCall = () => {
    // Call the first emergency contact directly
    const emergencyNumber = "911"; // Default emergency number
    const confirmCall = confirm(`Call emergency services at ${emergencyNumber}?`);
    if (confirmCall) {
      window.location.href = `tel:${emergencyNumber}`;
    }
  };

  if (currentPage === 'landing') {
    return <LandingScreen onComplete={handleLandingComplete} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'userSelection') {
    return <UserTypeSelection onSelect={handleUserTypeSelect} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'about') {
    return <AboutPage onNavigate={handleNavigate} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} userType={userType} />;
      case 'memories':
        return <MemoryList onNavigate={handleNavigate} />;
      case 'record':
        return <RecordMemory onNavigate={handleNavigate} />;
      case 'tasks':
        return userType === 'caregiver' ?
          <CaregiverTasks onNavigate={handleNavigate} /> :
          <TaskList onNavigate={handleNavigate} />;
      case 'reminders':
        return userType === 'caregiver' ?
          <CaregiverReminders onNavigate={handleNavigate} /> :
          <ReminderList onNavigate={handleNavigate} />;
      case 'family':
        return <FamilyContacts onNavigate={handleNavigate} />;
      case 'navigation':
        return <RoomGuide onNavigate={handleNavigate} />;
      case 'caregiver':
        return <CaregiverDashboard onNavigate={handleNavigate} />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} userType={userType} onSwitchUserType={handleSwitchUserType} />;
      default:
        return <Dashboard onNavigate={handleNavigate} userType={userType} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-teal-50 flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onEmergencyCall={handleEmergencyCall}
        userType={userType}
      />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-lg border-t border-gray-300/20 z-50">
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} userType={userType} />
      </div>
    </div>
  );
};

function App() {
  return (
    <PatientProvider>
      <MemoryProvider>
        <TaskProvider>
          <ReminderProvider>
            <RemindersProvider>
              <NavigationProvider>
                <FamilyProvider>
                  <AppContent />
                </FamilyProvider>
              </NavigationProvider>
            </RemindersProvider>
          </ReminderProvider>
        </TaskProvider>
      </MemoryProvider>
    </PatientProvider>
  );
}

export default App;