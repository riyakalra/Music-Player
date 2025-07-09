import { allPlaylists } from "./playlistData";

export const fetchSongsByPlaylist = async (mood) => {
  const playlistUrl = allPlaylists.find((playlist) => playlist.name === mood)?.url;
  if (!playlistUrl) return [];
  try {
    const res = await fetch(
      `https://saavnapi-nine.vercel.app/playlist/?query=${encodeURIComponent(playlistUrl)}`
    );
    const { songs } = await res.json();

    if (!songs || !Array.isArray(songs)) return [];
    return songs.map((song) => ({
      id: song.id,
      title: song.song || 'Information not available' ,
      album: song.album || 'Information not available',
      artists: song.singers || song.primary_artists || 'Information not available',
      image: song.image,
      url: song.media_url
    })).filter(s => s.url); 
  } catch (err) {
    console.error("Error fetching songs:", err);
    return [];
  }
};

export const searchSongs = async (query) => {
  try {
    const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
    const fetchedData = await res.json();
    if (!fetchedData || !fetchedData.data.results || !Array.isArray(fetchedData.data.results)) return [];

    return fetchedData.data.results.map((song) => ({
      id: song.id,
      title: song.name || 'Information not available' ,
      album: song.album.name || 'Information not available',
      artists: song.artists.primary.map(artist => artist.name)  || 'Information not available',
      image: song.image.find(img => img.quality === '50x50')?.url,
      url: song.downloadUrl.find(dl => dl.quality === '320kbps')?.url || song.downloadURL.find(dl => dl.quality === '128kbps')?.url || song.downloadURL.find(dl => dl.quality === '64kbps')?.url
    })).filter(s => s.url); 
  } catch (err) {
    console.error("Error fetching songs:", err);
    return [];
  }
}

