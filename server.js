const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock AI data
const GENRES = ['pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop'];
const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const MOODS = ['happy', 'sad', 'energetic', 'calm', 'mysterious', 'romantic'];

// Mock melody patterns
const MELODY_PATTERNS = {
    'pop': [60, 62, 64, 65, 67, 69, 71, 72],
    'rock': [57, 60, 62, 64, 67, 69, 71, 72],
    'jazz': [60, 63, 65, 67, 70, 72, 74, 75],
    'classical': [60, 62, 64, 65, 67, 69, 71, 72],
    'electronic': [60, 64, 67, 71, 74, 76, 79, 81],
    'hip-hop': [57, 60, 63, 65, 68, 70, 72, 75]
};

// Mock lyrics database
const LYRICS_BANK = {
    'happy': [
        "Dancing in the sunshine",
        "Every moment feels so right",
        "Life is a beautiful melody",
        "Singing with all my heart",
        "Joy flows through every beat"
    ],
    'sad': [
        "Tears fall like gentle rain",
        "Memories fade away",
        "Lost in the shadows",
        "Broken dreams and silent screams",
        "Emptiness fills the void"
    ],
    'energetic': [
        "Feel the power in your soul",
        "Rise up and break the chains",
        "Nothing can stop us now",
        "Burning bright like a star",
        "Electric energy flows"
    ]
};

app.post('/api/generate-melody', (req, res) => {
    const { genre = 'pop', key = 'C', tempo = 120, mood = 'happy' } = req.body;
    
    // Simulate AI processing time
    setTimeout(() => {
        // Generate mock melody
        const basePattern = MELODY_PATTERNS[genre] || MELODY_PATTERNS['pop'];
        const melody = [];
        
        for (let i = 0; i < 16; i++) {
            const note = basePattern[Math.floor(Math.random() * basePattern.length)] + 
                        Math.floor(Math.random() * 11) - 5;
            const duration = [0.25, 0.5, 1.0, 2.0][Math.floor(Math.random() * 4)];
            melody.push({
                note: note,
                duration: duration,
                time: i * 0.5
            });
        }
        
        res.json({
            success: true,
            melody: melody,
            metadata: {
                genre: genre,
                key: key,
                tempo: tempo,
                mood: mood,
                length: 8.0
            }
        });
    }, 2000);
});

app.post('/api/suggest-lyrics', (req, res) => {
    const { mood = 'happy', theme = '' } = req.body;
    
    // Simulate AI processing
    setTimeout(() => {
        const moodLyrics = LYRICS_BANK[mood] || LYRICS_BANK['happy'];
        const suggestions = moodLyrics
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(3, moodLyrics.length));
        
        res.json({
            success: true,
            suggestions: suggestions,
            mood: mood,
            confidence: Math.round((Math.random() * 0.25 + 0.7) * 100) / 100
        });
    }, 1000);
});

app.post('/api/export-song', (req, res) => {
    const { format = 'mp3' } = req.body;
    
    // Simulate export processing
    setTimeout(() => {
        res.json({
            success: true,
            download_url: `/downloads/song_${Date.now()}.${format}`,
            format: format,
            size: `${Math.floor(Math.random() * 7) + 2}.${Math.floor(Math.random() * 90) + 10}MB`
        });
    }, 3000);
});

app.post('/api/collaboration/create-room', (req, res) => {
    const { name = 'Untitled Room' } = req.body;
    
    const roomId = `room_${Date.now()}_${Math.floor(Math.random() * 9000) + 1000}`;
    
    res.json({
        success: true,
        room_id: roomId,
        name: name,
        invite_link: `http://localhost:5173/collaborate/${roomId}`,
        created_at: Date.now() / 1000
    });
});

app.post('/api/collaboration/join-room/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { username = 'Anonymous' } = req.body;
    
    res.json({
        success: true,
        room_id: roomId,
        username: username,
        participants: [
            { username: 'Achref', status: 'online', role: 'host' },
            { username: username, status: 'online', role: 'collaborator' }
        ]
    });
});

app.get('/api/waveform-data', (req, res) => {
    // Generate 100 sample points
    const waveform = [];
    for (let i = 0; i < 100; i++) {
        const amplitude = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.abs(Math.sin(i * 0.1)));
        waveform.push(amplitude);
    }
    
    res.json({
        success: true,
        waveform: waveform,
        sample_rate: 44100,
        duration: 5.0
    });
});

app.get('/api/spectrum-data', (req, res) => {
    // Generate frequency spectrum data
    const frequencies = [];
    for (let i = 0; i < 50; i++) {
        const freq = i * 20; // 0-1000 Hz range
        const magnitude = Math.random() * 100 * (1 - i/50); // Lower frequencies have higher magnitude
        frequencies.push({
            frequency: freq,
            magnitude: magnitude
        });
    }
    
    res.json({
        success: true,
        spectrum: frequencies
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log('🎵 AI Music Composer Backend Starting...');
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log('🎼 Ready to generate amazing music!');
});