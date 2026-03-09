/**
 * Song Data Transformers
 * Consistent data transformation for different API responses
 */

import { SONG_FALLBACKS } from './constants';

/**
 * Transform playlist API response to standardized song format
 * @param {Object} song - Raw song object from playlist API
 * @returns {Object} Standardized song object
 */
export const transformPlaylistSong = (song) => {
  if (!song || !song.media_url) return null;

  return {
    id: song.id || String(Date.now() + Math.random()),
    title: song.song || SONG_FALLBACKS.TITLE,
    album: song.album || SONG_FALLBACKS.ALBUM,
    artists: formatArtists(song.singers || song.primary_artists),
    image: song.image || '',
    url: song.media_url,
  };
};

/**
 * Transform search API response to standardized song format
 * @param {Object} song - Raw song object from search API
 * @returns {Object} Standardized song object
 */
export const transformSearchSong = (song) => {
  if (!song) return null;

  // Find best quality download URL
  const downloadUrl = findBestQualityUrl(song);
  if (!downloadUrl) return null;

  // Find best quality image
  const imageUrl = findBestQualityImage(song.image);

  return {
    id: song.id || String(Date.now() + Math.random()),
    title: song.name || SONG_FALLBACKS.TITLE,
    album: song.album?.name || SONG_FALLBACKS.ALBUM,
    artists: formatArtistsFromArray(song.artists?.primary),
    image: imageUrl || '',
    url: downloadUrl,
  };
};

/**
 * Format artists from string or array to consistent format
 * @param {string|Array} artists - Artists as string or array
 * @returns {string} Formatted artists string
 */
const formatArtists = (artists) => {
  if (!artists) return SONG_FALLBACKS.ARTISTS;
  if (typeof artists === 'string') return artists;
  if (Array.isArray(artists)) return artists.join(', ');
  return SONG_FALLBACKS.ARTISTS;
};

/**
 * Format artists from array of artist objects
 * @param {Array} artists - Array of artist objects
 * @returns {string} Formatted artists string
 */
const formatArtistsFromArray = (artists) => {
  if (!artists || !Array.isArray(artists) || artists.length === 0) {
    return SONG_FALLBACKS.ARTISTS;
  }
  return artists.map(artist => artist?.name || artist).filter(Boolean).join(', ');
};

/**
 * Find best quality download URL from song object
 * @param {Object} song - Song object with download URLs
 * @returns {string|null} Best quality URL or null
 */
const findBestQualityUrl = (song) => {
  const qualityOrder = ['320kbps', '128kbps', '64kbps'];
  
  // Try downloadUrl first (correct field name)
  if (song.downloadUrl && Array.isArray(song.downloadUrl)) {
    for (const quality of qualityOrder) {
      const urlObj = song.downloadUrl.find(dl => dl.quality === quality);
      if (urlObj?.url) return urlObj.url;
    }
  }
  
  // Fallback to downloadURL (typo in some responses)
  if (song.downloadURL && Array.isArray(song.downloadURL)) {
    for (const quality of qualityOrder) {
      const urlObj = song.downloadURL.find(dl => dl.quality === quality);
      if (urlObj?.url) return urlObj.url;
    }
  }
  
  return null;
};

/**
 * Find best quality image from image array
 * @param {Array} images - Array of image objects
 * @returns {string|null} Best quality image URL or null
 */
const findBestQualityImage = (images) => {
  if (!images || !Array.isArray(images)) return null;
  
  // Prefer 50x50, then 150x150, then any available
  const qualityOrder = ['50x50', '150x150', '500x500'];
  
  for (const quality of qualityOrder) {
    const img = images.find(img => img.quality === quality);
    if (img?.url) return img.url;
  }
  
  // Return first available image if no quality match
  return images[0]?.url || null;
};

