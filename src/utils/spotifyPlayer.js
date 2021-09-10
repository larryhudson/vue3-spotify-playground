import Cookies from 'cookies-js'

export async function playSpotifySong(playerId, spotifyUri) {

    const cookie = Cookies.get('vue3_spotify')

    if (!cookie) {
        return 'Not logged in'
    }

    const accessToken = JSON.parse(cookie).access_token

    const spotifyEndpoint = `https://api.spotify.com/v1/me/player/play?device_id=${playerId}`

    return await fetch(spotifyEndpoint, {
        method: 'PUT',
        body: JSON.stringify({ uris: [spotifyUri] }),
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}