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
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl border border-white/5 p-6 md:p-12 mb-8 group mt-20">
      
      {/* Dynamic Background Lights */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
          <div className={`absolute -top-[50%] -right-[50%] w-[100%] h-[100%] bg-blue-600/20 rounded-full blur-[120px] transition-all duration-1000 ${isPlaying ? 'scale-110 opacity-100' : 'scale-100 opacity-50'}`}></div>
          <div className={`absolute -bottom-[20%] -left-[20%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[100px] transition-all duration-1000 ${isPlaying ? 'scale-110 opacity-100' : 'scale-100 opacity-50'}`}></div>
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Cover Art */}
        <div className="relative group cursor-pointer shrink-0 perspective-1000" onClick={onTogglePlay}>
          <div className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2rem] blur-xl transition-opacity duration-500 ${isPlaying ? 'opacity-60' : 'opacity-0 group-hover:opacity-30'}`}></div>
          <img 
            src={song.coverUrl} 
            alt={song.title} 
            className={`relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-[2rem] shadow-2xl transition-all duration-700 z-10 ${isPlaying ? 'scale-[1.02] rotate-1 shadow-blue-900/50' : 'hover:scale-[1.02] hover:-rotate-1'}`}
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110">
               <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-3xl ml-1`}></i>
             </div>
          </div>

          {/* Corner Badge */}
          <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
             <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left w-full">
          <div className="inline-flex items-center justify-center md:justify-start px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-300 text-xs font-bold border border-amber-500/20 mb-6">
              <i className="fas fa-crown mr-2 text-amber-400"></i>
              SONG OF THE DAY
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight leading-tight drop-shadow-lg">
            {song.title}
          </h1>
          <p className="text-2xl text-blue-200 font-medium mb-8">{song.artist}</p>
          
          {/* AI Description */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm relative">
            <i className="fas fa-quote-left text-blue-500/30 text-4xl absolute -top-4 -left-2"></i>
            <p className="text-slate-300 text-lg font-light leading-relaxed relative z-10">
              "{vibe}"
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="h-12 flex items-center bg-black/20 rounded-xl px-4 border border-white/5">
                <AudioVisualizer isPlaying={isPlaying} />
             </div>
             
             <div className="flex items-center gap-3">
               <button className="px-8 py-3 rounded-full bg-white text-slate-900 hover:bg-blue-50 font-bold text-sm transition-all shadow-lg shadow-white/10 active:scale-95 flex items-center gap-2">
                 <i className="fab fa-spotify text-xl"></i>
                 Listen on Spotify
               </button>
               <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors">
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