<template>
  <div class="drawing-app">
    <Tools @colorSelected="updateColor" @toolSelected="updateTool" />
    <div
      class="canvas"
      @mousedown="startDrawing"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      draggable="false"
    >
      <div
        v-for="(pixel, index) in pixels"
        :key="index"
        class="pixel"
        :style="{ backgroundColor: pixel.color }"
        @mouseover="draw(index)"
        @click="clickPixel(index)"
        draggable="false"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Tools from "@/components/Tools.vue";

const pixels = ref(Array(2500).fill({ color: "white" }));

let currentTool = ref("brush");

const updateTool = (tool: string) => {
  currentTool.value = tool;
};

let isDrawing = false;
const currentColor = ref("#000000");

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
  if (isDrawing) clickPixel(index);
};

const clickPixel = (index: number) => {
  if (currentTool.value === "brush") {
    const colorToUse = currentColor.value;
    pixels.value[index] = { color: colorToUse };
  } else if (currentTool.value === "eraser") {
    pixels.value[index] = { color: "#FFFFFF" };
  }
};
</script>

<style scoped>
.drawing-app {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}

.tools {
  position: absolute;
  left: 20px;
}

.canvas {
  user-select: none;
  display: grid;
  grid-template-columns: repeat(50, 1fr);
  grid-template-rows: repeat(50, 1fr);
  width: fit-content;
  height: fit-content;
  border: 2px solid #000000;
}

.pixel {
  width: 12px;
  height: 12px;
  border: 0.1px solid #ddd;
}
</style>
