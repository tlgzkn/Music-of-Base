// Removed reference to vite/client as it was causing type definition errors in the environment
// /// <reference types="vite/client" />

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// Augment NodeJS namespace to ensure API_KEY is typed if node types are present
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_CLIENT_SECRET: string;
    SPOTIFY_PLAYLIST_ID: string;
    SPOTIFY_REFRESH_TOKEN: string;
    YOUTUBE_CLIENT_ID: string;
    YOUTUBE_CLIENT_SECRET: string;
    YOUTUBE_REFRESH_TOKEN: string;
    YOUTUBE_PLAYLIST_ID: string;
    [key: string]: string | undefined;
  }
}

// Ensure ImportMetaEnv includes our custom envs
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  // Fallback VITE_ prefixed vars if used directly
  readonly VITE_SPOTIFY_CLIENT_ID: string;
  readonly VITE_SPOTIFY_PLAYLIST_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  okxwallet?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  };
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on?: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener?: (eventName: string, callback: (...args: any[]) => void) => void;
  };
  process?: {
    env: Record<string, string>;
  };
}