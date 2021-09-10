import fetch from 'node-fetch';
import cookie from 'cookie';
import btoa from 'btoa';
const { URLSearchParams } = require('url');

export async function handler(event) {
  const { code } = event.queryStringParameters;

  const spotifyTokenResponse = await fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    body: new URLSearchParams({
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:8888/.netlify/functions/spotify-oauth',
    }),
    headers: {
      Authorization: `Basic ${btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)}`
    }
  });

  if (!spotifyTokenResponse.ok) {
    console.log(spotifyTokenResponse);
    return {
      statusCode: 500,
      body: JSON.stringify(spotifyTokenResponse),
    };
  }

  const spotifyTokenJson = await spotifyTokenResponse.json();

  const tokenCookie = cookie.serialize(
    'vue3_spotify',
    JSON.stringify(spotifyTokenJson),
    {
      secure: true,
      httpOnly: false,
      path: '/',
      maxAge: spotifyTokenJson.expires_in,
    },
  );

  return {
    statusCode: 301,
    headers: {
      'Set-Cookie': tokenCookie,
      Location: '/',
    },
    body: 'OK',
  };
}
