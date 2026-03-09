/**
 * Songs API Service
 * High-level API functions for fetching songs by playlist name and searching
 */

import { allPlaylists } from "./playlistData";
import { fetchPlaylistSongs, searchSongs as searchSongsAPI } from "../api/saavnAPI";

/**
 * Fetch songs by playlist name (mood)
 * @param {string} playlistName - Name of the playlist from playlistData
 * @returns {Promise<Array>} Array of standardized song objects
 */
export const fetchSongsByPlaylist = async (playlistName) => {
  if (!playlistName) {
    return [];
  }

  const playlist = allPlaylists.find((p) => p.name === playlistName);
  if (!playlist || !playlist.url) {
    console.warn(`Playlist "${playlistName}" not found`);
    return [];
  }

  try {
    return await fetchPlaylistSongs(playlist.url);
  } catch (error) {
    console.error(`Error fetching songs for playlist "${playlistName}":`, error);
    return [];
  }
};

/**
 * Search for songs by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of standardized song objects
 */
export const searchSongs = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }

  try {
    return await searchSongsAPI(query);
  } catch (error) {
    console.error("Error searching songs:", error);
    return [];
  }
};

