<template>
  <nav>
    <RouterLink :to="{ name: 'home' }">Home</RouterLink>
    <RouterLink :to="{ name: 'about' }">About</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
nav {
  background-color: black;
  color: #ff8a65;
  padding: 1rem;
  text-align: center;
  border-bottom: dotted 3px #ffccbc;
  width: 100%;
  display: flex;
  justify-content: left;
}

a {
  color: white;
  text-decoration: none;
  margin-right: 1rem;
}

a:hover {
  text-decoration: underline;
}
</style>
