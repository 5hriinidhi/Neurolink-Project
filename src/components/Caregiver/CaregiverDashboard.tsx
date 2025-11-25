import React, { useState, useEffect } from 'react';
import {
  Pill,
  MapPin,
  Clock,
  Heart,
  Settings,
  Brain,
  AlertTriangle,
  Activity,
  Droplets,
  Moon,
  Phone,
  TrendingUp,
  Bell,
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  Target,
  Filter,
  BarChart3,
  Stethoscope,
  FileText
} from 'lucide-react';
import { usePatient } from '../../contexts/PatientContext';
import { useFamily } from '../../contexts/FamilyContext';

interface CaregiverDashboardProps {
  onNavigate: (page: string) => void;
}

interface Alert {
  id: string;
  type: 'fall' | 'heart_rate' | 'medication' | 'location' | 'inactivity' | 'wandering' | 'confusion' | 'sundowning' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  location?: string;
  value?: string;
  actionRequired?: boolean;
  patientLocation?: string;
}

interface BiometricReading {
  timestamp: Date;
  heartRate: number;
  steps: number;
  sleepHours: number;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'confused';
  activityLevel: 'low' | 'moderate' | 'high';
}

interface MedicationEvent {
  id: string;
  medicationName: string;
  scheduledTime: Date;
  takenTime?: Date;
  status: 'taken' | 'missed' | 'pending' | 'late';
  dosage: string;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({ onNavigate }) => {
  const { state: patientState } = usePatient();
  const { state: familyState } = useFamily();

  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'medication' | 'patterns' | 'network' | 'patient-care'>('overview');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [biometrics, setBiometrics] = useState<BiometricReading[]>([]);
  const [medicationEvents, setMedicationEvents] = useState<MedicationEvent[]>([]);

  const settings = patientState.currentPatient?.settings || { fontSize: 'large', highContrast: true };

  // Export report functionality
  const handleExportReport = () => {
    const reportData = {
      patientInfo: {
        name: patientState.currentPatient?.name || 'Patient',
        dateGenerated: new Date().toLocaleDateString(),
        timeRange: timeRange
      },
      summary: {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
        medicationAdherence: Math.round(((todaysMedications.length - missedMedications.length) / todaysMedications.length) * 100) || 0,
        activeFamilyMembers: familyState.familyMembers.length
      },
      alerts: alerts.map(alert => ({
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        timestamp: alert.timestamp.toLocaleString(),
        location: alert.patientLocation || 'Unknown'
      })),
      medications: medicationEvents.map(med => ({
        name: med.medicationName,
        dosage: med.dosage,
        scheduledTime: med.scheduledTime.toLocaleString(),
        status: med.status,
        takenTime: med.takenTime?.toLocaleString() || 'Not taken'
      })),
      biometrics: biometrics.slice(0, 10).map(reading => ({
        timestamp: reading.timestamp.toLocaleString(),
        heartRate: reading.heartRate,
        steps: reading.steps,
        mood: reading.mood,
        activityLevel: reading.activityLevel
      }))
    };

    // Create and download CSV format report
    const csvContent = generateCSVReport(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `NeuroLink_Care_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSVReport = (data: any) => {
    let csv = 'NeuroLink Care Report\n\n';

    // Patient Info
    csv += 'Patient Information\n';
    csv += `Name, ${data.patientInfo.name} \n`;
    csv += `Report Date, ${data.patientInfo.dateGenerated} \n`;
    csv += `Time Range, ${data.patientInfo.timeRange} \n\n`;

    // Summary
    csv += 'Summary\n';
    csv += `Total Alerts, ${data.summary.totalAlerts} \n`;
    csv += `Critical Alerts, ${data.summary.criticalAlerts} \n`;
    csv += `Medication Adherence, ${data.summary.medicationAdherence}%\n`;
    csv += `Active Family Members, ${data.summary.activeFamilyMembers} \n\n`;

    // Alerts
    csv += 'Recent Alerts\n';
    csv += 'Type,Severity,Title,Message,Timestamp,Location\n';
    data.alerts.forEach((alert: any) => {
      csv += `${alert.type}, ${alert.severity}, "${alert.title}", "${alert.message}", ${alert.timestamp}, ${alert.location} \n`;
    });
    csv += '\n';

    // Medications
    csv += 'Medication Events\n';
    csv += 'Name,Dosage,Scheduled Time,Status,Taken Time\n';
    data.medications.forEach((med: any) => {
      csv += `${med.name}, ${med.dosage}, ${med.scheduledTime}, ${med.status}, ${med.takenTime} \n`;
    });
    csv += '\n';

    // Biometrics
    csv += 'Recent Biometric Data\n';
    csv += 'Timestamp,Heart Rate,Steps,Mood,Activity Level\n';
    data.biometrics.forEach((reading: any) => {
      csv += `${reading.timestamp}, ${reading.heartRate}, ${reading.steps}, ${reading.mood}, ${reading.activityLevel} \n`;
    });

    return csv;
  };

  // Simulate real-time data
  useEffect(() => {
    const generateMockData = () => {
      // Mock alerts
      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'wandering',
          severity: 'high',
          title: 'Unusual Movement Pattern',
          message: 'Patient has been walking around the house for 45 minutes without sitting down',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false,
          patientLocation: 'Living Room',
          actionRequired: true,
        },
        {
          id: '2',
          type: 'medication',
          severity: 'critical',
          title: 'Missed Medication',
          message: 'Evening medication was not taken at scheduled time (7:00 PM)',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false,
          actionRequired: true,
        },
        {
          id: '3',
          type: 'confusion',
          severity: 'medium',
          title: 'Confusion Episode',
          message: 'Patient asked about location 3 times in the last hour',
          timestamp: new Date(Date.now() - 90 * 60 * 1000),
          isRead: true,
          actionRequired: false,
        },
        {
          id: '4',
          type: 'sundowning',
          severity: 'medium',
          title: 'Sundowning Pattern Detected',
          message: 'Increased agitation and confusion starting at 6:30 PM',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isRead: false,
          actionRequired: true,
        },
      ];

      // Mock biometric data
      const mockBiometrics: BiometricReading[] = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
        heartRate: 65 + Math.random() * 20,
        steps: Math.floor(Math.random() * 500),
        sleepHours: i < 8 ? 8 - i : 0,
        mood: ['happy', 'neutral', 'sad', 'anxious', 'confused'][Math.floor(Math.random() * 5)] as any,
        activityLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)] as any,
      }));

      // Mock medication events
      const mockMedications: MedicationEvent[] = [
        {
          id: '1',
          medicationName: 'Donepezil',
          scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'missed',
          dosage: '10mg',
        },
        {
          id: '2',
          medicationName: 'Vitamin D',
          scheduledTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
          takenTime: new Date(Date.now() - 7.5 * 60 * 60 * 1000),
          status: 'taken',
          dosage: '1000 IU',
        },
        {
          id: '3',
          medicationName: 'Memantine',
          scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          status: 'pending',
          dosage: '5mg',
        },
      ];

      setAlerts(mockAlerts);
      setBiometrics(mockBiometrics);
      setMedicationEvents(mockMedications);
    };

    generateMockData();
    const interval = setInterval(generateMockData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'medication': return Pill;
      case 'wandering': return MapPin;
      case 'confusion': return Brain;
      case 'bathroom': return Droplets;
      case 'sundowning': return Moon;
      case 'emergency': return Phone;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-gradient-to-br from-red-500 to-red-600';
      case 'high': return 'bg-gradient-to-br from-teal-500 to-teal-600';
      case 'medium': return 'bg-gradient-to-br from-teal-300 to-teal-400';
      case 'low': return 'bg-gradient-to-br from-gray-400 to-gray-500';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const todaysMedications = medicationEvents.filter(med =>
    new Date(med.scheduledTime).toDateString() === new Date().toDateString()
  );
  const missedMedications = todaysMedications.filter(med => med.status === 'missed');

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Patient Status</p>
              <p className="text-2xl font-bold text-green-600">Stable</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
              <Heart size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <TrendingUp size={16} className="mr-1" />
            Last updated 2 min ago
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-teal-600">{unreadAlerts.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center">
              <Bell size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-600">
            <AlertTriangle size={16} className="mr-1" />
            {criticalAlerts.length} critical
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medication Adherence</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(((todaysMedications.length - missedMedications.length) / todaysMedications.length) * 100)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Pill size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-1" />
            {missedMedications.length} missed today
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Care Network</p>
              <p className="text-2xl font-bold text-purple-600">{familyState.familyMembers.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Shield size={16} className="mr-1" />
            All connected
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Recent Alerts</h3>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-teal-500 hover:text-teal-600 text-sm font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {alerts.slice(0, 3).map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-white/30 rounded-lg border border-gray-300/10">
                  <div className={`w - 10 h - 10 ${getAlertColor(alert.severity)} rounded - lg flex items - center justify - center flex - shrink - 0`}>
                    <AlertIcon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800 truncate">{alert.title}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    {alert.actionRequired && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vital Signs */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Vital Signs</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="text-sm border border-gray-300/30 rounded-lg px-3 py-1 bg-white/50"
            >
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-gray-300/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Heart size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-800">Heart Rate</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">72 BPM</div>
                <div className="text-xs text-green-600">Normal</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-gray-300/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Activity size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-800">Steps Today</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">2,847</div>
                <div className="text-xs text-green-600">Above average</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-gray-300/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Moon size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-800">Sleep Quality</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">7.2h</div>
                <div className="text-xs text-green-600">Good</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientCare = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Patient Care Monitoring</h2>

      {/* Care Monitoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bathroom Usage Monitoring */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Droplets size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Bathroom Usage Monitoring</h3>
              <p className="text-sm text-gray-600">Track for health and safety concerns</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Today's Visits</span>
              <span className="text-sm font-medium">8 times</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Duration</span>
              <span className="text-sm font-medium">4.2 minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Night Visits</span>
              <span className="text-sm font-medium">2 times</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Safety Incidents</span>
              <span className="text-sm font-medium text-green-600">0 this week</span>
            </div>
          </div>
        </div>

        {/* Behavioral Pattern Analysis */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Behavioral Pattern Analysis</h3>
              <p className="text-sm text-gray-600">Advanced analytics to identify trends</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mood Stability</span>
              <span className="text-sm font-medium text-green-600">85% stable</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sleep Pattern</span>
              <span className="text-sm font-medium">Regular cycle</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sundowning Episodes</span>
              <span className="text-sm font-medium text-teal-600">2 this week</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Confusion Events</span>
              <span className="text-sm font-medium">3 today</span>
            </div>
          </div>
        </div>

        {/* Smart Alert System */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center">
              <Bell size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Smart Alert System</h3>
              <p className="text-sm text-gray-600">Intelligent notifications that adapt to urgency levels</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium text-green-600">2.3 minutes avg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alert Accuracy</span>
              <span className="text-sm font-medium">94% accurate</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Critical Alerts</span>
              <span className="text-sm font-medium text-red-600">1 pending</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-Escalation</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>

        {/* Medication Adherence Tracking */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
              <Pill size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Medication Adherence Tracking</h3>
              <p className="text-sm text-gray-600">Real-time updates on medication taken/missed</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Adherence</span>
              <span className="text-sm font-medium text-green-600">85% compliant</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Missed This Week</span>
              <span className="text-sm font-medium text-teal-600">3 doses</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Next Medication</span>
              <span className="text-sm font-medium">Memantine in 2 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Taken</span>
              <span className="text-sm font-medium">Vitamin D - 8:00 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Care Insights */}
      <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Care Insights & Recommendations</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-teal-50/50 rounded-lg border border-teal-200/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-teal-500" />
              <span className="font-medium text-teal-800">Monitoring Alert</span>
            </div>
            <p className="text-sm text-teal-700">
              Increased bathroom visits may indicate UTI risk. Consider medical evaluation.
            </p>
          </div>

          <div className="p-4 bg-green-50/50 rounded-lg border border-green-200/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="font-medium text-green-800">Positive Trend</span>
            </div>
            <p className="text-sm text-green-700">
              Medication adherence improved by 15% this month. Great progress!
            </p>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/30">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-blue-500" />
              <span className="font-medium text-blue-800">Care Suggestion</span>
            </div>
            <p className="text-sm text-blue-700">
              Consider adjusting evening routine to reduce sundowning episodes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Alert Management</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select className="border border-gray-300/30 rounded-lg px-3 py-2 bg-white/50">
              <option value="all">All Alerts</option>
              <option value="unread">Unread Only</option>
              <option value="critical">Critical Only</option>
            </select>
          </div>
          <button className="bg-gradient-to-br from-teal-400 to-teal-500 text-white px-4 py-2 rounded-lg font-medium">
            Mark All Read
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert) => {
          const AlertIcon = getAlertIcon(alert.type);
          return (
            <div key={alert.id} className={`backdrop - blur - xl bg - white / 25 border border - gray - 300 / 20 rounded - 2xl shadow - lg p - 6 ${!alert.isRead ? 'ring-2 ring-teal-400' : ''} `}>
              <div className="flex items-start gap-4">
                <div className={`w - 12 h - 12 ${getAlertColor(alert.severity)} rounded - xl flex items - center justify - center flex - shrink - 0`}>
                  <AlertIcon size={24} className="text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{alert.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px - 3 py - 1 rounded - full text - xs font - medium ${alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'high' ? 'bg-teal-100 text-teal-800' :
                          alert.severity === 'medium' ? 'bg-teal-50 text-teal-700' :
                            'bg-gray-100 text-gray-800'
                        } `}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">{alert.message}</p>

                  {alert.patientLocation && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin size={16} />
                      <span>Location: {alert.patientLocation}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {alert.actionRequired && (
                      <button className="bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm">
                        Take Action
                      </button>
                    )}
                    <button className="bg-gradient-to-br from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-medium text-sm">
                      Mark as Read
                    </button>
                    <button className="text-teal-500 hover:text-teal-600 font-medium text-sm">
                      Contact Family
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMedication = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Medication Tracking</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Adherence Rate: <span className="font-bold text-green-600">85%</span>
          </div>
          <button className="bg-gradient-to-br from-teal-400 to-teal-500 text-white px-4 py-2 rounded-lg font-medium">
            Add Medication
          </button>
        </div>
      </div>

      {/* Medication Schedule */}
      <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Today's Schedule</h3>

        <div className="space-y-4">
          {medicationEvents.map((med) => (
            <div key={med.id} className="flex items-center justify-between p-4 bg-white/30 rounded-lg border border-gray-300/10">
              <div className="flex items-center gap-4">
                <div className={`w - 12 h - 12 rounded - xl flex items - center justify - center ${med.status === 'taken' ? 'bg-gradient-to-br from-green-400 to-green-500' :
                  med.status === 'missed' ? 'bg-gradient-to-br from-red-400 to-red-500' :
                    med.status === 'late' ? 'bg-gradient-to-br from-amber-400 to-amber-500' :
                      'bg-gradient-to-br from-gray-400 to-gray-500'
                  } `}>
                  <Pill size={24} className="text-white" />
                </div>

                <div>
                  <h4 className="font-bold text-gray-800">{med.medicationName}</h4>
                  <p className="text-sm text-gray-600">{med.dosage}</p>
                  <p className="text-xs text-gray-500">
                    Scheduled: {new Date(med.scheduledTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`px - 3 py - 1 rounded - full text - xs font - medium ${med.status === 'taken' ? 'bg-green-100 text-green-800' :
                  med.status === 'missed' ? 'bg-red-100 text-red-800' :
                    med.status === 'late' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                  } `}>
                  {med.status.toUpperCase()}
                </span>
                {med.takenTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    Taken: {new Date(med.takenTime).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medication Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Adherence Trends</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Week</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">80%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Week</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-18 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">90%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div className="w-17 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Common Issues</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white/30 rounded border border-gray-300/10">
              <span className="text-sm text-gray-700">Forgotten doses</span>
              <span className="text-sm font-medium text-orange-600">3 this week</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/30 rounded border border-gray-300/10">
              <span className="text-sm text-gray-700">Late doses</span>
              <span className="text-sm font-medium text-yellow-600">2 this week</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/30 rounded border border-gray-300/10">
              <span className="text-sm text-gray-700">Double doses</span>
              <span className="text-sm font-medium text-red-600">0 this week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatterns = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Behavioral Patterns & Analytics</h2>

      {/* Pattern Detection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Moon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Sundowning</h3>
              <p className="text-sm text-gray-600">Evening confusion tracking</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Typical onset</span>
              <span className="text-sm font-medium">6:30 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Duration</span>
              <span className="text-sm font-medium">2-3 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Severity trend</span>
              <span className="text-sm font-medium text-orange-600">Increasing</span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Droplets size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Bathroom Usage</h3>
              <p className="text-sm text-gray-600">Health & safety monitoring</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Frequency</span>
              <span className="text-sm font-medium">8 times/day</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Night visits</span>
              <span className="text-sm font-medium">2-3 times</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Incidents</span>
              <span className="text-sm font-medium text-green-600">None this week</span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
              <MapPin size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Movement Patterns</h3>
              <p className="text-sm text-gray-600">Wandering detection</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Safe zones</span>
              <span className="text-sm font-medium text-green-600">Within bounds</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Unusual patterns</span>
              <span className="text-sm font-medium text-orange-600">2 this week</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Exit attempts</span>
              <span className="text-sm font-medium text-red-600">1 yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Care Plan Templates */}
      <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Care Plan Templates</h3>
          <button className="bg-gradient-to-br from-orange-400 to-orange-500 text-white px-4 py-2 rounded-lg font-medium">
            Create Custom Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { stage: 'Early Stage', routines: 12, active: true },
            { stage: 'Moderate Stage', routines: 18, active: false },
            { stage: 'Advanced Stage', routines: 24, active: false },
          ].map((template) => (
            <div key={template.stage} className={`p - 4 rounded - lg border - 2 transition - all ${template.active ? 'border-orange-400 bg-orange-50/50' : 'border-gray-300/30 bg-white/30'
              } `}>
              <h4 className="font-bold text-gray-800 mb-2">{template.stage}</h4>
              <p className="text-sm text-gray-600 mb-3">{template.routines} care routines</p>
              <button className={`w - full py - 2 rounded - lg font - medium text - sm ${template.active
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } `}>
                {template.active ? 'Currently Active' : 'Activate Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Care Network</h2>
        <button className="bg-gradient-to-br from-orange-400 to-orange-500 text-white px-4 py-2 rounded-lg font-medium">
          Invite Caregiver
        </button>
      </div>

      {/* Network Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Dr. Sarah Johnson', role: 'Primary Physician', status: 'online', alerts: 2 },
          { name: 'Michael Chen', role: 'Family Member', status: 'online', alerts: 0 },
          { name: 'Lisa Rodriguez', role: 'Home Care Nurse', status: 'offline', alerts: 1 },
          { name: 'David Wilson', role: 'Family Member', status: 'online', alerts: 0 },
        ].map((member) => (
          <div key={member.name} className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
              <div className={`w - 3 h - 3 rounded - full ${member.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                } `} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text - sm font - medium ${member.status === 'online' ? 'text-green-600' : 'text-gray-600'
                  } `}>
                  {member.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Unread alerts</span>
                <span className="text-sm font-medium">{member.alerts}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-gradient-to-br from-gray-500 to-gray-600 text-white py-2 rounded-lg font-medium text-sm">
                Message
              </button>
              <button className="flex-1 bg-gradient-to-br from-orange-400 to-orange-500 text-white py-2 rounded-lg font-medium text-sm">
                Call
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Distribution */}
      <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Alert Distribution Settings</h3>

        <div className="space-y-4">
          {[
            { type: 'Critical Alerts', recipients: ['Dr. Sarah Johnson', 'Michael Chen', 'Lisa Rodriguez'] },
            { type: 'Medication Alerts', recipients: ['Dr. Sarah Johnson', 'Lisa Rodriguez'] },
            { type: 'Behavioral Alerts', recipients: ['Dr. Sarah Johnson', 'Michael Chen'] },
            { type: 'Safety Alerts', recipients: ['All Network Members'] },
          ].map((setting) => (
            <div key={setting.type} className="p-4 bg-white/30 rounded-lg border border-gray-300/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{setting.type}</h4>
                <button className="text-orange-500 hover:text-orange-600 text-sm">
                  Edit
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Recipients: {setting.recipients.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'patient-care', label: 'Patient Care', icon: Stethoscope },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'medication', label: 'Medication', icon: Pill },
    { id: 'patterns', label: 'Patterns', icon: TrendingUp },
    { id: 'network', label: 'Network', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-orange-50 relative overflow-hidden">
      {/* Background Balls */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-orange-500/20 rounded-full blur-xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-gray-400/15 to-gray-500/15 rounded-full blur-lg animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-orange-300/25 to-orange-400/25 rounded-full blur-xl animate-float-fast" />
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-gray-500/20 to-orange-400/20 rounded-full blur-lg animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-br from-orange-500/30 to-gray-500/30 rounded-full blur-xl animate-float-medium" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pb-32">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`font - bold ${settings.fontSize === 'extra-large' ? 'text-3xl' : 'text-2xl'
                } text - gray - 800`}>
                Caregiver Dashboard
              </h1>
              <p className={`mt - 1 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } text - gray - 600`}>
                Comprehensive monitoring and care management
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleExportReport}
                className="bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all duration-200"
              >
                <FileText size={16} />
                Export Report
              </button>
              <button className="bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all duration-200">
                <Settings size={16} />
                Settings
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items - center gap - 2 px - 4 py - 2 rounded - xl font - medium transition - all whitespace - nowrap ${activeTab === tab.id
                    ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg'
                    : 'bg-white/30 text-gray-700 hover:bg-white/50 border border-gray-300/20'
                    } `}
                >
                  <TabIcon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative z-10">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'patient-care' && renderPatientCare()}
          {activeTab === 'alerts' && renderAlerts()}
          {activeTab === 'medication' && renderMedication()}
          {activeTab === 'patterns' && renderPatterns()}
          {activeTab === 'network' && renderNetwork()}
        </div>
      </div>
    </div>
  );
};