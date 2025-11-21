
import { Song } from '../types';

// Read variables from process.env (injected via vite.config.ts)
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || ''; 
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const PLAYLIST_ID = process.env.SPOTIFY_PLAYLIST_ID || '';
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN || '';

const REDIRECT_URI = window.location.origin; 

// Scopes required for playlist modification
const SCOPES = [
  'playlist-modify-public',
  'playlist-modify-private'
];

/**
 * Exchanges the stored Refresh Token for a new Access Token.
 * This allows the app to work automatically in the background without user interaction.
 */
const refreshAccessToken = async (): Promise<string | null> => {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.warn("Missing Spotify credentials for auto-refresh.");
    return null;
  }

  try {
    const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN
      })
    });

    const data = await response.json();
    
    if (data.access_token) {
      console.log("Spotify Access Token refreshed successfully.");
      localStorage.setItem('spotify_access_token', data.access_token);
      // data.expires_in is usually 3600 seconds
      const expiryTime = Date.now() + (data.expires_in * 1000);
      localStorage.setItem('spotify_token_expiry', expiryTime.toString());
      return data.access_token;
    } else {
      console.error("Failed to refresh Spotify token:", data);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing Spotify token:", error);
    return null;
  }
};

/**
 * Gets a valid access token. 
 * 1. Checks LocalStorage.
 * 2. If expired but REFRESH_TOKEN exists, auto-refreshes.
 * 3. Returns null if manual login is needed.
 */
const getAccessToken = async (): Promise<string | null> => {
  const token = localStorage.getItem('spotify_access_token');
  const expiry = localStorage.getItem('spotify_token_expiry');
  
  // If we have a valid token in storage, use it
  if (token && expiry && Date.now() < parseInt(expiry)) {
    return token;
  }

  // If token is expired or missing, but we have a Refresh Token configured in env
  if (REFRESH_TOKEN) {
    return await refreshAccessToken();
  }

  return null;
};

// --- Manual Auth Flow (Fallback) ---
export const authenticateSpotify = () => {
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('response_type', 'token');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('scope', SCOPES.join(' '));
  authUrl.searchParams.append('show_dialog', 'true');

  window.location.href = authUrl.toString();
};

export const handleSpotifyCallback = () => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in');
    
    if (token && expiresIn) {
      localStorage.setItem('spotify_access_token', token);
      localStorage.setItem('spotify_token_expiry', (Date.now() + parseInt(expiresIn) * 1000).toString());
      window.location.hash = '';
      return true;
    }
  }
  return false;
};

// --- API Interactions ---

export const searchSpotifyTrack = async (title: string, artist: string): Promise<string | null> => {
  const token = await getAccessToken();
  if (!token) {
    console.warn("Spotify token missing. Cannot search track.");
    return null;
  }

  try {
    // Clean search query to improve hit rate
    const cleanTitle = title.replace(/\(.*\)/, '').trim(); // Remove features/remix text
    const query = encodeURIComponent(`track:${cleanTitle} artist:${artist}`);
    
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.tracks && data.tracks.items.length > 0) {
      return data.tracks.items[0].uri; // Returns 'spotify:track:...'
    }
    return null;
  } catch (error) {
    console.error("Spotify search error:", error);
    return null;
  }
};

export const addTrackToPlaylist = async (trackUri: string): Promise<boolean> => {
  const token = await getAccessToken();
  if (!token) {
      console.error("Cannot add track: No Access Token available.");
      return false;
  }
  
  if (!PLAYLIST_ID) {
      console.error("Cannot add track: PLAYLIST_ID not configured.");
      return false;
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: [trackUri]
      })
    });

    if (response.ok) {
        console.log("Track added to Spotify playlist successfully!");
        return true;
    } else {
        const err = await response.json();
        console.error("Failed to add to Spotify:", err);
        return false;
    }
  } catch (error) {
    console.error("Error adding to Spotify playlist:", error);
    return false;
  }
};
