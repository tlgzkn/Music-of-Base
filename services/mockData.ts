import { Song, DailyWinner } from '../types';

export const INITIAL_SONGS: Song[] = [
  {
    id: '1',
    title: 'Based Harmony',
    artist: 'Crypto Beats',
    coverUrl: 'https://picsum.photos/id/10/300/300',
    voteCount: 1240
  },
  {
    id: '2',
    title: 'Blue Chain Symphony',
    artist: 'The Nodes',
    coverUrl: 'https://picsum.photos/id/20/300/300',
    voteCount: 980
  },
  {
    id: '3',
    title: 'Gas Fees Low',
    artist: 'L2 Legends',
    coverUrl: 'https://picsum.photos/id/30/300/300',
    voteCount: 850
  },
  {
    id: '4',
    title: 'Mint Condition',
    artist: 'NFT Soul',
    coverUrl: 'https://picsum.photos/id/40/300/300',
    voteCount: 720
  },
  {
    id: '5',
    title: 'Smart Contract Love',
    artist: 'Dev Rel',
    coverUrl: 'https://picsum.photos/id/50/300/300',
    voteCount: 650
  },
  {
    id: '6',
    title: 'Decentralized Dreams',
    artist: 'Web3 Warriors',
    coverUrl: 'https://picsum.photos/id/60/300/300',
    voteCount: 430
  },
  {
    id: '7',
    title: 'Onchain Summer',
    artist: 'Base Camp',
    coverUrl: 'https://picsum.photos/id/70/300/300',
    voteCount: 390
  },
  {
    id: '8',
    title: 'Tokenomics',
    artist: 'Eco System',
    coverUrl: 'https://picsum.photos/id/80/300/300',
    voteCount: 310
  },
  {
    id: '9',
    title: 'Future Finance',
    artist: 'DeFi Dudes',
    coverUrl: 'https://picsum.photos/id/90/300/300',
    voteCount: 200
  },
  {
    id: '10',
    title: 'Midnight Stake',
    artist: 'Validator Vibe',
    coverUrl: 'https://picsum.photos/id/100/300/300',
    voteCount: 150
  }
];

export const PAST_WINNERS: DailyWinner[] = [
  {
    id: '101',
    title: 'Yesterday\'s Echo',
    artist: 'Retro Base',
    coverUrl: 'https://picsum.photos/id/101/300/300',
    voteCount: 2500,
    date: 'Oct 25, 2023',
    vibeDescription: 'A nostalgic synth-wave track that resonates with the early days of the chain.'
  },
  {
    id: '102',
    title: 'Build It',
    artist: 'Based Builders',
    coverUrl: 'https://picsum.photos/id/102/300/300',
    voteCount: 2100,
    date: 'Oct 24, 2023',
    vibeDescription: 'High energy electronic beats perfect for a coding sprint.'
  }
];
