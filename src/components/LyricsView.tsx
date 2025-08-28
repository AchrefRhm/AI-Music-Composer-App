import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Heart } from 'lucide-react';

const LyricsView: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLyrics, setCurrentLyrics] = useState<string[]>([]);
  const [lyricsParams, setLyricsParams] = useState({
    mood: 'happy',
    theme: 'love',
    genre: 'pop'
  });
  const [customPrompt, setCustomPrompt] = useState('');

  const moods = ['happy', 'sad', 'energetic', 'calm', 'mysterious', 'romantic'];
  const themes = ['love', 'freedom', 'dreams', 'friendship', 'adventure', 'hope'];

  const handleGenerateLyrics = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/suggest-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: lyricsParams.mood,
          theme: customPrompt || lyricsParams.theme
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCurrentLyrics(data.suggestions);
      }
    } catch (error) {
      console.error('Error generating lyrics:', error);
    }
    
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Lyrics AI</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
                <select
                  value={lyricsParams.mood}
                  onChange={(e) => setLyricsParams({...lyricsParams, mood: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
                >
                  {moods.map(mood => (
                    <option key={mood} value={mood} className="capitalize">
                      {mood}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                <select
                  value={lyricsParams.theme}
                  onChange={(e) => setLyricsParams({...lyricsParams, theme: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
                >
                  {themes.map(theme => (
                    <option key={theme} value={theme} className="capitalize">
                      {theme}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Custom Prompt</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe what your song should be about..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                />
              </div>
            </div>
            
            <button
              onClick={handleGenerateLyrics}
              disabled={isGenerating}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Sparkles className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating...' : 'Generate Lyrics'}</span>
            </button>
          </div>
        </div>

        {/* Generated Lyrics */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full">
            <h3 className="text-lg font-semibold text-white mb-6">AI Suggestions</h3>
            
            {currentLyrics.length > 0 ? (
              <div className="space-y-4">
                {currentLyrics.map((lyric, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 group hover:bg-gray-650 transition-colors">
                    <div className="flex items-start justify-between">
                      <p className="text-white text-lg leading-relaxed flex-1">{lyric}</p>
                      <button
                        onClick={() => copyToClipboard(lyric)}
                        className="ml-4 p-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>Like</span>
                      </button>
                      <button className="text-gray-400 hover:text-gray-300 text-sm flex items-center space-x-1">
                        <RefreshCw className="h-3 w-3" />
                        <span>Refine</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">Ready to create amazing lyrics!</p>
                <p className="text-gray-500 text-sm">Set your preferences and click "Generate Lyrics" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-3">💡 Pro Tips for Better Lyrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h5 className="font-medium text-blue-400 mb-1">Be Specific</h5>
            <p>The more detailed your prompt, the better the AI can understand your vision.</p>
          </div>
          <div>
            <h5 className="font-medium text-purple-400 mb-1">Mix Moods</h5>
            <p>Try combining different moods to create unique emotional textures.</p>
          </div>
          <div>
            <h5 className="font-medium text-green-400 mb-1">Iterate</h5>
            <p>Generate multiple versions and combine the best parts.</p>
          </div>
          <div>
            <h5 className="font-medium text-pink-400 mb-1">Personal Touch</h5>
            <p>Use the AI suggestions as a starting point and add your own style.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsView;