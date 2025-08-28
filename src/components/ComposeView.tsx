import React, { useState } from 'react';
import { Play, Square, RotateCcw, Wand2, Settings } from 'lucide-react';
import WaveformDisplay from './WaveformDisplay';
import SpectrumAnalyzer from './SpectrumAnalyzer';

const ComposeView: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMelody, setCurrentMelody] = useState<any>(null);
  const [params, setParams] = useState({
    genre: 'pop',
    key: 'C',
    tempo: 120,
    mood: 'happy'
  });

  const genres = ['pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop'];
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const moods = ['happy', 'sad', 'energetic', 'calm', 'mysterious', 'romantic'];

  const handleGenerateMelody = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-melody', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCurrentMelody(data.melody);
      }
    } catch (error) {
      console.error('Error generating melody:', error);
    }
    
    setIsGenerating(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Controls Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Composition Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                value={params.genre}
                onChange={(e) => setParams({...params, genre: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre} className="capitalize">
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Key</label>
              <select
                value={params.key}
                onChange={(e) => setParams({...params, key: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {keys.map(key => (
                  <option key={key} value={key}>{key} Major</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tempo: {params.tempo} BPM</label>
              <input
                type="range"
                min="60"
                max="180"
                value={params.tempo}
                onChange={(e) => setParams({...params, tempo: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
              <select
                value={params.mood}
                onChange={(e) => setParams({...params, mood: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {moods.map(mood => (
                  <option key={mood} value={mood} className="capitalize">
                    {mood}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleGenerateMelody}
            disabled={isGenerating}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Wand2 className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Generate AI Melody'}</span>
          </button>
        </div>

        {/* Playback Controls */}
        {currentMelody && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Playback</h3>
            <div className="flex space-x-3">
              <button
                onClick={togglePlayback}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaying ? 'Stop' : 'Play'}</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visualization Panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Waveform</h3>
          <WaveformDisplay isPlaying={isPlaying} />
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Spectrum Analyzer</h3>
          <SpectrumAnalyzer isActive={isPlaying} />
        </div>
        
        {currentMelody && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Generated Melody</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {currentMelody.map((note: any, index: number) => (
                  <div
                    key={index}
                    className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-mono"
                  >
                    Note {note.note}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <p>Genre: <span className="text-purple-400 capitalize">{params.genre}</span></p>
                <p>Key: <span className="text-purple-400">{params.key} Major</span></p>
                <p>Tempo: <span className="text-purple-400">{params.tempo} BPM</span></p>
                <p>Mood: <span className="text-purple-400 capitalize">{params.mood}</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComposeView;