/**
 * API Constants and Configuration
 * Centralized API endpoints and configuration
 */

export const API_ENDPOINTS = {
  SAAVN_PLAYLIST: 'https://saavnapi-nine.vercel.app/playlist/',
  SAAVN_SEARCH: 'https://jiosaavn-api.vercel.app/search', // Alternative JioSaavn search API
  SAAVN_SEARCH_ALT: 'https://saavn.sumit.co/api/search', // Fallback search (returns page URLs only)
  SAAVN_SONG_DETAILS: 'https://saavn.sumit.co/api/songs', // For fetching song details with media URL
};

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export const SONG_FALLBACKS = {
  TITLE: 'Information not available',
  ALBUM: 'Information not available',
  ARTISTS: 'Information not available',
};

