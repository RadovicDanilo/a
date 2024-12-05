<template>
  <div class="drawing-app">
    <Tools @colorSelected="updateColor" @toolSelected="updateTool" />
    <div>
      <div class="horizontalTools">
        <div class="tool" @click="openSaveDialog">
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
    <div v-if="isDialogOpen" class="dialog-overlay">
      <div class="dialog">
        <h2 class="dialog-title">Enter Picture Name</h2>
        <input v-model="pictureName" type="text" placeholder="Picture Name" class="dialog-input" />
        <div class="dialog-actions">
          <button @click="save" class="dialog-button save-button">Save</button>
          <button @click="closeSaveDialog" class="dialog-button cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { usePictureStore } from "@/stores/pictureStore";
import { useToast } from "vue-toastification";
import Tools from "@/components/Tools.vue";

export default defineComponent({
  components: {
    Tools,
  },
  setup() {
    const toast = useToast()

    const pictureStore = usePictureStore();

    const CANVAS_SIZE = 12;
    const CANVAS_MIN_SIZE = 1;
    const CANVAS_MAX_SIZE = 16;

    const createMatrix = (size: number) =>
      Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({ color: "#FFFFFF" }))
      );

    const pixels = ref(createMatrix(CANVAS_SIZE));

    const tool = ref("brush");
    const color = ref("#000000");
    let isDrawing = false;

    const pictureName = ref("");
    const isDialogOpen = ref(false);

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
          pixels.value[row]?.[col] || { color: "#FFFFFF" }
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

    const pixelsToPictureData = (): string[][] => pixels.value.map(row => row.map(pixel => pixel.color));

    const openSaveDialog = () => {
      isDialogOpen.value = true;
    };

    const closeSaveDialog = () => {
      isDialogOpen.value = false;
    };

    const save = () => {
      if (pictureName.value.trim() === "") {
        toast.error("Picture name cannot be empty.");
        return;
      }

      const picture = {
        name: pictureName.value,
        picture_data: pixelsToPictureData(),
      };
      pictureStore.createPicture(picture);

      pictureName.value = "";
      closeSaveDialog();
    };

    return {
      pixels,
      tool,
      color,
      updateTool,
      updateColor,
      startDrawing,
      stopDrawing,
      draw,
      clickPixel,
      increaseCanvasSize,
      decreaseCanvasSize,
      save,
      openSaveDialog,
      closeSaveDialog,
      pictureName,
      isDialogOpen,
    };
  }
});
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

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

.dialog {
  background-color: white;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.dialog-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.dialog-input {
  padding: 12px 16px;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.dialog-input:focus {
  border-color: #007bff;
  outline: none;
}

.dialog-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.dialog-button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  flex-grow: 1;
}

.save-button {
  background-color: #007bff;
  color: white;
}

.save-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
}

.cancel-button:hover {
  background-color: #ddd;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>