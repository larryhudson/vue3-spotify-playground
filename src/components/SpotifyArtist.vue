<template>
    <div>
        <img v-if="imageUrl" :src="imageUrl" alt="" />
        <router-link :to="`/artist/${id}`">{{name}}</router-link>
    </div>
</template>

<script setup>
defineProps(['name', 'id', 'imageUrl']);
</script>

<style scoped>
    div {
        display: flex;
        flex-direction: column;

        text-align: center;

        padding: 1rem;

        position: relative;
    }

    div:hover {
        background: lightgray;
    }
    
    img {
        width: 150px;
        height: 150px;
        object-fit: cover;
    }

    a {
        padding: 0.5rem 1rem;
    }

    a::after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        content: '';
    }

</style>