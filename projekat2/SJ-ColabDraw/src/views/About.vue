<template>
  <Header title="About" />
  <button @click="handleClick">Click me</button>
</template>

<script setup lang="ts">
  import { useRouter, useRoute } from 'vue-router';
  import Header from '@/components/Header.vue';

  const router = useRouter();
  
  const handleClick = () => {
    router.push({ name: 'home' })
  }

  const route = useRoute();

</script>

<style scoped>

  button {
    background-color: black;
    color: #FF8A65;
    padding: 1rem;
    margin: 1rem 0;
    text-align: center;
    border: solid 3px #FFCCBC;
    border-radius: 15px;
    width: 100%;
    display: flex;
    justify-content: left;
  }

</style>