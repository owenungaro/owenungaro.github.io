import express from 'express';
import open from 'open';
import fetch from 'node-fetch';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:3000/callback';
const scope = 'user-read-playback-state user-read-currently-playing';

const app = express();
const port = 3000;

app.get('/login', (req, res) => {
  const authURL = new URL('https://accounts.spotify.com/authorize');
  authURL.searchParams.set('response_type', 'code');
  authURL.searchParams.set('client_id', client_id);
  authURL.searchParams.set('scope', scope);
  authURL.searchParams.set('redirect_uri', redirect_uri);
  res.redirect(authURL.toString());
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri,
    client_id,
    client_secret
  });

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body
  });

  const data = await result.json();

  res.send('Refresh token received! You can close this tab.');
  console.log('ACCESS TOKEN:', data.access_token);
  console.log('REFRESH TOKEN:', data.refresh_token);
});

app.listen(port, () => {
  console.log(`Open http://localhost:${port}/login in your browser...`);
  open(`http://localhost:${port}/login`);
});
