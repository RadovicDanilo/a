<template>
  <div class="drawing-app">
    <Tools @colorSelected="updateColor" @toolSelected="updateTool" />
    <div>
      <div class="horizontalTools">
        <div class="tool" @click="save">
          <i class="mdi mdi-content-save tool-icon"></i>
        </div>
        <div class="tool" @click="decreaseCanvasSize">
          <i class="mdi mdi-minus tool-icon"></i>
        </div>
        <span class="canvas-size"> {{ pixels.length }}</span>
        <div class="tool" @click="increaseCanvasSize">
          <i class="mdi mdi-plus tool-icon"></i>
        </div>
      </div>
      <div class="canvas" :style="{
        gridTemplateColumns: `repeat(${pixels.length}, 1fr)`,
        gridTemplateRows: `repeat(${pixels.length}, 1fr)`
      }" @mousedown="startDrawing" @mouseup="stopDrawing" @mouseleave="stopDrawing" draggable="false">
        <div v-for="(row, rowIndex) in pixels" :key="rowIndex" class="pixel-row">
          <div v-for="(pixel, colIndex) in row" :key="colIndex" class="pixel" :style="{ backgroundColor: pixel.color }"
            @mouseover="draw(rowIndex, colIndex)" @click="clickPixel(rowIndex, colIndex)">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Tools from "@/components/Tools.vue";

const CANVAS_SIZE = 12;
const CANVAS_MIN_SIZE = 1;
const CANVAS_MAX_SIZE = 16;

const createMatrix = (size: number) =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ color: "white" }))
  );

const pixels = ref(createMatrix(CANVAS_SIZE));

const tool = ref("brush");
const color = ref("#000000");
let isDrawing = false;

const updateTool = (newTool: string) => {
  tool.value = newTool;
};

const updateColor = (newColor: string) => {
  color.value = newColor;
};

const startDrawing = () => {
  isDrawing = true;
};

const stopDrawing = () => {
  isDrawing = false;
};

const draw = (row: number, col: number) => {
  if (isDrawing) clickPixel(row, col);
};

const clickPixel = (row: number, col: number) => {
  if (tool.value === "brush") {
    pixels.value[row][col].color = color.value;
  } else if (tool.value === "eraser") {
    pixels.value[row][col].color = "#FFFFFF";
  }
};

const increaseCanvasSize = () => {
  const newSize = pixels.value.length + 1;

  if (newSize > CANVAS_MAX_SIZE) return;

  pixels.value = Array.from({ length: newSize }, (_, row) =>
    Array.from({ length: newSize }, (_, col) =>
      pixels.value[row]?.[col] || { color: "white" }
    )
  );
};

const decreaseCanvasSize = () => {
  const newSize = pixels.value.length - 1;

  if (newSize < CANVAS_MIN_SIZE) return;

  pixels.value = pixels.value
    .slice(0, newSize)
    .map(row => row.slice(0, newSize));
};

const save = () => {
  //TODO: implement
}  
</script>

<style scoped>
.drawing-app {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100v;
  padding: 20px;
  gap: 20px;
  box-sizing: border-box;
}

.tools {
  position: absolute;
  left: 0;
  top: 30%;
  left: 30px;
}

.horizontalTools {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
  position: sticky;
  padding: 32px;
  padding-bottom: 34px;
}

.tool {
  padding: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tool-icon {
  font-size: 30px;
}

.tool:hover {
  background-color: #eee;
}

.canvas {
  user-select: none;
  display: flex;
  border: 2px solid #000000;
  flex-grow: 1;
  width: fit-content;
  height: fit-content;
  overflow: hidden;
}

.pixel {
  width: 36px;
  height: 36px;
  border: 0.1px solid #ddd;
  transition: background-color 0.3s ease;
}

.pixel:hover {
  opacity: 0.9;
  background-color: lightgray;
}

.canvas-size {
  font-weight: bold;
  font-size: 18px;
}
</style>