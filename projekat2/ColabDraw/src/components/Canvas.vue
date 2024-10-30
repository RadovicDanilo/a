<template>
  <div class="drawing-app">
    <Tools @colorSelected="updateColor" />
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Tools from "@/components/Tools.vue";

const pixels = ref(Array(2500).fill({ color: "white" }));
let isDrawing = false;
const currentColor = ref("#ff8a65");

const updateColor = (newColor: string) => {
  currentColor.value = newColor;
};

const startDrawing = () => {
  isDrawing = true;
};

const stopDrawing = () => {
  isDrawing = false;
};

const draw = (index: number) => {
  const colorToUse = currentColor.value;
  if (isDrawing) {
    pixels.value[index] = { color: colorToUse };
  }
};

const selectPixel = (index: number) => {
  const colorToUse = currentColor.value;
  pixels.value[index] = { color: colorToUse };
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
.drawing-app {
  display: flex;
}
</style>
