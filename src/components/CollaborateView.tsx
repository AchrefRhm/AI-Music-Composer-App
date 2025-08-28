import React, { useState } from 'react';
import { Users, Plus, Link, Crown, Mic, MicOff } from 'lucide-react';

const CollaborateView: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    
    setIsCreating(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/collaboration/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: roomName })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActiveRoom(data);
        setRoomName('');
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
    
    setIsCreating(false);
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/collaboration/join-room/${joinCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'You' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActiveRoom({
          room_id: data.room_id,
          participants: data.participants
        });
        setJoinCode('');
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const copyInviteLink = () => {
    if (activeRoom?.invite_link) {
      navigator.clipboard.writeText(activeRoom.invite_link);
    }
  };

  if (activeRoom) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Participants Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Participants</h3>
              </div>
              
              <div className="space-y-3">
                {activeRoom.participants?.map((participant: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {participant.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{participant.username}</p>
                      <p className="text-gray-400 text-xs">{participant.status}</p>
                    </div>
                    {participant.role === 'host' && (
                      <Crown className="h-4 w-4 text-yellow-400" />
                    )}
                    <button className="text-gray-400 hover:text-green-400">
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={copyInviteLink}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Link className="h-4 w-4" />
                <span>Copy Invite Link</span>
              </button>
            </div>
          </div>

          {/* Main Collaboration Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Collaborative Workspace</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live Session</span>
                </div>
              </div>
              
              {/* Shared Canvas */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6 min-h-64">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Collaborative Music Canvas</h4>
                  <p className="text-gray-400 mb-4">Work together in real-time to create amazing music</p>
                  <div className="flex justify-center space-x-3">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Start Composing
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Import MIDI
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Chat Area */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <h4 className="text-white font-medium">Team Chat</h4>
                </div>
                <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                  <div className="text-sm">
                    <span className="text-purple-400 font-medium">Achref:</span>
                    <span className="text-gray-300 ml-2">Welcome to the session! Let's create something amazing together 🎵</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-blue-400 font-medium">You:</span>
                    <span className="text-gray-300 ml-2">Excited to collaborate!</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Collaborate with Friends</h2>
        <p className="text-gray-400">Create music together in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Room */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="text-center mb-4">
            <Plus className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white">Create Room</h3>
            <p className="text-gray-400 text-sm">Start a new collaborative session</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room name..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleCreateRoom}
              disabled={!roomName.trim() || isCreating}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </div>

        {/* Join Room */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="text-center mb-4">
            <Link className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white">Join Room</h3>
            <p className="text-gray-400 text-sm">Join an existing session</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Room code or invite link..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleJoinRoom}
              disabled={!joinCode.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">🚀 Collaboration Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Real-time editing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Voice chat</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Shared instruments</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            <span>Version history</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborateView;