import React, { useState, useEffect } from 'react';
import { Song, DailyWinner } from '../types';
import { searchRealTracks } from '../services/musicService';

interface VoteListProps {
  songs: Song[];
  onVote: (song: Song) => void;
  isWalletConnected: boolean;
  secondsLeft?: number;
  playingSongId: string | null;
  onTogglePlay: (song: Song) => void;
  pastWinners?: DailyWinner[];
  onConnectWallet: () => void;
}

const VoteList: React.FC<VoteListProps> = ({ 
  songs, 
  onVote, 
  isWalletConnected, 
  secondsLeft = 0,
  playingSongId,
  onTogglePlay,
  pastWinners = [],
  onConnectWallet
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchRealTracks(searchTerm);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const displayList = searchTerm.trim().length >= 2 ? searchResults : songs;

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Timer */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
           <h2 className="text-3xl font-black text-white mb-2">
             {searchTerm ? 'Search Results' : 'Vote Now'}
           </h2>
           {!searchTerm && <p className="text-slate-400">Search for a song or vote for the daily candidates.</p>}
        </div>

        {/* Timer (Only show if not searching) */}
        {!searchTerm && (
          <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-slate-400 text-sm font-medium">Round Ends In:</span>
              <span className={`font-mono font-bold text-lg ${secondsLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(secondsLeft)}
              </span>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <i className={`fas ${isSearching ? 'fa-spinner fa-spin text-blue-400' : 'fa-search text-slate-500 group-focus-within:text-blue-400'} transition-colors`}></i>
        </div>
        <input
          type="text"
          placeholder="Search for a song to nominate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-800 text-white rounded-2xl pl-12 pr-12 py-5 text-lg focus:outline-none focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-slate-600 shadow-lg"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-5 text-slate-500 hover:text-white"
          >
            <i className="fas fa-times-circle text-xl"></i>
          </button>
        )}
      </div>

      {/* Sub-header for Candidates */}
      {!searchTerm && displayList.length > 0 && (
        <div className="flex items-center gap-4 py-2">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Top Candidates</span>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-2">
        {displayList.length === 0 && searchTerm && !isSearching && (
           <div className="text-center py-12 text-slate-500 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
             <i className="fas fa-music text-4xl mb-4 opacity-20"></i>
             <p>No songs found. Try a different search.</p>
           </div>
        )}

        {displayList.map((song, index) => {
          const existingSong = songs.find(s => s.id === song.id);
          const voteCount = existingSong ? existingSong.voteCount : song.voteCount;
          const rank = existingSong ? songs.indexOf(existingSong) + 1 : null;
          const isPlaying = playingSongId === song.id;

          const isPastWinner = pastWinners.some(w => w.title === song.title && w.artist === song.artist);
          const wonDate = isPastWinner ? pastWinners.find(w => w.title === song.title && w.artist === song.artist)?.date : '';

          return (
            <div 
              key={song.id} 
              className={`group relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 ${
                isPastWinner 
                  ? 'bg-amber-900/5 border border-amber-500/10 opacity-70 hover:opacity-100'
                  : isPlaying 
                    ? 'bg-blue-600/10 border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.1)]' 
                    : 'bg-slate-800/30 hover:bg-slate-800 border border-transparent hover:border-slate-700'
              }`}
            >
              {isPastWinner ? (
                <div className="w-10 text-center">
                  <i className="fas fa-trophy text-amber-500 text-lg drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"></i>
                </div>
              ) : rank && !searchTerm ? (
                 <div className={`w-10 text-center font-black text-xl ${rank <= 3 ? 'text-white' : 'text-slate-600'}`}>#{rank}</div>
              ) : (
                <div className="w-10"></div>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => onTogglePlay(song)}
                  className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center transition-all overflow-hidden group/btn ${isPlaying ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' : ''}`}
                >
                  <img src={song.coverUrl} alt={song.title} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-110' : 'group-hover/btn:scale-110'}`} />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover/btn:opacity-100'}`}>
                     <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-lg`}></i>
                  </div>
                </button>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={`font-bold text-lg truncate ${isPastWinner ? 'text-amber-200' : isPlaying ? 'text-blue-400' : 'text-white'}`}>{song.title}</h3>
                  {isPastWinner && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      HALL OF FAME
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 font-medium truncate">{song.artist}</p>
              </div>

              <div className="text-right px-2 hidden sm:block">
                 <div className="text-lg font-black text-white">{voteCount}</div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase">votes</div>
              </div>

              <div className="pl-2">
              {isPastWinner ? (
                 <div className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-950/30 text-amber-500 border border-amber-900/50 flex items-center gap-2">
                   <i className="fas fa-check-circle"></i>
                   <span>Won {wonDate?.split(',')[0]}</span>
                 </div>
              ) : (
                <button 
                  onClick={() => onVote(song)}
                  disabled={!isWalletConnected}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${
                    isWalletConnected 
                    ? 'bg-white text-slate-900 hover:bg-blue-50 hover:shadow-blue-500/20' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {searchTerm ? 'Nominate' : 'Vote'}
                </button>
              )}
              </div>
            </div>
          );
        })}
      </div>
      
      {!isWalletConnected && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 text-center backdrop-blur-sm">
          <p className="text-blue-200 text-sm font-medium mb-3">Connect your wallet to participate in the future of music on Base.</p>
          <button onClick={onConnectWallet} className="text-white underline text-sm hover:text-blue-400">Connect Wallet</button>
        </div>
      )}
    </div>
  );
};

export default VoteList;