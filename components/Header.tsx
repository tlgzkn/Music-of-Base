import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  isWalletConnected: boolean;
  isConnecting: boolean;
  walletAddress: string | null;
  username?: string | null;
  connectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  setCurrentView, 
  isWalletConnected, 
  isConnecting, 
  walletAddress, 
  username, 
  connectWallet
}) => {
  
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-4xl mx-auto h-16 glass-panel rounded-full flex items-center justify-between px-2 pl-6 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView(AppView.HOME)}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform">
            <i className="fas fa-music text-white text-sm"></i>
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-blue-200 transition-colors">
            Music of Base
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 rounded-full p-1 border border-white/5">
          <button 
            onClick={() => setCurrentView(AppView.HOME)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              currentView === AppView.HOME 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Today's Mix
          </button>
          <button 
             onClick={() => setCurrentView(AppView.PLAYLIST)}
             className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
               currentView === AppView.PLAYLIST 
                 ? 'bg-blue-600 text-white shadow-md' 
                 : 'text-slate-400 hover:text-white hover:bg-white/5'
             }`}
          >
            Playlist
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={connectWallet}
            disabled={isConnecting}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${
              isWalletConnected 
                ? 'bg-slate-800 text-blue-400 border border-blue-500/30' 
                : isConnecting
                  ? 'bg-slate-700 text-slate-300 cursor-wait'
                  : 'bg-white text-slate-900 hover:bg-blue-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            }`}
          >
            {isConnecting ? (
              <span className="flex items-center gap-2">
                <i className="fas fa-spinner fa-spin"></i> <span className="hidden sm:inline">Connecting</span>
              </span>
            ) : isWalletConnected ? (
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {username ? (
                  <>
                    <i className="fas fa-user-astronaut text-xs"></i> @{username}
                  </>
                ) : (
                  formatAddress(walletAddress || '')
                )}
              </span>
            ) : (
              'Connect Wallet'
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl">
         <button 
            onClick={() => setCurrentView(AppView.HOME)}
            className={`flex flex-col items-center gap-1 ${currentView === AppView.HOME ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <i className="fas fa-home text-xl"></i>
          </button>
          <button 
             onClick={() => setCurrentView(AppView.PLAYLIST)}
             className={`flex flex-col items-center gap-1 ${currentView === AppView.PLAYLIST ? 'text-blue-400' : 'text-slate-500'}`}
          >
            <i className="fas fa-list-music text-xl"></i>
          </button>
      </div>
    </header>
  );
};

export default Header;