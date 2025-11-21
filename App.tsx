
import React, { useState, useEffect, useCallback } from 'react';
import sdk from '@farcaster/frame-sdk';
import Header from './components/Header';
import DailyWinnerHero from './components/DailyWinnerHero';
import VoteList from './components/VoteList';
import TransactionModal from './components/TransactionModal';
import PlaylistView from './components/PlaylistView';
import { INITIAL_SONGS, PAST_WINNERS } from './services/mockData';
import { Song, AppView, VoteStatus, DailyWinner } from './types';
import { generateDailyTrivia, generateVibeDescription } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>('idle');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [dailyTrivia, setDailyTrivia] = useState<string>('');
  
  // Playlist State
  const [pastWinners, setPastWinners] = useState<DailyWinner[]>(PAST_WINNERS);
  const [isProcessingEnd, setIsProcessingEnd] = useState(false);

  // Timer State - Initial demo: 15 seconds, then resets to 24 hours
  const [secondsLeft, setSecondsLeft] = useState(15);

  // Initialize Farcaster SDK
  useEffect(() => {
    const initSDK = async () => {
      try {
        // Attempt to initialize SDK, but don't block app if it fails
        if (sdk && sdk.actions) {
          await sdk.actions.ready();
        }
      } catch (err) {
        console.warn("Farcaster SDK init warning:", err);
      }
    };
    initSDK();
  }, []);

  // Fetch trivia on mount
  useEffect(() => {
    let isMounted = true;
    generateDailyTrivia().then(trivia => {
      if (isMounted) setDailyTrivia(trivia);
    });
    return () => { isMounted = false; };
  }, []);

  // Sorting songs for top 10 display
  const sortedSongs = [...songs].sort((a, b) => b.voteCount - a.voteCount);
  const dailyWinner = sortedSongs[0]; 

  const handleConnectWallet = async () => {
    if (isWalletConnected) {
      setIsWalletConnected(false);
      setWalletAddress(null);
      return;
    }

    setIsConnecting(true);

    try {
      // Artificial delay for UX
      await new Promise(r => setTimeout(r, 500));

      // Check for OKX Wallet first, then generic Ethereum (MetaMask, etc.)
      // @ts-ignore
      const provider = window.okxwallet || window.ethereum;

      if (!provider) {
        throw new Error("No wallet provider found");
      }

      // Request accounts
      const accounts = await provider.request({ method: 'eth_requestAccounts' });

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      } else {
        throw new Error("User rejected or no accounts");
      }

    } catch (error) {
      console.warn("Wallet connection issue:", error);
      console.info("Switching to Demo Wallet for smooth experience.");
      
      // FAIL-SAFE: Always fall back to demo mode so the user isn't blocked
      // Wait a split second so it feels like a reaction
      setTimeout(() => {
        setWalletAddress("0x71C...9A21");
        setIsWalletConnected(true);
      }, 100);
      
    } finally {
      setIsConnecting(false);
    }
  };

  const handleVote = (song: Song) => {
    if (!isWalletConnected) {
      handleConnectWallet();
      return;
    }
    setSelectedSong(song);
    setVoteStatus('signing');

    // Simulate Blockchain Transaction Lifecycle
    setTimeout(() => {
      setVoteStatus('confirming');
      setTimeout(() => {
        setSongs(prev => prev.map(s => 
          s.id === song.id ? { ...s, voteCount: s.voteCount + 1 } : s
        ));
        setVoteStatus('success');
      }, 2000);
    }, 1500);
  };

  const closeVoteModal = () => {
    setVoteStatus('idle');
    setSelectedSong(null);
  };

  // Logic to end the day
  const endDayLogic = useCallback(async () => {
    if (isProcessingEnd) return;
    setIsProcessingEnd(true);
    
    try {
        // 1. Get the Winner
        const winner = sortedSongs[0];
        console.log("Ending day. Winner:", winner.title);
        
        // 2. Generate AI Vibe Description for History
        const vibe = await generateVibeDescription(winner);
        
        // 3. Create New History Record
        const newWinnerRecord: DailyWinner = {
          ...winner,
          id: `${winner.id}-${Date.now()}`, // Unique ID for history
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          vibeDescription: vibe
        };

        // 4. Update Playlist State
        setPastWinners(prev => [newWinnerRecord, ...prev]);

        // 5. Reset Votes for Next Day (with small random seed)
        setSongs(prev => prev.map(s => ({
          ...s,
          voteCount: Math.floor(Math.random() * 50) + 10
        })));

        // 6. Switch View
        setCurrentView(AppView.PLAYLIST);

      } catch (error) {
        console.error("Error ending day:", error);
      } finally {
        setIsProcessingEnd(false);
      }
  }, [isProcessingEnd, sortedSongs]);

  // Countdown Effect
  useEffect(() => {
    if (isProcessingEnd) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Trigger end of day
          endDayLogic();
          // Reset timer to 24 hours (86400 seconds)
          return 86400; 
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [endDayLogic, isProcessingEnd]);

  return (
    <div className="min-h-screen pb-20 md:pb-0 relative">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isWalletConnected={isWalletConnected}
        isConnecting={isConnecting}
        walletAddress={walletAddress}
        connectWallet={handleConnectWallet}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Trivia Banner */}
        <div className="mb-6 flex items-center justify-center">
           <span className="text-xs text-slate-500 bg-slate-900 border border-slate-800 px-4 py-1 rounded-full flex items-center gap-2">
             <i className="fas fa-robot text-blue-500"></i>
             <span className="font-semibold text-slate-400">Gemini AI:</span> 
             {dailyTrivia || "Loading trivia..."}
           </span>
        </div>

        {currentView === AppView.HOME && (
          <>
            <DailyWinnerHero song={dailyWinner} />
            <VoteList 
              songs={sortedSongs} 
              onVote={handleVote} 
              isWalletConnected={isWalletConnected}
              secondsLeft={secondsLeft}
            />
          </>
        )}

        {currentView === AppView.VOTE && (
           <VoteList 
              songs={sortedSongs} 
              onVote={handleVote} 
              isWalletConnected={isWalletConnected}
              secondsLeft={secondsLeft}
            />
        )}

        {currentView === AppView.PLAYLIST && (
          <PlaylistView winners={pastWinners} />
        )}
      </main>

      {/* Modal handles voting AND automatic processing display */}
      {isProcessingEnd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="text-center animate-pulse">
                <i className="fas fa-compact-disc fa-spin text-6xl text-blue-500 mb-4"></i>
                <h2 className="text-2xl font-bold text-white">Finalizing Day...</h2>
                <p className="text-blue-300">Minting daily winner to playlist history</p>
            </div>
        </div>
      )}

      <TransactionModal 
        song={selectedSong} 
        status={voteStatus} 
        onClose={closeVoteModal} 
      />
    </div>
  );
};

export default App;
