import { API_ENDPOINTS, DEFAULT_ERROR_MESSAGE } from './constants';
import { transformPlaylistSong, transformSearchSong } from './songTransformers';

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

    const transformedSongs = data.songs
      .map(transformPlaylistSong)
      .filter(song => song !== null && song.url);

    return transformedSongs;
  } catch (error) {
    console.error('Error fetching playlist songs:', error);
    throw new Error(error.message || DEFAULT_ERROR_MESSAGE);
  }
};

export const searchSongs = async (query) => {
  if (!query || !query.trim()) {
    throw new Error('Search query is required');
  }

  try {
    let response = await fetch(
      `${API_ENDPOINTS.SAAVN_SEARCH}?query=${encodeURIComponent(query.trim())}`
    );

    if (!response.ok) {
      console.log('Primary search API failed, trying fallback search API...');
      response = await fetch(
        `${API_ENDPOINTS.SAAVN_SEARCH_ALT}?query=${encodeURIComponent(query.trim())}`
      );
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    let results = [];
    
    if (data && data.results && Array.isArray(data.results)) {
      results = data.results;
    } else if (data && data.songs && Array.isArray(data.songs)) {
      results = data.songs;
    } else if (data && data.success && data.data && data.data.songs && data.data.songs.results) {
      results = data.data.songs.results;
    } else if (data && data.data && data.data.results && Array.isArray(data.data.results)) {
      results = data.data.results;
    } else if (data && Array.isArray(data)) {
      results = data;
    }
    
    if (results.length === 0) {
      return [];
    }

    const transformedSongs = results
      .map(transformSearchSong)
      .filter(song => song !== null);

    const songsWithMediaUrls = await Promise.all(
      transformedSongs.map(async (song) => {
        if (song.url && !song._needsMediaUrl) {
          return song;
        }

        if (song._needsMediaUrl && song.id) {
          try {
            let songDetailsUrl;
            if (song._apiUrl) {
              songDetailsUrl = song._apiUrl;
            } else {
              songDetailsUrl = `${API_ENDPOINTS.SAAVN_SONG_DETAILS}?ids=${song.id}`;
            }
            
            const songDetailsResponse = await fetch(songDetailsUrl);
            
            if (songDetailsResponse.ok) {
              const songDetails = await songDetailsResponse.json();
              console.log(`Song details for ${song.id}:`, songDetails);
              
              let mediaUrl = null;
              
              let songData = Array.isArray(songDetails) 
                ? (songDetails[0]?.data || songDetails[0])
                : (songDetails?.data || songDetails);
              
              if (!songData && songDetails) {
                songData = songDetails;
              }
              
              if (songData?.downloadUrl) {
                if (Array.isArray(songData.downloadUrl)) {
                  const qualityOrder = ['320kbps', '128kbps', '64kbps'];
                  for (const quality of qualityOrder) {
                    const urlObj = songData.downloadUrl.find(dl => dl.quality === quality);
                    if (urlObj?.url) {
                      mediaUrl = urlObj.url;
                      break;
                    }
                  }
                  if (!mediaUrl && songData.downloadUrl[0]?.url) {
                    mediaUrl = songData.downloadUrl[0].url;
                  }
                } else if (typeof songData.downloadUrl === 'string') {
                  mediaUrl = songData.downloadUrl;
                } else if (songData.downloadUrl?.url) {
                  mediaUrl = songData.downloadUrl.url;
                }
              }
              
              if (!mediaUrl && songData?.media_url) {
                mediaUrl = songData.media_url;
              }
              
              if (!mediaUrl && songData?.mediaUrl) {
                mediaUrl = songData.mediaUrl;
              }
              
              if (!mediaUrl && songData?.url) {
                if (songData.url.includes('aac.saavncdn.com') || 
                    songData.url.includes('saavncdn.com') ||
                    songData.url.includes('.mp4') || 
                    songData.url.includes('.mp3')) {
                  mediaUrl = songData.url;
                }
              }
              
              if (!mediaUrl && songData?.download_url) {
                mediaUrl = songData.download_url;
              }
              
              if (!mediaUrl && songDetails?.data?.url && 
                  (songDetails.data.url.includes('saavncdn.com') || 
                   songDetails.data.url.includes('.mp4') || 
                   songDetails.data.url.includes('.mp3'))) {
                mediaUrl = songDetails.data.url;
              }
              
              if (mediaUrl && 
                  !mediaUrl.includes('jiosaavn.com/song') && 
                  !mediaUrl.includes('jiosaavn.com/album') &&
                  (mediaUrl.includes('aac.saavncdn.com') || 
                   mediaUrl.includes('saavncdn.com') ||
                   mediaUrl.includes('.mp4') || 
                   mediaUrl.includes('.mp3') ||
                   mediaUrl.includes('.m4a') ||
                   mediaUrl.startsWith('http'))) {
                console.log(`✅ Found media URL for ${song.id}: ${mediaUrl.substring(0, 60)}...`);
                return { 
                  ...song, 
                  url: mediaUrl, 
                  _needsMediaUrl: false 
                };
              } else if (mediaUrl) {
                console.warn(`⚠️ Got URL but doesn't look like media URL for ${song.id}: ${mediaUrl}`);
              } else {
                console.warn(`⚠️ No media URL found in song details for ${song.id}. Response keys:`, songData ? Object.keys(songData) : 'no data');
              }
            } else {
              const errorText = await songDetailsResponse.text();
              console.warn(`Failed to fetch song details for ${song.id}: ${songDetailsResponse.status}`, errorText);
            }
          } catch (error) {
            console.warn(`Error fetching media URL for song ${song.id}:`, error);
          }
        }

        return song;
      })
    );

    const cleanedSongs = songsWithMediaUrls.map(song => {
      const { _needsMediaUrl, _pageUrl, ...cleanSong } = song;
      return cleanSong;
    });
    
    return cleanedSongs;
  } catch (error) {
    console.error('Error searching songs:', error);
    throw new Error(error.message || DEFAULT_ERROR_MESSAGE);
  }
};

