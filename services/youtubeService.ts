// Read variables from process.env
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || '';
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN || '';
const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID || '';

/**
 * Refreshes the Google OAuth Access Token using the stored Refresh Token.
 */
const refreshAccessToken = async (): Promise<string | null> => {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.warn("Missing YouTube credentials for auto-refresh.");
    return null;
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    });

    const data = await response.json();

    if (data.access_token) {
      console.log("YouTube Access Token refreshed successfully.");
      localStorage.setItem('youtube_access_token', data.access_token);
      // data.expires_in is seconds
      const expiryTime = Date.now() + (data.expires_in * 1000);
      localStorage.setItem('youtube_token_expiry', expiryTime.toString());
      return data.access_token;
    } else {
      console.error("Failed to refresh YouTube token:", data);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing YouTube token:", error);
    return null;
  }
};

const getAccessToken = async (): Promise<string | null> => {
  const token = localStorage.getItem('youtube_access_token');
  const expiry = localStorage.getItem('youtube_token_expiry');

  if (token && expiry && Date.now() < parseInt(expiry)) {
    return token;
  }

  if (REFRESH_TOKEN) {
    return await refreshAccessToken();
  }

  return null;
};

/**
 * Searches for a video on YouTube.
 */
export const searchVideo = async (title: string, artist: string): Promise<string | null> => {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const query = encodeURIComponent(`${title} ${artist} official audio`);
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error("YouTube search error:", error);
    return null;
  }
};

/**
 * Adds a video to the configured playlist.
 */
export const addVideoToPlaylist = async (videoId: string): Promise<boolean> => {
  const token = await getAccessToken();
  if (!token || !PLAYLIST_ID) return false;

  try {
    const response = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        snippet: {
          playlistId: PLAYLIST_ID,
          resourceId: {
            kind: 'youtube#video',
            videoId: videoId
          }
        }
      })
    });

    if (response.ok) {
      console.log("Track added to YouTube playlist successfully!");
      return true;
    } else {
      const err = await response.json();
      console.error("Failed to add to YouTube:", err);
      return false;
    }
  } catch (error) {
    console.error("Error adding to YouTube playlist:", error);
    return false;
  }
};
