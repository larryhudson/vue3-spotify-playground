import cookie from 'cookie'

export default function getTokenFromRequest(req) {
    const siteCookies = cookie.parse(req.headers.cookie)
    if (siteCookies.nuxt_spotify) {
        return JSON.parse(siteCookies.nuxt_spotify).access_token
      }
    else {
        return null
    }
}