import React, { useEffect, useRef, useState } from 'react';

interface SpectrumAnalyzerProps {
  isActive: boolean;
}

const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [spectrumData, setSpectrumData] = useState<number[]>([]);

  useEffect(() => {
    // Generate mock spectrum data
    const data = Array.from({ length: 64 }, (_, i) => 
      Math.random() * (1 - i / 64) * 100
    );
    setSpectrumData(data);
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

      if (spectrumData.length > 0) {
        const barWidth = width / spectrumData.length;
        
        spectrumData.forEach((magnitude, i) => {
          const animatedMagnitude = isActive 
            ? magnitude * (0.7 + 0.3 * Math.sin(animationTime * 0.02 + i * 0.1))
            : magnitude * 0.3;
          
          const barHeight = (animatedMagnitude / 100) * height;
          const x = i * barWidth;
          const y = height - barHeight;

          // Create gradient for each bar
          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, '#10B981'); // Green at bottom
          gradient.addColorStop(0.5, '#3B82F6'); // Blue in middle
          gradient.addColorStop(1, '#8B5CF6'); // Purple at top

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 1, barHeight);

          // Add glow effect if active
          if (isActive && animatedMagnitude > 50) {
            ctx.shadowColor = '#8B5CF6';
            ctx.shadowBlur = 10;
            ctx.fillRect(x, y, barWidth - 1, barHeight);
            ctx.shadowBlur = 0;
          }
        });
      }

      animationTime++;
      
      if (isActive) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, spectrumData]);

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

export default SpectrumAnalyzer;