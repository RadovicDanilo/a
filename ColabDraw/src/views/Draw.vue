<template>
  <div class="drawing-app" @mousemove="trackCursorPosition">
    <div v-for="(cursor, username) in userCursors" :key="username" class="cursor" :style="{
      top: `${cursor.y}px`,
      left: `${cursor.x}px`,
    }">
      <i class="mdi mdi-cursor-default cursor-icon"></i>
      <div class="cursor-username">{{ username }}</div>
    </div>

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
        gridTemplateRows: `repeat(${pixels.length}, 1fr)`,
      }" @mousedown="startDrawing" @mouseup="stopDrawing" @mouseleave="stopDrawing" draggable="false">
        <div v-for="(row, rowIndex) in pixels" :key="rowIndex" class="pixel-row">
          <div v-for="(pixel, colIndex) in row" :key="colIndex" class="pixel" :style="{
            backgroundColor: pixel.color,
            width: pixelSize,
            height: pixelSize
          }" @mouseover="draw(rowIndex, colIndex)" @click="clickPixel(rowIndex, colIndex)"></div>
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
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { usePictureStore } from "@/stores/pictureStore";
import { useToast } from "vue-toastification";
import Tools from "@/components/Tools.vue";
import { useRoute } from "vue-router";
import { io, Socket } from "socket.io-client"
import { useAuthStore } from "@/stores/authStore";

export default defineComponent({
  components: {
    Tools,
  },
  setup() {
    const toast = useToast()

    const SOCKET_URL = "http://localhost:3000";
    const socket = ref<Socket | null>(null);
    const userCursors = ref<Record<string, { x: number; y: number }>>({});

    const pictureStore = usePictureStore();
    const authStore = useAuthStore();

    const CANVAS_SIZE = 12;
    const CANVAS_MIN_SIZE = 1;
    const CANVAS_MAX_SIZE = 16;
    const CANVAS_CONTAINER_SIZE = 600;

    const createMatrix = (size: number) =>
      Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({ color: "#FFFFFF" }))
      );

    const pixels = ref(createMatrix(CANVAS_SIZE));

    const pixelSize = computed(() => `${CANVAS_CONTAINER_SIZE / pixels.value.length}px`);

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
      const tempColor = tool.value === "brush" ? color.value : "#FFFFFF"
      pixels.value[row][col].color = tempColor;
      if (socket.value != null) {
        socket.value.emit("draw", { pictureId, row, col, color: tempColor});
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

      if (socket.value != null) {
        socket.value.emit("increase_size", { pictureId });
      }
    };

    const decreaseCanvasSize = () => {
      const newSize = pixels.value.length - 1;

      if (newSize < CANVAS_MIN_SIZE) return;

      pixels.value = pixels.value
        .slice(0, newSize)
        .map(row => row.slice(0, newSize));

      if (socket.value != null) {
        socket.value.emit("decrease_size", { pictureId });
      }
    };

    const trackCursorPosition = (event: MouseEvent) => {
      updateCursor(event.pageX, event.pageY);
    };

    const updateCursor = (x: number, y: number) => {
      if (socket.value) {
        socket.value.emit("update_cursor", { pictureId, username: authStore.username, x, y });
      }
    };

    const pixelsToPictureData = (): string[][] => pixels.value.map(row => row.map(pixel => pixel.color));

    const pictureDataToPixels = (pictureData: string[][]): { color: string }[][] => {
      return pictureData.map(row =>
        row.map(color => ({ color }))
      );
    };

    const openSaveDialog = () => {
      if (pictureId !== undefined) {
        update();
        return
      }
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

    const update = async () => {
      if (pictureId === undefined)
        return;
      let pic = await pictureStore.fetchPictureById(pictureId);
      if (pic === undefined)
        return;
      pic.picture_data = pixelsToPictureData()
      await pictureStore.updatePicture(pictureId, pic);
    };

    const route = useRoute();
    const pictureId = Array.isArray(route.params.pictureId)
      ? route.params.pictureId[0]
      : route.params.pictureId;

    const fetchPictureData = async () => {
      pixels.value = createMatrix(CANVAS_SIZE)
      if (pictureId === undefined)
        return;
      let pic = await pictureStore.fetchPictureById(pictureId);
      if (pic !== undefined) {
        pixels.value = pictureDataToPixels(pic.picture_data);
      }
    };

    const connectSocket = async () => {
      if (pictureId && authStore.token !== "") {
        if (socket.value) {
          console.log('Socket already connected');
          return;
        }

        socket.value = io(SOCKET_URL, { transports: ["websocket"] });

        socket.value.emit("join", { pictureId, username: authStore.username, canvas: pixels.value });

        socket.value.on("init", ({ canvas, cursors }) => {
          pixels.value = canvas;
          userCursors.value = cursors;
        });

        socket.value.on("draw", ({ row, col, color }) => {
          pixels.value[row][col].color = color;
        });

        socket.value.on("increase_size", () => {
          const newSize = pixels.value.length + 1;
          if (newSize > CANVAS_MAX_SIZE) return;
          console.log("NEW SIZE: " + newSize)

          pixels.value = Array.from({ length: newSize }, (_, row) =>
            Array.from({ length: newSize }, (_, col) =>
              pixels.value[row]?.[col] || { color: "#FFFFFF" }
            )
          );
        });

        socket.value.on("decrease_size", () => {
          const newSize = pixels.value.length - 1;
          if (newSize < CANVAS_MIN_SIZE) return;
          console.log("NEW SIZE: " + newSize)

          pixels.value = pixels.value
            .slice(0, newSize)
            .map(row => row.slice(0, newSize));
        });

        socket.value.on("update_cursor", ({ username, x, y }) => {
          userCursors.value[username] = { x, y };
        });

        socket.value.on("user_joined", ({ username }) => {
          toast.info(username + " joined")
        })

        socket.value.on("user_left", ({ username }) => {
          toast.info(username + " left")
          delete userCursors.value[username];
        })

      } else if (socket.value) {
        socket.value.disconnect();
        socket.value = null;
        userCursors.value = {};
      }
    };

    watch(() => route.params.pictureId, async (newPictureId, oldPictureId) => {
      if (newPictureId === oldPictureId) return

      if (socket.value) {
        socket.value.disconnect();
        socket.value = null;
      }
      await fetchPictureData();
      await connectSocket();
    }, { immediate: true });

    onMounted(async () => {
      await fetchPictureData();
      await connectSocket()
    });

    onBeforeUnmount(() => {
      if (socket.value) {
        socket.value.disconnect();
        socket.value = null;
      }
      userCursors.value = {};
    });

    return {
      pixels,
      pixelSize,
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
      userCursors,
      trackCursorPosition
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

.cursor {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.cursor-icon {
  font-size: 16px;
  color: black;
}

.cursor-username {
  font-size: 14px;
  color: red;
  margin-top: 2px;
}
</style>