<template>
  <div
    class="canvas"
    @mousedown="startDrawing"
    @mouseup="stopDrawing"
    @mouseleave="stopDrawing"
  >
    <div
      v-for="(pixel, index) in pixels"
      :key="index"
      class="pixel"
      :style="{ backgroundColor: pixel.color }"
      @mouseover="draw(index)"
      @click="selectPixel(index)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const pixels = ref(Array(2500).fill({ color: "white" }));
let isDrawing = false;

const startDrawing = () => {
  isDrawing = true;
};

const stopDrawing = () => {
  isDrawing = false;
};

const draw = (index: number) => {
  if (isDrawing) {
    pixels.value[index] = { color: "currentColor" };
  }
};

const selectPixel = (index: number) => {
  pixels.value[index] = { color: "currentColor" };
};
</script>

<style scoped>
.canvas {
  display: grid;
  grid-template-columns: repeat(50, 1fr);
  grid-template-rows: repeat(50, 1fr);
  width: 250px;
  height: 250px;
  border: 2px solid #ccc;
  background-color: white;
}

.pixel {
  width: 20px;
  height: 20px;
  border: 0.1px solid #ddd;
}
</style>
