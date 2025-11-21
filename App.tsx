
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
  const [username, setUsername] = useState<string | null>(null); // Farcaster username
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>('idle');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [dailyTrivia, setDailyTrivia] = useState<string>('');
  
  // Farcaster State
  const [sdkContext, setSdkContext] = useState<any>(null);
  
  // Playlist State
  const [pastWinners, setPastWinners] = useState<DailyWinner[]>(PAST_WINNERS);
  const [isProcessingEnd, setIsProcessingEnd] = useState(false);

  // Timer State - Initial demo: 15 seconds, then resets to 24 hours
  const [secondsLeft, setSecondsLeft] = useState(15);

  // Initialize Farcaster SDK
  useEffect(() => {
    const initSDK = async () => {
      try {
        // Attempt to initialize SDK
        if (sdk && sdk.actions) {
          const context = await sdk.context;
          setSdkContext(context);
          
          // Auto-extract username if available but don't set connected status yet
          if (context?.user?.username) {
             setUsername(context.user.username);
          }

          await sdk.actions.ready();
          console.log("Farcaster SDK Ready. Context:", context);
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
      setUsername(null);
      // If we are in Farcaster, keep the username for display but show as disconnected
      if (sdkContext?.user?.username) {
         setUsername(sdkContext.user.username);
      }
      return;
    }

    setIsConnecting(true);

    try {
      // 1. Attempt Real Wallet Connection (Force Popup)
      // @ts-ignore
      const provider = window.okxwallet || window.ethereum;

      if (provider) {
        console.log("Found provider, requesting accounts...");
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        
        if (accounts && accounts.length > 0) {
          console.log("Wallet Connected:", accounts[0]);
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
          
          // If we are in Farcaster context, ensure username is set
          if (sdkContext?.user?.username) {
            setUsername(sdkContext.user.username);
          }
          
          setIsConnecting(false);
          return;
        }
      }

      // If we are here, provider exists but returned no accounts, or provider doesn't exist.
      // BUT if we are in Farcaster Frame, we might not have a standard provider but still have a context address.
      // This is a fallback for "Read-Only" connection if the active connection failed.
      if (sdkContext?.user) {
        let farcasterAddress = sdkContext.user.verifiedAddresses?.[0] || sdkContext.user.custodyAddress;
        if (farcasterAddress) {
             console.log("Active connection failed, falling back to Farcaster Context Address");
             setWalletAddress(farcasterAddress);
             if (sdkContext.user.username) setUsername(sdkContext.user.username);
             setIsWalletConnected(true);
             setIsConnecting(false);
             return;
        }
      }

      throw new Error("No wallet provider found");

    } catch (error) {
      console.warn("Wallet connection error, switching to Demo Mode:", error);
      
      // 3. FALLBACK: Demo Mode (Fail-Safe)
      // Always ensure the user feels "connected" to try the app
      setWalletAddress("0x71C...9A21");
      
      // Even in demo mode, if we know the Farcaster username, show it
      if (sdkContext?.user?.username) {
         setUsername(sdkContext.user.username);
      }
      
      setIsWalletConnected(true);
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
        username={username}
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
