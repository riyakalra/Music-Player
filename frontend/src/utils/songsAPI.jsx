import { moodPlaylistMap } from "./moodPlaylistMap";

export const fetchSongsByMood = async (mood) => {
  const playlistUrl = moodPlaylistMap[mood];
  if (!playlistUrl) return [];
  try {
    const res = await fetch(
      `https://saavnapi-nine.vercel.app/playlist/?query=${encodeURIComponent(playlistUrl)}`
    );
    const { songs } = await res.json();
    console.log({"fetched data": songs});

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

