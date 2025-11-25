import React, { useState } from 'react';
import { Users, Phone, Plus, CreditCard as Edit, Trash2, Video, Mail, Calendar, Heart, Star } from 'lucide-react';
import { useFamily } from '../../contexts/FamilyContext';
import { usePatient } from '../../contexts/PatientContext';
import { FamilyMember } from '../../types';

interface FamilyContactsProps {
  onNavigate: (page: string) => void;
}

export const FamilyContacts: React.FC<FamilyContactsProps> = ({ onNavigate }) => {
  const { state, dispatch } = useFamily();
  const { state: patientState } = usePatient();
  const { settings } = patientState.currentPatient || { settings: { fontSize: 'large', highContrast: true } };

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    isEmergencyContact: false,
  });

  const relationships = [
    'Spouse/Partner',
    'Child',
    'Parent',
    'Sibling',
    'Grandchild',
    'Friend',
    'Caregiver',
    'Doctor',
    'Neighbor',
    'Other',
  ];

  const handleCall = (phoneNumber: string, name: string) => {
    if (confirm(`Call ${name} at ${phoneNumber}?`)) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleVideoCall = (name: string) => {
    alert(`Starting video call with ${name}...`);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill in name and phone number');
      return;
    }

    const memberData: FamilyMember = {
      ...formData,
      id: editingMember?.id || Date.now().toString(),
    };

    if (editingMember) {
      dispatch({ type: 'UPDATE_FAMILY_MEMBER', payload: memberData });
    } else {
      dispatch({ type: 'ADD_FAMILY_MEMBER', payload: memberData });
    }

    // Reset form
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      isEmergencyContact: false,
    });
    setShowAddForm(false);
    setEditingMember(null);
  };

  const handleEditMember = (member: FamilyMember) => {
    setFormData({
      name: member.name,
      relationship: member.relationship,
      phone: member.phone,
      isEmergencyContact: member.isEmergencyContact,
    });
    setEditingMember(member);
    setShowAddForm(true);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      dispatch({ type: 'DELETE_FAMILY_MEMBER', payload: id });
    }
  };

  const emergencyContacts = state.familyMembers.filter(member => member.isEmergencyContact);
  const regularContacts = state.familyMembers.filter(member => !member.isEmergencyContact);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-teal-50 relative overflow-hidden">
      {/* Background Balls */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full opacity-20 animate-float-slow blur-sm" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-15 animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full opacity-25 animate-float-fast blur-xs" />
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-gray-500 to-teal-400 rounded-full opacity-20 animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-br from-teal-500 to-gray-500 rounded-full opacity-30 animate-float-medium blur-sm" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pb-40">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-3xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-3xl' : 'text-2xl'
                } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
                Family & Helpers
              </h1>
              <p className={`mt-1 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
                Stay connected with your loved ones and care team
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
            >
              <Plus size={20} />
              Add Contact
            </button>
          </div>
        </div>

        {/* Emergency Contacts */}
        {emergencyContacts.length > 0 && (
          <div className="mb-8">
            <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-3xl shadow-2xl p-6">
              <h2 className={`font-bold mb-6 text-teal-600 flex items-center gap-2 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
                }`}>
                <Heart size={24} />
                Emergency Contacts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {emergencyContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleCall(contact.phone, contact.name)}
                    className="bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white p-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-3 shadow-lg"
                  >
                    <Phone size={24} />
                    <div className="text-left">
                      <div className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                        }`}>
                        {contact.name}
                      </div>
                      <div className={`text-sm opacity-90 ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        }`}>
                        {contact.relationship}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-6 mb-8">
            <h2 className={`font-bold mb-6 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
              } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
              {editingMember ? 'Edit Contact' : 'Add New Contact'}
            </h2>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contact name"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      } ${settings.highContrast ? 'border-black' : 'border-teal-300'}`}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      } ${settings.highContrast ? 'border-black' : 'border-teal-300'}`}
                    required
                  />
                </div>
              </div>

              {/* Relationship */}
              <div>
                <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                  Relationship
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } ${settings.highContrast ? 'border-black' : 'border-teal-300'}`}
                >
                  <option value="">Select relationship</option>
                  {relationships.map((rel) => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isEmergencyContact}
                    onChange={(e) => setFormData({ ...formData, isEmergencyContact: e.target.checked })}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                    Emergency contact
                  </span>
                  <span className={`text-sm ${settings.highContrast ? 'text-gray-700' : 'text-gray-500'}`}>
                    (Will appear in emergency section)
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`flex-1 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    }`}
                >
                  {editingMember ? 'Update Contact' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMember(null);
                    setFormData({
                      name: '',
                      relationship: '',
                      phone: '',
                      isEmergencyContact: false,
                    });
                  }}
                  className={`px-6 py-3 border-2 rounded-lg font-semibold transition-all duration-200 bg-white/50 backdrop-blur-sm ${settings.highContrast
                      ? 'border-black text-black hover:bg-gray-200'
                      : 'border-teal-300 text-gray-700 hover:border-teal-400'
                    } ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* All Contacts */}
        {regularContacts.length > 0 && (
          <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-3xl shadow-2xl p-6">
            <h2 className={`font-bold mb-6 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
              } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
              All Contacts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl border border-white/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${settings.highContrast ? 'bg-gray-200' : 'bg-teal-100'
                        }`}>
                        <Users size={24} className={settings.highContrast ? 'text-black' : 'text-teal-600'} />
                      </div>
                      <div>
                        <h3 className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                          } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
                          {contact.name}
                        </h3>
                        {contact.relationship && (
                          <p className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                            } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
                            {contact.relationship}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditMember(contact)}
                        className="p-1 rounded text-gray-500 hover:text-teal-500 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteMember(contact.id)}
                        className="p-1 rounded text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleCall(contact.phone, contact.name)}
                      className="w-full bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Phone size={16} />
                      Call
                    </button>

                    <button
                      onClick={() => handleVideoCall(contact.name)}
                      className={`w-full border-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-white/30 backdrop-blur-sm ${settings.highContrast
                          ? 'border-black text-black hover:bg-gray-200'
                          : 'border-teal-300 text-gray-700 hover:border-teal-400'
                        }`}
                    >
                      <Video size={16} />
                      Video Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {state.familyMembers.length === 0 && (
          <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-3xl shadow-2xl p-12 text-center">
            <Users size={64} className={`mx-auto mb-4 ${settings.highContrast ? 'text-black' : 'text-gray-400'}`} />
            <h3 className={`font-semibold mb-2 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
              } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
              No contacts yet
            </h3>
            <p className={`mb-6 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
              Add your family members and helpers to stay connected
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className={`bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
            >
              Add First Contact
            </button>
          </div>
        )}
      </div>
    </div>
  );
};