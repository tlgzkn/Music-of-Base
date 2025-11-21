import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    publicDir: 'public',
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.SPOTIFY_CLIENT_ID': JSON.stringify(env.SPOTIFY_CLIENT_ID),
      'process.env.SPOTIFY_CLIENT_SECRET': JSON.stringify(env.SPOTIFY_CLIENT_SECRET),
      'process.env.SPOTIFY_PLAYLIST_ID': JSON.stringify(env.SPOTIFY_PLAYLIST_ID),
      'process.env.SPOTIFY_REFRESH_TOKEN': JSON.stringify(env.SPOTIFY_REFRESH_TOKEN),
      'process.env.YOUTUBE_CLIENT_ID': JSON.stringify(env.YOUTUBE_CLIENT_ID),
      'process.env.YOUTUBE_CLIENT_SECRET': JSON.stringify(env.YOUTUBE_CLIENT_SECRET),
      'process.env.YOUTUBE_REFRESH_TOKEN': JSON.stringify(env.YOUTUBE_REFRESH_TOKEN),
      'process.env.YOUTUBE_PLAYLIST_ID': JSON.stringify(env.YOUTUBE_PLAYLIST_ID),
      'global': 'globalThis',
    }
  }
})