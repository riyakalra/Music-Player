/**
 * Songs API Service
 * High-level API functions for fetching songs by playlist name and searching
 */

import { allPlaylists } from "./playlistData";
import { fetchPlaylistSongs, searchSongs as searchSongsAPI } from "../api/saavnAPI";
import { generateSongRecommendations } from "../api/aiService";

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

/**
 * Generate a magic playlist based on user's mood/genre description
 * Uses AI to generate song recommendations and then searches for them
 * @param {string} userInput - User's description (e.g., "Feeling energetic and want upbeat pop songs")
 * @returns {Promise<Array>} Array of standardized song objects
 */
export const generateMagicPlaylist = async (userInput) => {
  if (!userInput || userInput.trim().length < 10) {
    throw new Error('Please provide at least 10 characters');
  }

  try {
    // Step 1: Get song recommendations from AI
    const songQueries = await generateSongRecommendations(userInput.trim());
    
    if (!songQueries || songQueries.length === 0) {
      throw new Error('No song recommendations generated. Please try a different description.');
    }

    // Step 2: Search for each song and collect results
    const allSongs = [];
    const uniqueSongIds = new Set();

    // Search for songs in parallel (limit to 15 concurrent requests to avoid rate limiting)
    const searchPromises = songQueries.slice(0, 15).map(query => 
      searchSongsAPI(query).catch(err => {
        console.warn(`Failed to search for "${query}":`, err);
        return [];
      })
    );

    const searchResults = await Promise.all(searchPromises);
    
    // Step 3: Combine results and remove duplicates
    searchResults.forEach(songs => {
      songs.forEach(song => {
        if (song.url && !uniqueSongIds.has(song.id)) {
          uniqueSongIds.add(song.id);
          allSongs.push(song);
        }
      });
    });

    if (allSongs.length === 0) {
      throw new Error('No songs found. Please try a different description.');
    }

    // Return at least 10-15 songs if available
    return allSongs.slice(0, 20);
  } catch (error) {
    console.error("Error generating magic playlist:", error);
    throw error;
  }
};

