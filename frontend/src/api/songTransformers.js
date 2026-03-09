import { SONG_FALLBACKS } from './constants';

const decodeHtmlEntities = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

export const transformPlaylistSong = (song) => {
  if (!song || !song.media_url) return null;

  return {
    id: song.id || String(Date.now() + Math.random()),
    title: decodeHtmlEntities(song.song) || SONG_FALLBACKS.TITLE,
    album: decodeHtmlEntities(song.album) || SONG_FALLBACKS.ALBUM,
    artists: formatArtists(song.singers || song.primary_artists),
    image: song.image || '',
    url: song.media_url,
  };
};

export const transformSearchSong = (song) => {
  if (!song) return null;

  let downloadUrl = findBestQualityUrl(song);

  let imageUrl = null;
  if (song.images && typeof song.images === 'object') {
    imageUrl = song.images['500x500'] || song.images['150x150'] || song.images['50x50'] || null;
  }
  if (!imageUrl) {
    imageUrl = findBestQualityImage(song.image);
  }
  if (!imageUrl && song.image) {
    imageUrl = song.image;
  }

  const rawTitle = song.title || song.name || SONG_FALLBACKS.TITLE;
  const title = decodeHtmlEntities(rawTitle);
  
  const rawAlbum = typeof song.album === 'string' 
    ? song.album 
    : (song.album?.name || SONG_FALLBACKS.ALBUM);
  const album = decodeHtmlEntities(rawAlbum);
  
  let artists = SONG_FALLBACKS.ARTISTS;
  if (song.more_info?.singers) {
    artists = decodeHtmlEntities(song.more_info.singers);
  } else if (song.description) {
    const descParts = song.description.split('·');
    if (descParts.length > 1) {
      artists = decodeHtmlEntities(descParts.slice(1).join('·').trim());
    }
  } else if (song.primaryArtists) {
    artists = decodeHtmlEntities(song.primaryArtists);
  } else if (song.singers) {
    artists = decodeHtmlEntities(song.singers);
  } else if (song.artists?.primary) {
    artists = formatArtistsFromArray(song.artists.primary);
  }

  const vlink = song.more_info?.vlink;
  
  return {
    id: song.id || String(Date.now() + Math.random()),
    title: title,
    album: album,
    artists: artists,
    image: imageUrl || '',
    url: downloadUrl || vlink || '',
    _needsMediaUrl: !downloadUrl && !vlink,
    _pageUrl: song.perma_url || song.url,
    _apiUrl: song.api_url?.song,
  };
};

const formatArtists = (artists) => {
  if (!artists) return SONG_FALLBACKS.ARTISTS;
  if (typeof artists === 'string') return artists;
  if (Array.isArray(artists)) return artists.join(', ');
  return SONG_FALLBACKS.ARTISTS;
};

const formatArtistsFromArray = (artists) => {
  if (!artists || !Array.isArray(artists) || artists.length === 0) {
    return SONG_FALLBACKS.ARTISTS;
  }
  return artists.map(artist => artist?.name || artist).filter(Boolean).join(', ');
};

const findBestQualityUrl = (song) => {
  const qualityOrder = ['320kbps', '128kbps', '64kbps'];
  
  if (song.downloadUrl && Array.isArray(song.downloadUrl)) {
    for (const quality of qualityOrder) {
      const urlObj = song.downloadUrl.find(dl => dl.quality === quality);
      if (urlObj?.url) return urlObj.url;
    }
  }
  
  if (song.downloadURL && Array.isArray(song.downloadURL)) {
    for (const quality of qualityOrder) {
      const urlObj = song.downloadURL.find(dl => dl.quality === quality);
      if (urlObj?.url) return urlObj.url;
    }
  }
  
  return null;
};

const findBestQualityImage = (images) => {
  if (!images || !Array.isArray(images)) return null;
  
  const qualityOrder = ['50x50', '150x150', '500x500'];
  
  for (const quality of qualityOrder) {
    const img = images.find(img => img.quality === quality);
    if (img?.url) return img.url;
  }
  
  return images[0]?.url || null;
};

