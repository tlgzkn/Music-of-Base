
import React, { useEffect, useState } from 'react';
import { Song } from '../types';
import { generateVibeDescription } from '../services/geminiService';
import AudioVisualizer from './AudioVisualizer';

interface DailyWinnerHeroProps {
  song: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const DailyWinnerHero: React.FC<DailyWinnerHeroProps> = ({ song, isPlaying, onTogglePlay }) => {
  const [vibe, setVibe] = useState<string>('Loading vibe check...');

  useEffect(() => {
    let isMounted = true;
    generateVibeDescription(song).then(desc => {
      if (isMounted) setVibe(desc);
    });
    return () => { isMounted = false; };
  }, [song]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 shadow-2xl border border-blue-900/50 p-6 md:p-10 mb-8 group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        {/* Cover Art */}
        <div className="relative group cursor-pointer shrink-0" onClick={onTogglePlay}>
          <div className={`absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
          <img 
            src={song.coverUrl} 
            alt={song.title} 
            className={`relative w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl shadow-2xl transition-transform duration-700 z-10 ${isPlaying ? 'scale-105 rotate-1' : 'hover:scale-105'}`}
          />
          <div className="absolute inset-0 z-20 bg-black/30 group-hover:bg-black/40 transition-colors rounded-2xl flex items-center justify-center">
             <div className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'scale-90 bg-blue-500/40' : 'scale-100 hover:scale-110'}`}>
               <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-2xl ml-1`}></i>
             </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center justify-center md:justify-start px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 w-fit mx-auto md:mx-0">
              <i className="fas fa-crown mr-2 text-amber-400"></i>
              MUSIC OF THE DAY
            </div>
            {isPlaying && (
               <div className="hidden md:block">
                 <div className="flex items-center gap-2 text-blue-400 text-xs font-mono animate-pulse">
                   <i className="fas fa-broadcast-tower"></i> ON AIR
                 </div>
               </div>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight leading-tight drop-shadow-lg">
            {song.title}
          </h1>
          <p className="text-xl text-blue-200 font-medium mb-6">{song.artist}</p>
          
          {/* AI Description */}
          <div className="bg-gradient-to-r from-white/5 to-transparent border-l-4 border-blue-500/50 rounded-r-xl p-4 mb-8 backdrop-blur-sm">
            <p className="text-slate-300 italic text-sm leading-relaxed">
              "{vibe}"
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="h-12 flex items-center">
                <AudioVisualizer isPlaying={isPlaying} />
             </div>
             
             <div className="flex items-center gap-3">
               <button className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-500/25 active:scale-95 flex items-center gap-2">
                 <i className="fab fa-spotify text-lg"></i>
                 Listen on Spotify
               </button>
               <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                 <i className="fas fa-share-alt"></i>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyWinnerHero;
