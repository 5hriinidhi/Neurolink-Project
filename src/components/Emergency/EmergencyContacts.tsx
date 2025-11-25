import React, { useState } from 'react';
import { Phone, Plus, Edit, Trash2, Star, StarOff, Mail, User } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { EmergencyContact } from '../../types';

interface EmergencyContactsProps {
  onNavigate: (page: string) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ onNavigate }) => {
  const { state, dispatch } = useSettings();
  const { settings, emergencyContacts } = state;
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: false,
  });

  const relationships = [
    'Spouse/Partner',
    'Child',
    'Parent',
    'Sibling',
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

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill in name and phone number');
      return;
    }

    const contactData: EmergencyContact = {
      ...formData,
      id: editingContact?.id || Date.now().toString(),
    };

    if (editingContact) {
      dispatch({ type: 'UPDATE_EMERGENCY_CONTACT', payload: contactData });
    } else {
      dispatch({ type: 'ADD_EMERGENCY_CONTACT', payload: contactData });
    }

    // Reset form
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: false,
    });
    setShowAddForm(false);
    setEditingContact(null);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email || '',
      isPrimary: contact.isPrimary,
    });
    setEditingContact(contact);
    setShowAddForm(true);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      dispatch({ type: 'DELETE_EMERGENCY_CONTACT', payload: id });
    }
  };

  const handleTogglePrimary = (contact: EmergencyContact) => {
    const updatedContact = { ...contact, isPrimary: !contact.isPrimary };
    dispatch({ type: 'UPDATE_EMERGENCY_CONTACT', payload: updatedContact });
  };

  const primaryContacts = emergencyContacts.filter(contact => contact.isPrimary);
  const otherContacts = emergencyContacts.filter(contact => !contact.isPrimary);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`font-bold ${
              settings.fontSize === 'extra-large' ? 'text-3xl' : 
              settings.fontSize === 'large' ? 'text-2xl' : 'text-xl'
            } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
              Emergency Contacts
            </h1>
            <p className={`mt-1 ${
              settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
            } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
              Quick access to your important contacts
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
              settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
            }`}
          >
            <Plus size={20} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Emergency Call Button */}
      {primaryContacts.length > 0 && (
        <div className="mb-8">
          <div className={`bg-red-50 border-2 border-red-200 rounded-xl p-6 ${settings.highContrast ? 'border-red-500' : ''}`}>
            <h2 className={`font-bold mb-4 text-red-800 ${
              settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
            }`}>
              Emergency Contacts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {primaryContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleCall(contact.phone, contact.name)}
                  className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-3 shadow-lg"
                >
                  <Phone size={24} />
                  <div className="text-left">
                    <div className={`font-bold ${
                      settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    }`}>
                      {contact.name}
                    </div>
                    <div className={`text-sm opacity-90 ${
                      settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
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
        <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${settings.highContrast ? 'border-2 border-black' : ''}`}>
          <h2 className={`font-bold mb-6 ${
            settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
          } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
            {editingContact ? 'Edit Contact' : 'Add New Contact'}
          </h2>
          
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className={`block font-medium mb-2 ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contact name"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } ${settings.highContrast ? 'border-black' : 'border-gray-300'}`}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className={`block font-medium mb-2 ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } ${settings.highContrast ? 'border-black' : 'border-gray-300'}`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Relationship */}
              <div>
                <label className={`block font-medium mb-2 ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                  Relationship
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } ${settings.highContrast ? 'border-black' : 'border-gray-300'}`}
                >
                  <option value="">Select relationship</option>
                  {relationships.map((rel) => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className={`block font-medium mb-2 ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } ${settings.highContrast ? 'border-black' : 'border-gray-300'}`}
                />
              </div>
            </div>

            {/* Primary Contact */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                  className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                />
                <span className={`font-medium ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                  Primary emergency contact
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
                className={`flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
              >
                {editingContact ? 'Update Contact' : 'Add Contact'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingContact(null);
                  setFormData({
                    name: '',
                    relationship: '',
                    phone: '',
                    email: '',
                    isPrimary: false,
                  });
                }}
                className={`px-6 py-3 border-2 rounded-lg font-semibold transition-all duration-200 ${
                  settings.highContrast 
                    ? 'border-black text-black hover:bg-gray-200'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                } ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'}`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* All Contacts */}
      {otherContacts.length > 0 && (
        <div className="mb-8">
          <h2 className={`font-bold mb-6 ${
            settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
          } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
            All Contacts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherContacts.map((contact) => (
              <div
                key={contact.id}
                className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl ${
                  settings.highContrast ? 'border-2 border-black' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      settings.highContrast ? 'bg-gray-200' : 'bg-blue-100'
                    }`}>
                      <User size={24} className={settings.highContrast ? 'text-black' : 'text-blue-600'} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${
                        settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                      } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
                        {contact.name}
                      </h3>
                      {contact.relationship && (
                        <p className={`${
                          settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                        } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
                          {contact.relationship}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePrimary(contact)}
                      className={`p-1 rounded transition-colors ${
                        contact.isPrimary
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                      title={contact.isPrimary ? 'Remove from emergency' : 'Add to emergency'}
                    >
                      {contact.isPrimary ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                    </button>
                    
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="p-1 rounded text-blue-500 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-1 rounded text-red-500 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleCall(contact.phone, contact.name)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Phone size={16} />
                    Call {contact.phone}
                  </button>
                  
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className={`w-full border-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        settings.highContrast 
                          ? 'border-black text-black hover:bg-gray-200'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Mail size={16} />
                      Email
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {emergencyContacts.length === 0 && (
        <div className="text-center py-12">
          <User size={64} className={`mx-auto mb-4 ${settings.highContrast ? 'text-black' : 'text-gray-400'}`} />
          <h3 className={`font-semibold mb-2 ${
            settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
          } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
            No emergency contacts yet
          </h3>
          <p className={`mb-6 ${
            settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
          } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
            Add your important contacts for quick access in emergencies
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className={`bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
            }`}
          >
            Add First Contact
          </button>
        </div>
      )}
    </div>
  );
};