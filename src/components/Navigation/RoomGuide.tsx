import React, { useState } from 'react';
import { MapPin, Plus, CreditCard as Edit, Trash2, Home, Bed, Bath, ChefHat, Sofa, Car, TreePine, Settings, Navigation, ArrowRight } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { usePatient } from '../../contexts/PatientContext';
import { RoomLabel } from '../../types';

interface RoomGuideProps {
  onNavigate: (page: string) => void;
}

const iconMap = {
  Home,
  Bed,
  Bath,
  ChefHat,
  Sofa,
  Car,
  TreePine,
  Settings,
};

export const RoomGuide: React.FC<RoomGuideProps> = ({ onNavigate }) => {
  const { state, dispatch } = useNavigation();
  const { state: patientState } = usePatient();
  const { settings } = patientState.currentPatient || { settings: { fontSize: 'large', highContrast: true } };
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomLabel | null>(null);
  const [selectedFromRoom, setSelectedFromRoom] = useState<string>('');
  const [selectedToRoom, setSelectedToRoom] = useState<string>('');
  const [showDirections, setShowDirections] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Home',
    color: 'bg-gradient-to-br from-orange-400 to-orange-500',
  });

  const availableIcons = [
    { name: 'Home', icon: Home, label: 'Home' },
    { name: 'Bed', icon: Bed, label: 'Bedroom' },
    { name: 'Bath', icon: Bath, label: 'Bathroom' },
    { name: 'ChefHat', icon: ChefHat, label: 'Kitchen' },
    { name: 'Sofa', icon: Sofa, label: 'Living Room' },
    { name: 'Car', icon: Car, label: 'Garage' },
    { name: 'TreePine', icon: TreePine, label: 'Garden' },
    { name: 'Settings', icon: Settings, label: 'Utility' },
  ];

  const colorOptions = [
    { value: 'bg-gradient-to-br from-orange-400 to-orange-500', label: 'Orange', preview: 'from-orange-400 to-orange-500' },
    { value: 'bg-gradient-to-br from-gray-500 to-gray-600', label: 'Gray', preview: 'from-gray-500 to-gray-600' },
    { value: 'bg-gradient-to-br from-orange-300 to-orange-400', label: 'Light Orange', preview: 'from-orange-300 to-orange-400' },
    { value: 'bg-gradient-to-br from-gray-600 to-orange-400', label: 'Gray-Orange', preview: 'from-gray-600 to-orange-400' },
    { value: 'bg-gradient-to-br from-orange-500 to-gray-500', label: 'Orange-Gray', preview: 'from-orange-500 to-gray-500' },
    { value: 'bg-gradient-to-br from-gray-400 to-gray-500', label: 'Light Gray', preview: 'from-gray-400 to-gray-500' },
  ];

  // Simple directions generator
  const generateDirections = (from: string, to: string) => {
    const fromRoom = state.roomLabels.find(r => r.id === from);
    const toRoom = state.roomLabels.find(r => r.id === to);
    
    if (!fromRoom || !toRoom) return [];

    // Simple direction logic based on room types
    const directions = [
      `Starting from the ${fromRoom.name}`,
      `Exit the ${fromRoom.name} and head towards the hallway`,
      `Look for signs or landmarks leading to the ${toRoom.name}`,
      `Enter the ${toRoom.name} - ${toRoom.description}`,
    ];

    return directions;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a room name');
      return;
    }

    const roomData: RoomLabel = {
      ...formData,
      id: editingRoom?.id || Date.now().toString(),
      isActive: true,
    };

    if (editingRoom) {
      dispatch({ type: 'UPDATE_ROOM_LABEL', payload: roomData });
    } else {
      dispatch({ type: 'ADD_ROOM_LABEL', payload: roomData });
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      icon: 'Home',
      color: 'bg-gradient-to-br from-orange-400 to-orange-500',
    });
    setShowAddForm(false);
    setEditingRoom(null);
  };

  const handleEditRoom = (room: RoomLabel) => {
    setFormData({
      name: room.name,
      description: room.description,
      icon: room.icon,
      color: room.color,
    });
    setEditingRoom(room);
    setShowAddForm(true);
  };

  const handleDeleteRoom = (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      dispatch({ type: 'DELETE_ROOM_LABEL', payload: id });
    }
  };

  const handleGetDirections = () => {
    if (selectedFromRoom && selectedToRoom && selectedFromRoom !== selectedToRoom) {
      setShowDirections(true);
    } else {
      alert('Please select different rooms for directions');
    }
  };

  const activeRooms = state.roomLabels.filter(room => room.isActive);

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pb-40">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`font-bold ${
                settings.fontSize === 'extra-large' ? 'text-3xl' : 'text-2xl'
              } text-gray-800`}>
                Room Guide & Navigation
              </h1>
              <p className={`mt-1 ${
                settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              } text-gray-600`}>
                Navigate your home with visual room labels and directions
              </p>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg ${
                settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              }`}
            >
              <Plus size={20} />
              Add Room
            </button>
          </div>
        </div>

        {/* Navigation Map Section */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 mb-8">
          <h2 className={`font-bold mb-6 ${
            settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
          } text-gray-800 flex items-center gap-2`}>
            <Navigation size={24} className="text-orange-500" />
            Get Directions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={`block font-medium mb-2 ${
                settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              } text-gray-700`}>
                From Room
              </label>
              <select
                value={selectedFromRoom}
                onChange={(e) => setSelectedFromRoom(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300/30 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
              >
                <option value="">Select starting room</option>
                {activeRooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block font-medium mb-2 ${
                settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              } text-gray-700`}>
                To Room
              </label>
              <select
                value={selectedToRoom}
                onChange={(e) => setSelectedToRoom(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300/30 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
              >
                <option value="">Select destination room</option>
                {activeRooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGetDirections}
                disabled={!selectedFromRoom || !selectedToRoom || selectedFromRoom === selectedToRoom}
                className={`w-full bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
              >
                <ArrowRight size={20} />
                Get Directions
              </button>
            </div>
          </div>

          {/* Directions Display */}
          {showDirections && selectedFromRoom && selectedToRoom && (
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-300/20">
              <h3 className={`font-bold mb-4 ${
                settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
              } text-gray-800`}>
                Directions: {activeRooms.find(r => r.id === selectedFromRoom)?.name} → {activeRooms.find(r => r.id === selectedToRoom)?.name}
              </h3>
              <div className="space-y-3">
                {generateDirections(selectedFromRoom, selectedToRoom).map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/40 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className={`${
                      settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    } text-gray-700 flex-1`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowDirections(false)}
                className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
              >
                Close Directions
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 mb-8">
            <h2 className={`font-bold mb-6 ${
              settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
            } text-gray-800`}>
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </h2>
            
            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className={`block font-medium mb-2 ${
                    settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } text-gray-700`}>
                    Room Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Living Room"
                    className={`w-full px-4 py-3 border border-gray-300/30 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm ${
                      settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    }`}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block font-medium mb-2 ${
                    settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } text-gray-700`}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Where you watch TV and relax"
                    className={`w-full px-4 py-3 border border-gray-300/30 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50 backdrop-blur-sm ${
                      settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                    }`}
                  />
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className={`block font-medium mb-3 ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } text-gray-700`}>
                  Choose Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {availableIcons.map((iconOption) => {
                    const IconComponent = iconOption.icon;
                    return (
                      <button
                        key={iconOption.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: iconOption.name })}
                        className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-1 ${
                          formData.icon === iconOption.name
                            ? 'border-orange-500 bg-orange-100/50'
                            : 'border-gray-300/30 bg-white/30 hover:border-orange-400'
                        }`}
                      >
                        <IconComponent size={20} />
                        <span className="text-xs">{iconOption.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className={`block font-medium mb-3 ${
                  settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } text-gray-700`}>
                  Choose Color
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {colorOptions.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: colorOption.value })}
                      className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                        formData.color === colorOption.value
                          ? 'border-orange-500'
                          : 'border-gray-300/30'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorOption.preview}`} />
                      <span className="text-xs">{colorOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`flex-1 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 ${
                    settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  }`}
                >
                  {editingRoom ? 'Update Room' : 'Add Room'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingRoom(null);
                    setFormData({
                      name: '',
                      description: '',
                      icon: 'Home',
                      color: 'bg-gradient-to-br from-orange-400 to-orange-500',
                    });
                  }}
                  className={`px-6 py-3 border border-gray-300/30 rounded-xl font-semibold transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-700 hover:border-orange-400 ${
                    settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Room Cards */}
        {activeRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeRooms.map((room) => {
              const IconComponent = iconMap[room.icon as keyof typeof iconMap] || Home;
              
              return (
                <div
                  key={room.id}
                  className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 ${room.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent size={32} className="text-white" />
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="p-1 rounded text-gray-500 hover:text-orange-500 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-1 rounded text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-bold mb-2 ${
                      settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
                    } text-gray-800`}>
                      {room.name}
                    </h3>
                    
                    {room.description && (
                      <p className={`${
                        settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      } text-gray-600`}>
                        {room.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-12 text-center">
            <MapPin size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className={`font-semibold mb-2 ${
              settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
            } text-gray-800`}>
              No rooms added yet
            </h3>
            <p className={`mb-6 ${
              settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
            } text-gray-600`}>
              Add room labels to help navigate your home
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className={`bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              }`}
            >
              Add First Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};