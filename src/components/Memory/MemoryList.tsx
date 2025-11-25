import React, { useState } from 'react';
import { Brain, Play, Pause, Search, Filter, Calendar, Tag, Home, Users, Heart } from 'lucide-react';
import { useMemory } from '../../contexts/MemoryContext';
import { usePatient } from '../../contexts/PatientContext';
import { MemorySnippet } from '../../types';

interface MemoryListProps {
  onNavigate: (page: string) => void;
}

export const MemoryList: React.FC<MemoryListProps> = ({ onNavigate }) => {
  const { state } = useMemory();
  const { state: patientState } = usePatient();
  const { settings } = patientState.currentPatient || { settings: { fontSize: 'large', highContrast: true } };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingMemoryId, setPlayingMemoryId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'people', label: 'People', color: 'bg-teal-500' },
    { value: 'places', label: 'Places', color: 'bg-gray-500' },
    { value: 'tasks', label: 'Tasks', color: 'bg-teal-400' },
    { value: 'routines', label: 'Routines', color: 'bg-gray-600' },
  ];

  // Sample family photos and house image
  const familyPhotos = [
    {
      id: 'house',
      name: 'Our Home',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'house'
    },
    {
      id: 'wife',
      name: 'Margaret',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
      type: 'family',
      relationship: 'Wife'
    },
    {
      id: 'son',
      name: 'Michael',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      type: 'family',
      relationship: 'Son'
    },
    {
      id: 'daughter',
      name: 'Sarah',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      type: 'family',
      relationship: 'Daughter'
    },
    {
      id: 'grandson',
      name: 'Tommy',
      image: 'https://images.pexels.com/photos/1068205/pexels-photo-1068205.jpeg?auto=compress&cs=tinysrgb&w=300',
      type: 'family',
      relationship: 'Grandson'
    },
    {
      id: 'granddaughter',
      name: 'Emma',
      image: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=300',
      type: 'family',
      relationship: 'Granddaughter'
    }
  ];

  const filteredMemories = state.memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || memory.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handlePlayToggle = (memory: MemorySnippet) => {
    if (!memory.audioUrl) return;

    if (playingMemoryId === memory.id) {
      audioElement?.pause();
      setPlayingMemoryId(null);
      setAudioElement(null);
    } else {
      // Stop current audio if playing
      if (audioElement) {
        audioElement.pause();
      }

      const audio = new Audio(memory.audioUrl);
      audio.onended = () => {
        setPlayingMemoryId(null);
        setAudioElement(null);
      };
      audio.play();
      setPlayingMemoryId(memory.id);
      setAudioElement(audio);
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'bg-gray-500';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-teal-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-teal-500/20 rounded-full blur-xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-gray-400/15 to-gray-500/15 rounded-full blur-lg animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-emerald-300/25 to-emerald-400/25 rounded-full blur-xl animate-float-fast" />
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-gray-500/20 to-teal-400/20 rounded-full blur-lg animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-br from-teal-500/30 to-gray-500/30 rounded-full blur-xl animate-float-medium" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pb-40">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-3xl' : 'text-2xl'
                } text-gray-800`}>
                My Memories
              </h1>
              <p className={`mt-1 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } text-gray-600`}>
                {filteredMemories.length} memories found
              </p>
            </div>

            <button
              onClick={() => onNavigate('record')}
              className={`bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
            >
              Record New Memory
            </button>
          </div>
        </div>

        {/* Family Photos Section */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 mb-8">
          <h2 className={`font-bold mb-6 ${settings.fontSize === 'extra-large' ? 'text-2xl' : 'text-xl'
            } text-gray-800 flex items-center gap-2`}>
            <Heart size={24} className="text-teal-500" />
            Family & Home
          </h2>

          {/* House Image */}
          <div className="mb-8">
            <div className="relative group">
              <img
                src={familyPhotos[0].image}
                alt={familyPhotos[0].name}
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Home size={20} />
                  <h3 className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
                    }`}>
                    {familyPhotos[0].name}
                  </h3>
                </div>
                <p className="text-sm opacity-90">The place where all our memories are made</p>
              </div>
            </div>
          </div>

          {/* Family Members */}
          <div>
            <h3 className={`font-semibold mb-4 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
              } text-gray-800 flex items-center gap-2`}>
              <Users size={20} className="text-teal-500" />
              My Loved Ones
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {familyPhotos.slice(1).map((person) => (
                <div key={person.id} className="group text-center">
                  <div className="relative mb-3">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-20 h-20 object-cover rounded-full mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full" />
                  </div>
                  <h4 className={`font-bold ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    } text-gray-800`}>
                    {person.name}
                  </h4>
                  <p className={`${settings.fontSize === 'extra-large' ? 'text-sm' : 'text-xs'
                    } text-gray-600`}>
                    {person.relationship}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search memories..."
                className={`w-full pl-10 pr-4 py-3 border border-gray-300/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  }`}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter size={20} className="text-gray-500 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${selectedCategory === category.value
                      ? category.color
                        ? `${category.color} text-white shadow-lg`
                        : 'bg-teal-500 text-white shadow-lg'
                      : 'border border-gray-300/30 text-gray-700 hover:border-teal-400 bg-white/30'
                    } ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Memory Cards */}
        {filteredMemories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-2xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
              >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getCategoryColor(memory.category)
                    }`}>
                    {memory.category.charAt(0).toUpperCase() + memory.category.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(memory.createdAt)}
                  </span>
                </div>

                {/* Memory Content */}
                <div className="mb-4">
                  <h3 className={`font-bold mb-2 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
                    } text-gray-800`}>
                    {memory.title}
                  </h3>

                  {memory.description && (
                    <p className={`mb-3 ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      } text-gray-600 line-clamp-3`}>
                      {memory.description}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {memory.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {memory.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100/50 text-gray-700 border border-gray-300/20"
                        >
                          <Tag size={10} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                      {memory.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{memory.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Audio Player */}
                {memory.audioUrl && (
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handlePlayToggle(memory)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg ${playingMemoryId === memory.id
                          ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                          : 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                        } ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'}`}
                    >
                      {playingMemoryId === memory.id ? (
                        <>
                          <Pause size={16} />
                          Stop Playing
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          Play Memory
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/25 border border-gray-300/20 rounded-3xl shadow-xl p-12 text-center">
            <Brain size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className={`font-semibold mb-2 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
              } text-gray-800`}>
              {searchTerm || selectedCategory !== 'all' ? 'No memories found' : 'No memories yet'}
            </h3>
            <p className={`mb-6 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              } text-gray-600`}>
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Start recording your precious memories'
              }
            </p>
            <button
              onClick={() => onNavigate('record')}
              className={`bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                }`}
            >
              Record Your First Memory
            </button>
          </div>
        )}
      </div>
    </div>
  );
};