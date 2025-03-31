import fs from 'fs';
import fetch from 'node-fetch';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

function msToMinutes(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function getAccessToken() {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token,
    client_id,
    client_secret
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  const data = await res.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();

  const res = await fetch('https://api.spotify.com/v1/me/player', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    console.error('❌ Failed to fetch now playing:', res.status);
    fs.writeFileSync('./nowplaying.json', JSON.stringify({ playing: false }, null, 2));
    return;
  }

  const data = await res.json();

  if (!data || !data.item) {
    fs.writeFileSync('./nowplaying.json', JSON.stringify({ playing: false }, null, 2));
    return;
  }

  const output = {
    playing: true,
    name: data.item.name,
    artist: data.item.artists.map(a => a.name).join(', '),
    album: data.item.album.name,
    url: data.item.external_urls.spotify,
    image: data.item.album.images[0]?.url || '',
    device: data.device?.name || null,
    progress: msToMinutes(data.progress_ms),
    duration: msToMinutes(data.item.duration_ms)
  };

  console.log('🎧 Now playing:', output.name);
  fs.writeFileSync('./nowplaying.json', JSON.stringify(output, null, 2));
}

main();



// TO MANUALLY UPDATE nowplaying.json
// $env:SPOTIFY_ACCESS_TOKEN=" TOKEN"
// node scripts/fetch-spotify-info.js
