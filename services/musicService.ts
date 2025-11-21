
import { Song } from '../types';

// iTunes Search API (Free, no key required)
const ITUNES_API_URL = 'https://itunes.apple.com/search';

export const searchRealTracks = async (term: string): Promise<Song[]> => {
  if (!term || term.trim().length < 2) return [];

  try {
    const response = await fetch(`${ITUNES_API_URL}?term=${encodeURIComponent(term)}&media=music&entity=song&limit=10`);
    const data = await response.json();

    if (!data.results) return [];

    return data.results.map((track: any) => ({
      id: track.trackId.toString(),
      title: track.trackName,
      artist: track.artistName,
      coverUrl: track.artworkUrl100.replace('100x100', '600x600'), // Get higher res image
      voteCount: 0, // Initial vote count for new searches
      previewUrl: track.previewUrl
    }));
  } catch (error) {
    console.error("Error fetching songs from iTunes:", error);
    return [];
  }
};
