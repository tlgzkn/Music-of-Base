
import React, { useState, useEffect, useCallback } from 'react';
import sdk from '@farcaster/frame-sdk';
import Header from './components/Header';
import DailyWinnerHero from './components/DailyWinnerHero';
import VoteList from './components/VoteList';
import TransactionModal from './components/TransactionModal';
import PlaylistView from './components/PlaylistView';
import { PAST_WINNERS } from './services/mockData';
import { Song, AppView, VoteStatus, DailyWinner } from './types';
import { generateDailyTrivia, generateVibeDescription } from './services/geminiService';
import { castOnChainVote } from './services/web3Service';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null); // Farcaster username
  
  // Start with empty or minimal list, users will fill it by searching
  const [songs, setSongs] = useState<Song[]>([
     {
        id: '1440651615',
        title: 'Not Like Us',
        artist: 'Kendrick Lamar',
        coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/38/79/e0/3879e025-da15-5698-1d89-190c81343008/24UMGIM47526.rgb.jpg/600x600bb.jpg',
        voteCount: 420
     },
     {
        id: '1712593365',
        title: 'Espresso',
        artist: 'Sabrina Carpenter',
        coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/0b/20/56/0b20565d-3b1b-2162-6c1a-5c725497f27e/24UMGIM27615.rgb.jpg/600x600bb.jpg',
        voteCount: 310
     }
  ]);

  const [voteStatus, setVoteStatus] = useState<VoteStatus>('idle');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [dailyTrivia, setDailyTrivia] = useState<string>('');
  
  // Farcaster State
  const [sdkContext, setSdkContext] = useState<any>(null);
  
  // Playlist State
  const [pastWinners, setPastWinners] = useState<DailyWinner[]>(PAST_WINNERS);
  const [isProcessingEnd, setIsProcessingEnd] = useState(false);

  // Timer State
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
      if (sdkContext?.user?.username) {
         setUsername(sdkContext.user.username);
      }
      return;
    }

    setIsConnecting(true);

    // Wait function to handle injection delay
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      // Always force popup by default for better UX inside Frame
      // Check for providers with a small delay for injection
      if (!window.ethereum && !window.okxwallet) {
         await wait(500);
      }

      // @ts-ignore
      const provider = window.okxwallet || window.ethereum;

      if (provider) {
        console.log("Found provider, requesting accounts...");
        // Force request to trigger popup
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        
        if (accounts && accounts.length > 0) {
          console.log("Wallet Connected:", accounts[0]);
          setWalletAddress(accounts[0]);
          
          // Match Farcaster username if available
          if (sdkContext?.user?.username) {
            setUsername(sdkContext.user.username);
          }
          
          setIsWalletConnected(true);
          return; // Success exit
        }
      }

      // If real wallet fails or doesn't exist, throw to trigger demo mode
      throw new Error("No active wallet found");

    } catch (error) {
      alert("Wallet connection failed or rejected. Switching to Demo Mode for preview.");
      console.warn("Wallet connection failed, switching to Demo Mode:", error);
      
      // FAIL-SAFE: Switch to Demo Mode immediately
      setWalletAddress("0x71C...9A21");
      if (sdkContext?.user?.username) {
         setUsername(sdkContext.user.username);
      }
      setIsWalletConnected(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleVote = async (song: Song) => {
    if (!isWalletConnected) {
      handleConnectWallet();
      return;
    }
    
    // Use Web3 Service
    setSelectedSong(song);
    
    const success = await castOnChainVote(
      song, 
      walletAddress || "0x00", 
      setVoteStatus
    );

    if (success) {
      // Check if song exists in our local list
      setSongs(prev => {
        const exists = prev.find(s => s.id === song.id);
        if (exists) {
           // If exists, increment vote
           return prev.map(s => s.id === song.id ? { ...s, voteCount: s.voteCount + 1 } : s);
        } else {
           // If new (from search), add to list with 1 vote
           return [...prev, { ...song, voteCount: 1 }];
        }
      });
      
      // Clear search in VoteList (handled by UI re-render with updated songs list)
      
      // Auto close modal after success
      setTimeout(() => {
        closeVoteModal();
      }, 2000);
    }
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
        const winner = sortedSongs[0];
        if (!winner) {
             setIsProcessingEnd(false);
             return;
        }

        console.log("Ending day. Winner:", winner.title);
        
        const vibe = await generateVibeDescription(winner);
        
        const newWinnerRecord: DailyWinner = {
          ...winner,
          id: `${winner.id}-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          vibeDescription: vibe
        };

        setPastWinners(prev => [newWinnerRecord, ...prev]);

        // Reset votes for next day but keep popular songs? 
        // Or clear list? Let's keep list but reset votes to 0
        setSongs(prev => prev.map(s => ({
          ...s,
          voteCount: 0
        })));

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
          endDayLogic();
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
            <DailyWinnerHero song={dailyWinner || songs[0]} />
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

      {/* End Day Loading Overlay */}
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
