<script setup>
</script>

<template>
  <div>
    <header v-if="$route.meta.title">
      <h1>
          {{ $route.meta.title }}
        </h1>
        <p><router-link to="/">Home</router-link></p>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>