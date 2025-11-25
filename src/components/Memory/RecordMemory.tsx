import React, { useState } from 'react';
import { Mic, MicOff, Save, X, Play, Pause, Camera, Image, Tag } from 'lucide-react';
import { useMemory } from '../../contexts/MemoryContext';
import { usePatient } from '../../contexts/PatientContext';
import { useAudioRecording } from '../../hooks/useAudioRecording';
import { MemorySnippet } from '../../types';

interface RecordMemoryProps {
  onNavigate: (page: string) => void;
}

export const RecordMemory: React.FC<RecordMemoryProps> = ({ onNavigate }) => {
  const { dispatch } = useMemory();
  const { state } = usePatient();
  const { settings } = state.currentPatient || { settings: { fontSize: 'large', highContrast: true } };
  const {
    isRecording,
    audioBlob,
    audioUrl,
    duration,
    startRecording,
    stopRecording,
    clearRecording,
    formatDuration
  } = useAudioRecording();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'people' | 'places' | 'tasks' | 'routines'>('people');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [importance, setImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const categories = [
    { value: 'people', label: 'People', color: 'bg-gradient-to-br from-gray-500 to-gray-600', description: 'Family, friends, caregivers' },
    { value: 'places', label: 'Places', color: 'bg-gradient-to-br from-teal-400 to-teal-500', description: 'Locations, rooms, destinations' },
    { value: 'tasks', label: 'Tasks', color: 'bg-gradient-to-br from-gray-600 to-teal-400', description: 'How to do things' },
    { value: 'routines', label: 'Routines', color: 'bg-gradient-to-br from-emerald-300 to-emerald-400', description: 'Daily activities' },
  ];

  const importanceLevels = [
    { value: 'low', label: 'Nice to Remember', color: 'bg-gradient-to-br from-gray-400 to-gray-500' },
    { value: 'medium', label: 'Important', color: 'bg-gradient-to-br from-teal-300 to-teal-400' },
    { value: 'high', label: 'Very Important', color: 'bg-gradient-to-br from-teal-500 to-teal-600' },
  ];

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePlayToggle = () => {
    if (!audioUrl) return;

    if (isPlaying) {
      audioElement?.pause();
      setIsPlaying(false);
    } else {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setAudioElement(audio);
      setIsPlaying(true);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPhotos(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for your memory');
      return;
    }

    const memory: MemorySnippet = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      audioUrl: audioUrl || undefined,
      photos,
      category,
      tags,
      importance,
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_MEMORY', payload: memory });

    // Clear form
    setTitle('');
    setDescription('');
    setTags([]);
    setPhotos([]);
    clearRecording();

    // Navigate back to memories
    onNavigate('memories');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Balls */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full opacity-20 animate-float-slow blur-sm" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-15 animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full opacity-25 animate-float-fast blur-xs" />
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-gray-500 to-teal-400 rounded-full opacity-20 animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-br from-teal-500 to-gray-500 rounded-full opacity-30 animate-float-medium blur-sm" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pb-40">
        {/* Glassmorphism Panel */}
        <div className={`backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-6 sm:p-8 ${settings.highContrast ? 'border-black/50' : ''}`}>
          <div className="mb-8">
            <h1 className={`font-bold mb-2 ${settings.fontSize === 'extra-large' ? 'text-3xl' :
                settings.fontSize === 'large' ? 'text-2xl' : 'text-xl'
              } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
              Record New Memory
            </h1>
            <p className={`${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
              } ${settings.highContrast ? 'text-gray-700' : 'text-gray-600'}`}>
              Save an important memory with audio, photos, and notes
            </p>
          </div>

          {/* Recording Section */}
          <div className="mb-8">
            <h2 className={`font-semibold mb-4 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
              } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
              Audio Recording
            </h2>

            <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-teal-50/50 to-gray-50/50 backdrop-blur-sm rounded-2xl border border-white/30">
              <button
                onClick={handleRecordToggle}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg ${isRecording
                    ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse'
                    : 'bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600'
                  } text-white`}
              >
                {isRecording ? <MicOff size={48} /> : <Mic size={48} />}
              </button>

              <div className="text-center">
                <p className={`font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                  {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
                </p>

                {(isRecording || audioUrl) && (
                  <div className={`font-mono text-2xl font-bold ${isRecording ? 'text-red-600' : 'text-teal-600'
                    }`}>
                    {formatDuration(duration)}
                  </div>
                )}
              </div>

              {audioUrl && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayToggle}
                    className="bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-3 rounded-full transition-all duration-200"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <span className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    } ${settings.highContrast ? 'text-black' : 'text-gray-600'}`}>
                    Recording ready ({formatDuration(duration)})
                  </span>
                  <button
                    onClick={clearRecording}
                    className="text-red-500 hover:text-red-600 p-2 rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Photo Section */}
          <div className="mb-8">
            <h2 className={`font-semibold mb-4 ${settings.fontSize === 'extra-large' ? 'text-xl' : 'text-lg'
              } ${settings.highContrast ? 'text-black' : 'text-gray-800'}`}>
              Add Photos
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer hover:border-teal-400 transition-colors bg-white/20 backdrop-blur-sm">
                <div className="text-center">
                  <Camera size={32} className="mx-auto mb-2 text-teal-500" />
                  <span className={`${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    } text-gray-600`}>
                    Click to add photos
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Memory photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Memory Details */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                Memory Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is this memory about?"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } ${settings.highContrast ? 'border-black' : 'border-teal-300'}`}
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this memory..."
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                  } ${settings.highContrast ? 'border-black' : 'border-teal-300'}`}
              />
            </div>

            {/* Category */}
            <div>
              <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${category === cat.value
                        ? `${cat.color} text-white border-transparent shadow-lg`
                        : settings.highContrast
                          ? 'border-black text-black hover:bg-gray-200 bg-white/30'
                          : 'border-teal-300 text-gray-700 hover:border-teal-400 bg-white/30'
                      }`}
                  >
                    <span className={`font-medium block ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      }`}>
                      {cat.label}
                    </span>
                    <span className={`text-xs opacity-75 ${category === cat.value ? 'text-white' : 'text-gray-500'
                      }`}>
                      {cat.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Importance */}
            <div>
              <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                How Important is This Memory?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {importanceLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setImportance(level.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${importance === level.value
                        ? `${level.color} text-white border-transparent shadow-lg`
                        : settings.highContrast
                          ? 'border-black text-black hover:bg-gray-200 bg-white/30'
                          : 'border-teal-300 text-gray-700 hover:border-teal-400 bg-white/30'
                      }`}
                  >
                    <span className={`font-medium ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                      }`}>
                      {level.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={`block font-medium mb-2 ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'
                } ${settings.highContrast ? 'text-black' : 'text-gray-700'}`}>
                Tags (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add a tag..."
                  className={`flex-1 px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/50 backdrop-blur-sm ${settings.fontSize === 'extra-large' ? 'text-base' : 'text-sm'
                    } ${settings.highContrast ? 'border-black' : 'border-teal-300'}`}
                />
                <button
                  onClick={handleAddTag}
                  className="bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Tag size={16} />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${settings.highContrast ? 'bg-gray-200 text-black' : 'bg-teal-100 text-teal-800'
                      }`}
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${title.trim()
                  ? 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'}`}
            >
              <Save size={20} />
              Save Memory
            </button>

            <button
              onClick={() => onNavigate('memories')}
              className={`px-6 py-4 border-2 rounded-lg font-semibold transition-all duration-200 bg-white/50 backdrop-blur-sm ${settings.highContrast
                  ? 'border-black text-black hover:bg-gray-200'
                  : 'border-teal-300 text-gray-700 hover:border-teal-400'
                } ${settings.fontSize === 'extra-large' ? 'text-lg' : 'text-base'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};