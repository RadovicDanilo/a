<template>
  <div>
    <h1>Gallery</h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userFilter = computed(() => route.query.user);


</script>

<style scoped></style>
