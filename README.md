# Music of Base 🎵

Music of Base is a decentralized, community-curated daily music selection app built on the Base L2 blockchain.

## Features

- **Daily Voting:** Users vote for their favorite tracks on-chain.
- **AI Powered:** Google Gemini generates vibe checks and daily trivia.
- **Farcaster Frame:** Fully compatible as a Farcaster Mini App (Frames v2).
- **Responsive Design:** Works seamlessly on mobile and desktop.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Blockchain:** Base (Ethereum L2)
- **AI:** Google Gemini API (@google/genai)
- **Integration:** Farcaster Frame SDK

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Google API Key:
   ```
   VITE_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

Deployed on Vercel. Ensure you set the `API_KEY` environment variable in your Vercel project settings.
