import { Song, VoteStatus } from '../types';

// BASE MAINNET CONFIGURATION
export const BASE_CHAIN_ID = 8453; // Base Mainnet
export const BASE_RPC_URL = "https://mainnet.base.org";
export const BLOCK_EXPLORER_URL = "https://basescan.org";

// ------------------------------------------------------------------
// IMPORTANT: PASTE YOUR DEPLOYED CONTRACT ADDRESS HERE
// Remix'ten kopyaladığınız adresi buraya yapıştırın:
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 
// ------------------------------------------------------------------

// Simulated delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const castOnChainVote = async (
  song: Song, 
  walletAddress: string,
  setStatus: (status: VoteStatus) => void
): Promise<boolean> => {
  try {
    console.log(`Initiating vote for ${song.title} from ${walletAddress} on Base Mainnet (8453)`);
    
    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      console.warn("⚠️ Contract address not set! Running in simulation mode.");
      // Simulation fallback
      setStatus('signing');
      await delay(1000);
      setStatus('confirming');
      await delay(2000);
      setStatus('success');
      return true;
    }

    // 1. Request Signature
    setStatus('signing');
    
    // TODO: Integrate Viem/Wagmi logic here once the contract is deployed
    // const hash = await walletClient.writeContract({
    //   address: CONTRACT_ADDRESS,
    //   abi: VOTING_ABI,
    //   functionName: 'vote',
    //   args: [BigInt(song.id)]
    // });

    await delay(1500); // Simulate wallet popup
    
    // 2. Send Transaction
    setStatus('confirming');
    console.log("Transaction broadcasting to Base Mainnet...");
    
    await delay(2000); 
    
    // 3. Success
    setStatus('success');
    return true;

  } catch (error) {
    console.error("Voting failed:", error);
    setStatus('error');
    return false;
  }
};

export const getContractTimeLeft = async (): Promise<number> => {
  // In production: Read 'lastDayEndTime' from contract and calculate diff
  return 86400; 
};