import Cookies from 'cookies-js'

export async function fetchFromSpotifyApi(endpoint) {

    const cookie = Cookies.get('vue3_spotify')

    if (!cookie) {
        return 'Not logged in'
    }

    const accessToken = JSON.parse(cookie).access_token

    const SPOTIFY_URL_BASE = `https://api.spotify.com/v1`

    return await fetch(`${SPOTIFY_URL_BASE}/${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => res.json())
}