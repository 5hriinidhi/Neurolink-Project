import React from 'react';
import {
  Heart,
  Brain,
  Shield,
  Users,
  Clock,
  MapPin,
  Phone,
  Star,
  Award,
  Target,
  Zap,
  Activity,
  AlertTriangle,
  Pill,
  Moon,
  Droplets,
  TrendingUp,
  BarChart3,
  Bell
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Brain,
      title: "Memory Support",
      description: "Advanced audio recording and photo memory preservation with AI-powered recall assistance",
      color: "from-teal-400 to-teal-500"
    },
    {
      icon: Shield,
      title: "Gentle Care",
      description: "Intuitive interface designed specifically for elderly users with high contrast and large fonts",
      color: "from-gray-500 to-gray-600"
    },
    {
      icon: Users,
      title: "Family Network",
      description: "Real-time caregiver alerts and family communication with emergency contact integration",
      color: "from-emerald-300 to-emerald-400"
    },
    {
      icon: Clock,
      title: "Smart Reminders",
      description: "Personalized medication and task reminders with voice commands and visual cues",
      color: "from-gray-600 to-teal-400"
    },
    {
      icon: MapPin,
      title: "Navigation Aid",
      description: "Room labeling and safe zone monitoring with GPS tracking for wandering prevention",
      color: "from-teal-500 to-gray-500"
    },
    {
      icon: Phone,
      title: "Emergency Response",
      description: "One-touch emergency calling with automatic caregiver notifications and location sharing",
      color: "from-gray-400 to-teal-300"
    }
  ];

  const caregiverFeatures = [
    {
      icon: Activity,
      title: "Activity Dashboard",
      description: "Live view of patient's current status and recent activities with real-time monitoring",
      color: "from-teal-400 to-teal-500"
    },
    {
      icon: AlertTriangle,
      title: "Anomaly Detection",
      description: "Alerts for unusual behavior patterns including wandering and confusion episodes",
      color: "from-gray-500 to-gray-600"
    },
    {
      icon: Users,
      title: "Multiple Caregiver Network",
      description: "Allow several family members and professionals to receive coordinated alerts",
      color: "from-emerald-300 to-emerald-400"
    },
    {
      icon: Pill,
      title: "Medication Adherence Tracking",
      description: "Real-time updates on medication taken, missed, with detailed compliance reports",
      color: "from-gray-600 to-teal-400"
    },
    {
      icon: BarChart3,
      title: "Care Plan Templates",
      description: "Pre-built routines for different stages of dementia with customizable protocols",
      color: "from-teal-500 to-gray-500"
    },
    {
      icon: Moon,
      title: "Sundowning Tracker",
      description: "Monitor and predict evening confusion patterns with behavioral analytics",
      color: "from-gray-400 to-teal-300"
    },
    {
      icon: Droplets,
      title: "Bathroom Usage Monitoring",
      description: "Track bathroom visits for health and safety concerns with privacy protection",
      color: "from-teal-400 to-gray-400"
    },
    {
      icon: TrendingUp,
      title: "Behavioral Pattern Analysis",
      description: "Advanced analytics to identify trends and predict care needs",
      color: "from-gray-500 to-teal-500"
    },
    {
      icon: Bell,
      title: "Smart Alert System",
      description: "Intelligent notifications that adapt to urgency levels and caregiver availability",
      color: "from-teal-300 to-gray-400"
    }
  ];

  const teamMembers = [
    {
      name: "Zahrah",
      role: "Lead Developer & UX Designer",
      description: "Specializes in accessible design and dementia care technology with 5+ years experience in healthcare applications.",
      avatar: "Z",
      color: "from-teal-400 to-teal-500"
    },
    {
      name: "Shrinidhi",
      role: "Healthcare Technology Specialist",
      description: "Expert in medical device integration and patient monitoring systems with background in geriatric care.",
      avatar: "S",
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Parnika",
      role: "AI & Machine Learning Engineer",
      description: "Develops predictive algorithms for behavioral pattern recognition and anomaly detection in dementia patients.",
      avatar: "P",
      color: "from-emerald-300 to-emerald-400"
    },
    {
      name: "Zafirah",
      role: "Clinical Research Coordinator",
      description: "Ensures evidence-based care protocols and maintains compliance with healthcare standards and regulations.",
      avatar: "Z",
      color: "from-gray-600 to-teal-400"
    }
  ];

  const stats = [
    { number: "10K+", label: "Families Helped", icon: Users },
    { number: "95%", label: "Medication Adherence", icon: Target },
    { number: "24/7", label: "Monitoring Support", icon: Shield },
    { number: "4.9★", label: "User Rating", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full opacity-10 animate-float-slow blur-sm" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-8 animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full opacity-12 animate-float-fast blur-xs" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-gray-500 to-teal-400 rounded-full opacity-10 animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-br from-teal-500 to-gray-500 rounded-full opacity-15 animate-float-medium blur-sm" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">NeuroLink</span>
            </div>
            <nav className="flex gap-6 text-gray-700 text-sm">
              <button
                onClick={() => onNavigate('dashboard')}
                className="hover:text-teal-500 transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="text-teal-500 font-medium"
              >
                About
              </button>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Heart size={32} className="text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800">NeuroLink</h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing dementia care through compassionate technology that connects patients, families, and caregivers in a seamless ecosystem of support.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="backdrop-blur-xl bg-white/20 border border-gray-300/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                  <Icon size={32} className="mx-auto mb-3 text-teal-500" />
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Patient Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Patient Care Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thoughtfully designed features that prioritize dignity, independence, and quality of life for dementia patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Caregiver Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Advanced Caregiver Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade monitoring and analytics tools that empower caregivers with actionable insights and real-time alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {caregiverFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="backdrop-blur-xl bg-white/20 border border-gray-300/20 rounded-3xl p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  We believe that technology should enhance human connection, not replace it. NeuroLink bridges the gap between patients and their support networks, providing peace of mind while preserving dignity and independence.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
                      <Award size={16} className="text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">Evidence-based care protocols</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                      <Zap size={16} className="text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">Real-time monitoring and alerts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full flex items-center justify-center">
                      <Heart size={16} className="text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">Compassionate user experience</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-teal-200/30 to-gray-200/30 rounded-2xl flex items-center justify-center border border-gray-300/10">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                      <Heart size={40} className="text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">Empathy in Every Interaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A dedicated group of professionals committed to improving the lives of those affected by dementia through innovative technology solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl font-bold text-white">{member.avatar}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-teal-600 font-medium mb-4">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="backdrop-blur-xl bg-white/20 border border-gray-300/20 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Transform Care?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of families who trust NeuroLink to provide compassionate, technology-enhanced dementia care.
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="group bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
            >
              Start Your Journey
              <Heart size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};