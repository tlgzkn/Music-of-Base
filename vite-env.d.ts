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
    [key: string]: string | undefined;
  }
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