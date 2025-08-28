import React, { useEffect, useRef, useState } from 'react';

interface WaveformDisplayProps {
  isPlaying: boolean;
}

const WaveformDisplay: React.FC<WaveformDisplayProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    // Generate mock waveform data
    const data = Array.from({ length: 100 }, (_, i) => 
      Math.sin(i * 0.1) * Math.random() * 0.8
    );
    setWaveformData(data);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationTime = 0;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Draw background grid
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let i = 0; i < height; i += 25) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw center line
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw waveform
      if (waveformData.length > 0) {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#8B5CF6');
        gradient.addColorStop(0.5, '#3B82F6');
        gradient.addColorStop(1, '#10B981');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const stepX = width / waveformData.length;
        
        waveformData.forEach((amplitude, i) => {
          const x = i * stepX;
          const animatedAmplitude = isPlaying 
            ? amplitude * (1 + 0.3 * Math.sin(animationTime * 0.01 + i * 0.1))
            : amplitude;
          const y = (height / 2) + (animatedAmplitude * height * 0.4);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();

        // Draw playhead if playing
        if (isPlaying) {
          const playheadX = (animationTime * 0.5) % width;
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(playheadX, 0);
          ctx.lineTo(playheadX, height);
          ctx.stroke();
        }
      }

      animationTime++;
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, waveformData]);

  return (
    <div className="w-full h-48 bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default WaveformDisplay;