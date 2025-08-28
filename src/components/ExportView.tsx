import React, { useState } from 'react';
import { Download, Music, FileText, Headphones, Share2 } from 'lucide-react';

const ExportView: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState('mp3');
  const [exportQuality, setExportQuality] = useState('high');
  
  const formats = [
    { value: 'mp3', label: 'MP3', icon: Music, description: 'Compressed audio, smaller file size' },
    { value: 'wav', label: 'WAV', icon: Headphones, description: 'Uncompressed audio, high quality' },
    { value: 'midi', label: 'MIDI', icon: FileText, description: 'Musical notation data' },
  ];

  const qualities = [
    { value: 'high', label: 'High (320kbps)', size: '~8MB' },
    { value: 'medium', label: 'Medium (192kbps)', size: '~5MB' },
    { value: 'low', label: 'Low (128kbps)', size: '~3MB' },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch('http://localhost:5000/api/export-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: exportFormat,
          quality: exportQuality
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setExportProgress(100);
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
          // In a real app, this would trigger the download
          alert(`Song exported successfully! File: ${data.download_url}`);
        }, 500);
      }
    } catch (error) {
      console.error('Error exporting song:', error);
      setIsExporting(false);
      setExportProgress(0);
    }

    clearInterval(progressInterval);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <Download className="h-16 w-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Export Your Music</h2>
        <p className="text-gray-400">Choose your preferred format and quality</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Settings */}
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Export Format</h3>
            <div className="space-y-3">
              {formats.map(format => {
                const IconComponent = format.icon;
                return (
                  <label key={format.value} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650 transition-colors">
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={exportFormat === format.value}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="text-green-500 focus:ring-green-500 focus:ring-2"
                    />
                    <IconComponent className="h-5 w-5 text-green-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{format.label}</p>
                      <p className="text-gray-400 text-sm">{format.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Quality Settings (only for audio formats) */}
          {(exportFormat === 'mp3' || exportFormat === 'wav') && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Quality Settings</h3>
              <div className="space-y-3">
                {qualities.map(quality => (
                  <label key={quality.value} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650 transition-colors">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="quality"
                        value={quality.value}
                        checked={exportQuality === quality.value}
                        onChange={(e) => setExportQuality(e.target.value)}
                        className="text-green-500 focus:ring-green-500 focus:ring-2"
                      />
                      <span className="text-white font-medium">{quality.label}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{quality.size}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview & Export */}
        <div className="space-y-6">
          {/* Song Preview */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Song Preview</h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">My AI Composition</h4>
                  <p className="text-gray-400 text-sm">Pop • 3:45 • 120 BPM</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Genre:</span>
                  <span className="text-purple-400">Pop</span>
                </div>
                <div className="flex justify-between">
                  <span>Key:</span>
                  <span className="text-blue-400">C Major</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-green-400">3:45</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Confidence:</span>
                  <span className="text-yellow-400">94%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Ready to Export</h3>
            
            {isExporting && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Exporting...</span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mb-4"
            >
              <Download className="h-5 w-5" />
              <span>{isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}</span>
            </button>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Tips */}
      <div className="mt-8 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-800/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-3">💡 Export Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div>
            <h5 className="font-medium text-green-400 mb-1">MP3 Format</h5>
            <p>Best for streaming, sharing, and general listening. Smaller file sizes.</p>
          </div>
          <div>
            <h5 className="font-medium text-blue-400 mb-1">WAV Format</h5>
            <p>Highest quality for professional use, mastering, and archival purposes.</p>
          </div>
          <div>
            <h5 className="font-medium text-purple-400 mb-1">MIDI Format</h5>
            <p>Perfect for sharing with other producers and importing into DAWs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportView;