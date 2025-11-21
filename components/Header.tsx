
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  isWalletConnected: boolean;
  isConnecting: boolean;
  walletAddress: string | null;
  connectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, isWalletConnected, isConnecting, walletAddress, connectWallet }) => {
  
  // Helper to format address (e.g. 0x1234...5678)
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView(AppView.HOME)}>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="fas fa-music text-white text-sm"></i>
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            Music of Base
          </span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
          <button 
            onClick={() => setCurrentView(AppView.HOME)}
            className={`hover:text-blue-400 transition-colors ${currentView === AppView.HOME ? 'text-blue-400' : ''}`}
          >
            Today's Mix
          </button>
          <button 
             onClick={() => setCurrentView(AppView.VOTE)}
             className={`hover:text-blue-400 transition-colors ${currentView === AppView.VOTE ? 'text-blue-400' : ''}`}
          >
            Vote Now
          </button>
          <button 
             onClick={() => setCurrentView(AppView.PLAYLIST)}
             className={`hover:text-blue-400 transition-colors ${currentView === AppView.PLAYLIST ? 'text-blue-400' : ''}`}
          >
            Playlist
          </button>
        </nav>

        <button 
          type="button"
          onClick={connectWallet}
          disabled={isConnecting}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 ${
            isWalletConnected 
              ? 'bg-slate-800 text-blue-400 border border-blue-900' 
              : isConnecting
                ? 'bg-slate-700 text-slate-300 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
          }`}
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <i className="fas fa-spinner fa-spin"></i> Connecting...
            </span>
          ) : isWalletConnected && walletAddress ? (
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {formatAddress(walletAddress)}
            </span>
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex justify-around border-t border-slate-800 py-2 bg-slate-900">
         <button 
            onClick={() => setCurrentView(AppView.HOME)}
            className={`p-2 flex flex-col items-center gap-1 ${currentView === AppView.HOME ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <i className="fas fa-home"></i>
            <span className="text-[10px]">Home</span>
          </button>
          <button 
             onClick={() => setCurrentView(AppView.VOTE)}
             className={`p-2 flex flex-col items-center gap-1 ${currentView === AppView.VOTE ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <i className="fas fa-vote-yea"></i>
            <span className="text-[10px]">Vote</span>
          </button>
          <button 
             onClick={() => setCurrentView(AppView.PLAYLIST)}
             className={`p-2 flex flex-col items-center gap-1 ${currentView === AppView.PLAYLIST ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <i className="fas fa-list-music"></i>
            <span className="text-[10px]">Lists</span>
          </button>
      </div>
    </header>
  );
};

export default Header;
