import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, Shield, Brain, Users } from 'lucide-react';

interface LandingScreenProps {
  onComplete: () => void;
  onNavigate: (page: string) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onComplete, onNavigate }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    // Start welcome animation after 1 second
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 1000);

    // Show landing page after 4 seconds
    const landingTimer = setTimeout(() => {
      setShowLanding(true);
    }, 4000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(landingTimer);
    };
  }, []);

  if (showLanding) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-teal-100">
        {/* Very Light Dynamic Fading Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/2 via-transparent to-black/1"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/1 via-transparent to-black/2"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/0.5 to-black/1.5"></div>

        {/* Animated Background Balls - Much Lighter */}
        <div className="absolute inset-0">
          {/* Large floating balls with very light glow */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-teal-300/6 to-teal-400/6 rounded-full opacity-60 animate-float-slow blur-xl shadow-xl shadow-teal-300/3" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-teal-200/4 to-teal-300/4 rounded-full opacity-50 animate-float-medium shadow-lg shadow-teal-200/2" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-teal-400/8 to-teal-500/8 rounded-full opacity-40 animate-float-fast blur-lg shadow-md shadow-teal-400/2" />
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-teal-300/6 to-teal-400/6 rounded-full opacity-35 animate-float-slow shadow-md shadow-teal-300/2" />
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-teal-200/10 to-teal-300/10 rounded-full opacity-55 animate-float-medium blur-xl shadow-xl shadow-teal-200/4" />
          <div className="absolute top-60 left-1/3 w-12 h-12 bg-gradient-to-br from-teal-400/8 to-teal-500/8 rounded-full opacity-45 animate-float-fast shadow-lg shadow-teal-400/3" />

          {/* Small accent balls with very subtle glow */}
          <div className="absolute top-1/4 left-1/2 w-8 h-8 bg-gradient-to-br from-teal-300/4 to-teal-400/4 rounded-full opacity-30 animate-float-slow shadow-sm shadow-teal-300/1" />
          <div className="absolute bottom-1/3 left-20 w-10 h-10 bg-gradient-to-br from-teal-200/6 to-teal-300/6 rounded-full opacity-35 animate-float-medium shadow-sm shadow-teal-200/1" />
        </div>

        {/* Glassmorphism Panel with lighter appearance */}
        <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-white/15 border border-gray-200/25 rounded-3xl shadow-xl p-6 md:p-8 animate-fade-in-up">
              {/* Header - Simplified */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart size={20} className="text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">NeuroLink</span>
                </div>

                {/* Simplified Navigation */}
                <nav className="flex gap-6 text-gray-700 text-sm">
                  <button
                    onClick={onComplete}
                    className="hover:text-teal-500 transition-colors font-medium"
                  >
                    Home
                  </button>
                </nav>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Content */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                      NeuroLink
                    </h1>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                      Dementia Care Companion
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Personalized reminders, memory anchors, and caregiver alerts—all in one calming interface designed with empathy and care.
                    </p>
                  </div>

                  <button
                    onClick={onComplete}
                    className="group bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                  >
                    Start Now
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Right Side - Visual Element with lighter orbiting balls */}
                <div className="relative">
                  <div className="relative w-full h-80 flex items-center justify-center">
                    {/* Central large ball with lighter glow */}
                    <div className="w-40 h-40 bg-gradient-to-br from-teal-300/60 to-teal-400/60 rounded-full opacity-75 animate-pulse-slow shadow-xl shadow-teal-300/15" />

                    {/* Orbiting smaller balls with lighter effects */}
                    <div className="absolute w-12 h-12 bg-gradient-to-br from-teal-200/50 to-teal-300/50 rounded-full opacity-60 animate-orbit-1 shadow-lg shadow-teal-200/10" />
                    <div className="absolute w-8 h-8 bg-gradient-to-br from-teal-400/50 to-teal-500/50 rounded-full opacity-50 animate-orbit-2 shadow-md shadow-teal-400/8" />
                    <div className="absolute w-16 h-16 bg-gradient-to-br from-teal-300/40 to-teal-400/40 rounded-full opacity-40 animate-orbit-3 blur-sm shadow-lg shadow-teal-300/6" />
                  </div>
                </div>
              </div>

              {/* Bottom Features - Updated with Lighter Grey-Orange Palette */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                    <Shield size={20} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Gentle Care</h3>
                  <p className="text-sm text-gray-600">Designed with empathy for elderly users</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-300 to-teal-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                    <Brain size={20} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Memory Support</h3>
                  <p className="text-sm text-gray-600">Preserve and recall precious moments</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-teal-300 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                    <Users size={20} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Family Connection</h3>
                  <p className="text-sm text-gray-600">Keep loved ones close and informed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-teal-100 flex items-center justify-center">
      {/* Very Light Dynamic Fading Overlay for welcome screen */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/1 via-transparent to-black/0.5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/0.5 via-transparent to-black/1.5"></div>

      {/* Animated Background Balls - Much Lighter */}
      <div className="absolute inset-0">
        {/* Initial floating balls with very light visibility */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-teal-300/25 to-teal-400/25 rounded-full opacity-40 animate-float-slow blur-lg shadow-lg shadow-teal-300/6" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-teal-200/20 to-teal-300/20 rounded-full opacity-35 animate-float-medium shadow-md shadow-teal-200/4" />
        <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-gradient-to-br from-teal-400/30 to-teal-500/30 rounded-full opacity-30 animate-float-fast shadow-sm shadow-teal-400/3" />

        {/* Hero ball that enters from left with lighter glow */}
        <div className={`absolute top-1/2 w-32 h-32 bg-gradient-to-br from-teal-300/50 to-teal-400/50 rounded-full opacity-70 shadow-xl shadow-teal-300/15 transition-all duration-2000 ease-out ${showWelcome ? 'left-1/2 transform -translate-x-1/2 -translate-y-1/2' : '-left-40'
          }`} />
      </div>

      {/* Welcome Text */}
      <div className={`text-center space-y-6 transition-all duration-1000 ease-out relative z-10 ${showWelcome ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          Welcome to NeuroLink
        </h1>
        <p className="text-2xl md:text-3xl text-gray-700 font-light">
          Empathy in Every Reminder
        </p>

        {/* Subtle loading indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-teal-300 rounded-full animate-bounce shadow-sm shadow-teal-300/20" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-teal-300 rounded-full animate-bounce shadow-sm shadow-teal-300/20" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-teal-300 rounded-full animate-bounce shadow-sm shadow-teal-300/20" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};