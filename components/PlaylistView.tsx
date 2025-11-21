import React, { useState, useEffect } from 'react';
import { DailyWinner } from '../types';

interface PlaylistViewProps {
  winners: DailyWinner[];
}

const PlaylistView: React.FC<PlaylistViewProps> = ({ winners }) => {
  const [isSyncing, setIsSyncing] = useState(true);

  // Simulate API syncing effect when view opens
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSyncing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-20 pb-20">
      
      {/* Hero Card for Playlists */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-900/40 to-slate-900 border border-green-500/20 p-8 md:p-12">
        <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-green-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-4">
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-yellow-400 animate-ping' : 'bg-green-500'}`}></span>
                {isSyncing ? 'SYNCING BLOCKCHAIN DATA...' : 'LIVE PLAYLIST SYNC ACTIVE'}
             </div>
             <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Official Community Playlist</h2>
             <p className="text-slate-400 max-w-md text-lg">The daily winners, curated by you, automatically added to our streaming partners.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-3 px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-slate-900 font-bold rounded-full transition-all shadow-lg shadow-green-900/40 active:scale-95">
              <i className={`fab fa-spotify text-xl ${isSyncing ? 'animate-spin' : ''}`}></i> 
              {isSyncing ? 'Syncing...' : 'Open Spotify'}
            </button>
            <button className="flex items-center justify-center w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-slate-700 transition-colors">
              <i className="fab fa-apple text-xl"></i>
            </button>
             <button className="flex items-center justify-center w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-slate-700 transition-colors">
              <i className="fab fa-youtube text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div>
        <div className="flex items-end justify-between mb-8 px-2">
             <h2 className="text-2xl font-bold text-white">History</h2>
             <span className="text-sm font-mono text-slate-500">{winners.length} TRACKS</span>
        </div>
        
        <div className="grid gap-4">
          {winners.map((winner, idx) => {
            const isLatest = idx === 0;
            
            return (
            <div key={winner.id} className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${
               isLatest 
                ? 'bg-slate-800/80 border border-blue-500/40 shadow-xl' 
                : 'bg-slate-900/50 border border-slate-800 hover:bg-slate-800'
            }`}>
               {/* Latest Badge */}
               {isLatest && (
                 <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl z-20 shadow-lg">
                   NEW
                 </div>
               )}

               <div className="flex flex-col md:flex-row">
                 {/* Image Section */}
                 <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
                    <img src={winner.coverUrl} alt={winner.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
                    <div className="absolute bottom-3 left-3 md:top-3 md:left-3 w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white font-bold text-sm border border-white/20">
                      #{winners.length - idx}
                    </div>
                 </div>

                 {/* Content Section */}
                 <div className="flex-1 p-5 md:p-6 flex flex-col justify-center relative">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                       <div>
                          <div className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-wider">{winner.date}</div>
                          <h3 className="text-2xl font-black text-white mb-1">{winner.title}</h3>
                          <p className="text-lg text-slate-400">{winner.artist}</p>
                       </div>
                       <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-white/5 self-start">
                          <i className="fas fa-vote-yea text-slate-500 text-xs"></i>
                          <span className="text-sm font-bold text-white">{winner.voteCount}</span>
                       </div>
                    </div>

                    <div className="relative">
                      <i className="fas fa-quote-left absolute -top-2 -left-1 text-white/10 text-xl"></i>
                      <p className="text-slate-400 text-sm leading-relaxed pl-6 italic relative z-10">
                        {winner.vibeDescription || "The community has spoken. A certified banger."}
                      </p>
                    </div>
                 </div>
               </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;