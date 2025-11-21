import React, { useEffect, useState } from 'react';
import { Song } from '../types';
import { generateVibeDescription } from '../services/geminiService';

interface DailyWinnerHeroProps {
  song: Song;
}

const DailyWinnerHero: React.FC<DailyWinnerHeroProps> = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [vibe, setVibe] = useState<string>('Loading vibe check...');

  useEffect(() => {
    let isMounted = true;
    generateVibeDescription(song).then(desc => {
      if (isMounted) setVibe(desc);
    });
    return () => { isMounted = false; };
  }, [song]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would trigger audio.play()
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 shadow-2xl border border-blue-900/50 p-6 md:p-10 mb-8">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        {/* Cover Art */}
        <div className="relative group cursor-pointer" onClick={togglePlay}>
          <img 
            src={song.coverUrl} 
            alt={song.title} 
            className={`w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl shadow-2xl transition-transform duration-700 ${isPlaying ? 'scale-105' : 'hover:scale-105'}`}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors rounded-2xl flex items-center justify-center">
             <div className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform ${isPlaying ? 'scale-90' : 'scale-100'}`}>
               <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-2xl ml-1`}></i>
             </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold mb-4 border border-yellow-500/30">
            <i className="fas fa-crown mr-2"></i>
            MUSIC OF THE DAY
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight leading-tight">
            {song.title}
          </h1>
          <p className="text-xl text-blue-200 font-medium mb-6">{song.artist}</p>
          
          {/* AI Description */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm relative">
            <i className="fas fa-sparkles text-purple-400 absolute -top-2 -left-2 bg-slate-900 rounded-full p-1 text-sm"></i>
            <p className="text-slate-300 italic text-sm">"{vibe}"</p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center md:justify-start gap-4">
             {isPlaying && (
               <div className="flex items-end gap-1 h-8 mr-4">
                 <div className="w-1 bg-blue-400 equalizer-bar"></div>
                 <div className="w-1 bg-blue-400 equalizer-bar"></div>
                 <div className="w-1 bg-blue-400 equalizer-bar"></div>
                 <div className="w-1 bg-blue-400 equalizer-bar"></div>
               </div>
             )}
             <button className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-900/50">
               Add to Playlist
             </button>
             <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
               <i className="fas fa-share-alt"></i>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyWinnerHero;
