/**
 * Saavn API Service
 * Handles all API calls to Saavn endpoints with proper error handling
 */

import { API_ENDPOINTS, DEFAULT_ERROR_MESSAGE } from './constants';
import { transformPlaylistSong, transformSearchSong } from './songTransformers';

/**
 * Fetch songs from a playlist URL
 * @param {string} playlistUrl - JioSaavn playlist URL
 * @returns {Promise<Array>} Array of standardized song objects
 */
export const fetchPlaylistSongs = async (playlistUrl) => {
  if (!playlistUrl) {
    throw new Error('Playlist URL is required');
  }

  try {
    const response = await fetch(
      `${API_ENDPOINTS.SAAVN_PLAYLIST}?query=${encodeURIComponent(playlistUrl)}`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || !data.songs || !Array.isArray(data.songs)) {
      return [];
    }

    // Transform and filter songs
    const transformedSongs = data.songs
      .map(transformPlaylistSong)
      .filter(song => song !== null && song.url);

    return transformedSongs;
  } catch (error) {
    console.error('Error fetching playlist songs:', error);
    throw new Error(error.message || DEFAULT_ERROR_MESSAGE);
  }
};

/**
 * Search for songs by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of standardized song objects
 */
export const searchSongs = async (query) => {
  if (!query || !query.trim()) {
    throw new Error('Search query is required');
  }

  try {
    const response = await fetch(
      `${API_ENDPOINTS.SAAVN_SEARCH}?query=${encodeURIComponent(query.trim())}`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || !data.data || !data.data.results || !Array.isArray(data.data.results)) {
      return [];
    }

    // Transform and filter songs
    const transformedSongs = data.data.results
      .map(transformSearchSong)
      .filter(song => song !== null && song.url);

    return transformedSongs;
  } catch (error) {
    console.error('Error searching songs:', error);
    throw new Error(error.message || DEFAULT_ERROR_MESSAGE);
  }
};

