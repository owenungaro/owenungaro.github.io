export default {
	async fetch(request, env) {
	  const token = await getAccessToken(env);
	  const nowPlaying = await fetchNowPlaying(token);
  
	  return new Response(JSON.stringify(nowPlaying), {
		headers: {
		  'Content-Type': 'application/json',
		  'Access-Control-Allow-Origin': '*', // <-- this is the fix
		},
	  });
	},
  };
  
  
  async function getAccessToken(env) {
	const creds = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
	const res = await fetch('https://accounts.spotify.com/api/token', {
	  method: 'POST',
	  headers: {
		'Authorization': `Basic ${creds}`,
		'Content-Type': 'application/x-www-form-urlencoded',
	  },
	  body: `grant_type=refresh_token&refresh_token=${env.SPOTIFY_REFRESH_TOKEN}`,
	});
	const data = await res.json();
	return data.access_token;
  }
  
  async function fetchNowPlaying(token) {
	const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
	  headers: {
		'Authorization': `Bearer ${token}`,
	  },
	});
  
	const text = await res.text(); // grab the full body
	console.log('Spotify response:', text); // log it for wrangler tail
  
	if (res.status === 204 || res.status > 400) {
	  return { is_playing: false };
	}
  
	const data = JSON.parse(text);
	return {
	  is_playing: data.is_playing,
	  title: data.item?.name || 'Unknown',
	  artist: data.item?.artists.map(a => a.name).join(', ') || '',
	  album_image_url: data.item?.album.images[0].url || '',
	};
  }
  