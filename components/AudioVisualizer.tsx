import React from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  return (
    <div className={`flex items-end gap-1 h-12 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`w-2 bg-blue-400 rounded-t-sm transition-all duration-300 ${
            isPlaying ? 'animate-music-bar' : 'h-1'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isPlaying ? undefined : '4px'
          }}
        ></div>
      ))}
      <style>{`
        @keyframes music-bar {
          0% { height: 10%; opacity: 0.5; }
          50% { height: 100%; opacity: 1; }
          100% { height: 10%; opacity: 0.5; }
        }
        .animate-music-bar {
          animation: music-bar 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AudioVisualizer;