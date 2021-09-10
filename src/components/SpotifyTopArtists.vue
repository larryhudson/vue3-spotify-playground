<template>
    <div>
        <p v-if="loading">Loading...</p>
        <ul>
            <li v-for="artist in artists" :key="artist.id">
                <SpotifyArtist :name="artist.name" :id="artist.id" :imageUrl="artist.images[0].url" />
            </li>
        </ul>
    </div>

</template>

<style scoped>
    ul {
        display: flex;
        list-style: none;
        flex-wrap: wrap;
    }
</style>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { fetchFromSpotifyApi } from '../utils/spotifyApi'
import SpotifyArtist from './SpotifyArtist.vue';

export default defineComponent({
    setup() {
        let state = reactive({
            artists: [],
            loading: true
        })
    
        onMounted(async () => {
            state.artists = await fetchFromSpotifyApi('me/top/artists').then(res => res.items)
            state.loading = false;
        })

        return {
            ...toRefs(state)
        };
    },
    components: {SpotifyArtist}
});
</script>