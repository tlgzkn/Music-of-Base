
import React from 'react';
import { Song } from '../types';

interface VoteListProps {
  songs: Song[];
  onVote: (song: Song) => void;
  isWalletConnected: boolean;
  secondsLeft?: number; // Optional to keep compatible if needed, but we will use it
}

const VoteList: React.FC<VoteListProps> = ({ songs, onVote, isWalletConnected, secondsLeft = 0 }) => {
  
  // Helper to format seconds into HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Top 10 Candidates</h2>
        <div className="flex items-center gap-2 text-sm font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Ends in:</span>
            <span className={`font-bold ${secondsLeft < 60 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                {formatTime(secondsLeft)}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {songs.map((song, index) => (
          <div 
            key={song.id} 
            className="group relative flex items-center gap-4 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all"
          >
            <div className="w-8 text-center font-bold text-slate-500 text-lg">#{index + 1}</div>
            
            <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate">{song.title}</h3>
              <p className="text-sm text-slate-400 truncate">{song.artist}</p>
            </div>

            <div className="text-right mr-2">
               <div className="text-sm font-bold text-slate-300">{song.voteCount}</div>
               <div className="text-xs text-slate-500">votes</div>
            </div>

            <button 
              onClick={() => onVote(song)}
              disabled={!isWalletConnected}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                isWalletConnected 
                ? 'bg-slate-700 group-hover:bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              Vote
            </button>
          </div>
        ))}
      </div>
      
      {!isWalletConnected && (
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-900 rounded-xl text-center text-blue-200 text-sm">
          <i className="fas fa-wallet mr-2"></i>
          Connect your wallet to cast your vote on chain!
        </div>
      )}
    </div>
  );
};

export default VoteList;
