
import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { searchRealTracks } from '../services/musicService';

interface VoteListProps {
  songs: Song[];
  onVote: (song: Song) => void;
  isWalletConnected: boolean;
  secondsLeft?: number;
  playingSongId: string | null;
  onTogglePlay: (song: Song) => void;
}

const VoteList: React.FC<VoteListProps> = ({ 
  songs, 
  onVote, 
  isWalletConnected, 
  secondsLeft = 0,
  playingSongId,
  onTogglePlay
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
    <div className="space-y-6">
      {/* Header & Timer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white">
             {searchTerm ? 'Search Results' : 'Vote Now'}
           </h2>
           {!searchTerm && <p className="text-slate-400 text-sm">Search for a song or vote for the daily winner.</p>}
        </div>

        {/* Timer (Only show if not searching) */}
        {!searchTerm && (
          <div className="flex items-center gap-2 text-sm font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 self-start">
              <span className="text-slate-400">Ends in:</span>
              <span className={`font-bold ${secondsLeft < 60 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                  {formatTime(secondsLeft)}
              </span>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <i className={`fas ${isSearching ? 'fa-spinner fa-spin text-blue-400' : 'fa-search text-slate-500'}`}></i>
        </div>
        <input
          type="text"
          placeholder="Search for a song (e.g. 'Not Like Us')"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500 shadow-inner"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 text-slate-500 hover:text-white"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* Sub-header for Candidates (Only if not searching) */}
      {!searchTerm && displayList.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Top Candidates</h3>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 gap-3">
        {displayList.length === 0 && searchTerm && !isSearching && (
           <div className="text-center py-8 text-slate-500">
             No songs found. Try a different search.
           </div>
        )}

        {displayList.map((song, index) => {
          // Check if song is already in the main list to show correct vote count
          const existingSong = songs.find(s => s.id === song.id);
          const voteCount = existingSong ? existingSong.voteCount : song.voteCount;
          const rank = existingSong ? songs.indexOf(existingSong) + 1 : null;
          const isPlaying = playingSongId === song.id;

          return (
            <div 
              key={song.id} 
              className={`group relative flex items-center gap-4 p-3 rounded-xl border transition-all ${isPlaying ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/50 hover:border-blue-500/50'}`}
            >
              {rank && !searchTerm ? (
                 <div className="w-8 text-center font-bold text-slate-500 text-lg">#{rank}</div>
              ) : (
                <div className="w-8"></div>
              )}
              
              <button 
                onClick={() => onTogglePlay(song)}
                className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'}`}
              >
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs ${isPlaying ? '' : 'ml-0.5'}`}></i>
              </button>

              <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold truncate ${isPlaying ? 'text-blue-400' : 'text-white'}`}>{song.title}</h3>
                <p className="text-sm text-slate-400 truncate">{song.artist}</p>
              </div>

              <div className="text-right mr-2">
                 <div className="text-sm font-bold text-slate-300">{voteCount}</div>
                 <div className="text-xs text-slate-500">votes</div>
              </div>

              <button 
                onClick={() => onVote(song)}
                disabled={!isWalletConnected}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                  isWalletConnected 
                  ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-900' 
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                {searchTerm ? 'Nominate' : 'Vote'}
              </button>
            </div>
          );
        })}
      </div>
      
      {!isWalletConnected && (
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-900 rounded-xl text-center text-blue-200 text-sm">
          <i className="fas fa-wallet mr-2"></i>
          Connect your wallet to nominate and vote!
        </div>
      )}
    </div>
  );
};

export default VoteList;
