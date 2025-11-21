
import React from 'react';
import { DailyWinner } from '../types';

interface PlaylistViewProps {
  winners: DailyWinner[];
}

const PlaylistView: React.FC<PlaylistViewProps> = ({ winners }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Platform Links */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2">
             <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-900/50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                SYNCED
             </span>
        </div>
        
        <div>
           <h2 className="text-xl font-bold text-white mb-1">Official Playlists</h2>
           <p className="text-sm text-slate-400">Updated automatically daily with the top voted tracks.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-green-900/20">
            <i className="fab fa-spotify text-lg"></i> Spotify
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FA243C] text-white font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-red-900/20">
            <i className="fab fa-apple text-lg"></i> Music
          </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] text-white font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-red-900/20">
            <i className="fab fa-youtube text-lg"></i> YouTube
          </button>
        </div>
      </div>

      {/* History List */}
      <div>
        <div className="flex items-center gap-3 mb-6">
             <h2 className="text-2xl font-bold text-white">Past Winners</h2>
             <div className="h-px bg-slate-800 flex-1"></div>
             <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{winners.length} Tracks</span>
        </div>
        
        <div className="space-y-4">
          {winners.map((winner, idx) => (
            <div key={winner.id} className="group flex flex-col md:flex-row gap-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-900/50 p-4 rounded-xl transition-all duration-300">
               <div className="relative">
                 <img src={winner.coverUrl} alt={winner.title} className="w-full md:w-32 h-32 object-cover rounded-lg shadow-lg" />
                 <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                    #{winners.length - idx}
                 </div>
               </div>
               
               <div className="flex-1 flex flex-col justify-between">
                 <div>
                   <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-blue-400 font-bold border border-blue-900/50 px-2 py-0.5 rounded bg-blue-900/10">
                                {winner.date}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{winner.title}</h3>
                        <p className="text-slate-400">{winner.artist}</p>
                      </div>
                      <div className="bg-slate-950 px-3 py-1 rounded-full text-xs font-bold text-slate-300 border border-slate-800">
                         {winner.voteCount} votes
                      </div>
                   </div>
                 </div>
                 
                 <div className="mt-2">
                    <p className="text-sm text-slate-400 italic bg-black/20 p-3 rounded-lg border border-white/5">
                        <i className="fas fa-quote-left text-slate-600 mr-2 text-xs"></i>
                        {winner.vibeDescription}
                    </p>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
