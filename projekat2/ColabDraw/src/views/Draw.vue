<template>
  <div class="drawing-app">
    <Tools @colorSelected="setCurrentColor" />
    <Canvas :currentColor="currentColor" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tools from '@/components/Tools.vue';
import Canvas from '@/components/Canvas.vue';

const currentColor = ref('black'); 

const setCurrentColor = (color: string) => {
  currentColor.value = color;
};
</script>

<style scoped>
.drawing-app {
  display: flex;
}
</style>
