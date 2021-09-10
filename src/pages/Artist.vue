<template>
    <div v-if="artist">

        <img class="artist-image" v-if="artist.images" :src="artist.images[0].url" :alt="`Image for ${artist.name}`" />
    
        <h1>{{artist.name}}</h1>

    </div>

    <h2>Tracks</h2>

    <ul class="horizontal-list">
        <li v-for="track in tracks" :key="track.id">
            <SpotifyCard :text="track.name" link="#" :imageUrl="`${track.album.images[0].url}`" />
            <button @click="toggleSong(track.uri)">
                <span v-if="playingId === track.uri">
                    Pause
                </span>
                <span v-else>
                    Play
                </span>
            </button>
        </li>
    </ul>

    <h2>Albums</h2>

      <ul>
        <li v-for="album in albums" :key="album.id">
            <SpotifyCard :text="`${album.name} (${album.release_date.slice(0,4)})`" link="#" :imageUrl="`${album.images[0].url}`" />
        </li>
    </ul>

    <h2>Similar artists</h2>

    <ul>
        <li v-for="artist in similarArtists" :key="artist.id">
            <SpotifyArtist :name="artist.name" :imageUrl="artist.images[0].url" :id="artist.id" />
        </li>
    </ul>

    <h2>Recommendations</h2>

    <label>Seed genre:</label>
    <select v-model="seedGenre" @change="getRecommendations">
        <option v-for="genre in artist.genres" :key="genre" :value="genre">{{genre}}</option>
    </select>

    <label>Seed song:</label>
    <select v-model="seedTrack" @change="getRecommendations">
        <option v-for="track in tracks" :key="track.id" :value="track.id">{{track.name}}</option>
    </select>

    <button @click="getRecommendations">Get recommendations</button>

    <ul>
        <li v-for="track in recommendations" :key="track.id">
            <SpotifyCard :text="`${track.artists[0].name} - ${track.name} (${track.album.name})`" :link="`/artist/${track.artists[0].id}`" :imageUrl="`${track.album.images[0].url}`" />
            <button @click="toggleSong(track.uri)">
                <span v-if="playingId === track.uri">
                    Pause
                </span>
                <span v-else>
                    Play
                </span>
            </button>
        </li>
    </ul>

</template>

<script>import { defineComponent, toRefs, reactive, onMounted } from "vue";
import { fetchFromSpotifyApi } from "../utils/spotifyApi";
import {playSpotifySong} from "../utils/spotifyPlayer";
import SpotifyArtist from "../components/SpotifyArtist.vue";
import SpotifyCard from "../components/SpotifyCard.vue";
import { onBeforeRouteUpdate } from "vue-router";

export default defineComponent({
    props: ['id'],
    setup(props) {
        let state = reactive({
            artist: {},
            tracks: [],
            albums: [],
            similarArtists: [],
            seedGenre: '',
            seedTrack: '',
            recommendations: [],
            playingId: '',
        })

        onMounted(async () => {
            state.artist = await fetchFromSpotifyApi(`artists/${props.id}`)
            state.tracks = await fetchFromSpotifyApi(`artists/${props.id}/top-tracks?market=AU`).then(res => res.tracks)
            state.albums = await fetchFromSpotifyApi(`artists/${props.id}/albums?market=AU&include_groups=album`).then(res => res.items)
            state.similarArtists = await fetchFromSpotifyApi(`artists/${props.id}/related-artists`).then(res => res.artists)

            state.seedGenre = state.artist.genres[0]
            state.seedTrack = state.tracks[0].id
            getRecommendations()
        })

        async function getRecommendations() {
            state.recommendations = await fetchFromSpotifyApi(`recommendations?seed_artists=${state.artist.id}&seed_genres=${state.seedGenre}&seed_tracks=${state.seedTrack}`).then(res => res.tracks)
        }

        onBeforeRouteUpdate(async (to) => {
            window.scrollTo(0,0)
            state.artist = {}
            state.tracks = []
            state.albums = []
            state.similarArtists = []
            state.recommendations = {}
            state.artist = await fetchFromSpotifyApi(`artists/${to.params.id}`)
            state.tracks = await fetchFromSpotifyApi(`artists/${to.params.id}/top-tracks?market=AU`).then(res => res.tracks)
            state.albums = await fetchFromSpotifyApi(`artists/${to.params.id}/albums?market=AU&include_groups=album`).then(res => res.items)
            state.similarArtists = await fetchFromSpotifyApi(`artists/${to.params.id}/related-artists`).then(res => res.artists)

            state.seedGenre = state.artist.genres[0]
            state.seedTrack = state.tracks[0].id
            getRecommendations()
        })

        function toggleSong(spotify_uri) {
            if (state.playingId === spotify_uri) {
                window.spotifyPlayer.pause()
                state.playingId = ''
            } else {
                playSpotifySong(window.spotifyPlayerDeviceId, spotify_uri)
                state.playingId = spotify_uri
            }
        }

        return {
            ...toRefs(state),
            getRecommendations,
            toggleSong
        }

    },
    components: {SpotifyArtist, SpotifyCard},

})
</script>

<style scoped>
.artist-image {
    width: 150px;
    height: 150px;

    float: left;
    margin: 1rem;
}

    ul {
        display: flex;
        list-style: none;
        overflow-x: scroll;
    }
</style>