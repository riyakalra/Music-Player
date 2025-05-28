import { moodPlaylistMap } from "./moodPlaylistMap";
const CLIENT_ID = "f9c1a39af5ed45678e834decb2736961";
const CLIENT_SECRET = "20d408d42a6142b3847cd26b2497b64b";

// Fetch access token using Client Credentials flow
async function getAccessToken() {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}


export const fetchSongsByMood = async (mood) => {
  const playlistId = moodPlaylistMap[mood];
  if (!playlistId) return [];

  const token = await getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch playlist tracks", await res.text());
    return [];
  }

  const data = await res.json();

  return data.tracks.items
    .filter(item => item.track && item.track.id)
    .map(item => ({
      id: item.track.id,
      title: item.track.name,
      artists: item.track.artists.map(a => a.name).join(", "),
      image: item.track.album.images[1]?.url || item.track.album.images[0]?.url,
      url: item.track.external_urls.spotify,
    }));
};
