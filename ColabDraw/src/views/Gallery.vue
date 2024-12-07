<template>
  <div class="gallery-container">
    <v-container>
      <v-row>
        <v-col cols="12" md="6" lg="3" v-for="picture in pictures" :key="picture.picture_id">
          <Picture :picture="picture" @delete="openDeleteDialog" @filter="filterUser" />
        </v-col>
      </v-row>
    </v-container>
    <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" @input="fetchGallery"></v-pagination>
  </div>

  <div v-if="isDialogOpen" class="dialog-overlay">
    <div class="dialog">
      <h2 class="dialog-title">Are you sure?</h2>
      <div class="dialog-actions">
        <button @click="deletePicture(deletingPictureId)" class="dialog-button delete-button">Delete</button>
        <button @click="closeDeleteDialog" class="dialog-button cancel-button">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, Text, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePictureStore } from "@/stores/pictureStore";
import Picture from "@/components/Picture.vue";
import { VContainer, VRow, VCol } from "vuetify/components";
import type { PictureDto } from "@/types/pictures";
import router from "@/router";

export default defineComponent({
  components: {
    Picture,
  },

  setup() {
    const ITEMS_PER_PAGE = 8;

    const pictureStore = usePictureStore();
    const pictures = ref<PictureDto[]>([]);

    const currentPage = ref(1);
    const totalPages = ref(1);
    const route = useRoute();

    const fetchGallery = async () => {
      const userFilter = route.query.user ? String(route.query.user) : undefined;

      await pictureStore.fetchPictures(
        {
          limit: ITEMS_PER_PAGE,
          page: currentPage.value,
          author: userFilter,
          olderFirst: false,
        }
      );
      pictures.value = pictureStore.items;
      totalPages.value = Math.ceil(pictureStore.items.length / ITEMS_PER_PAGE);
    };

    const deletingPictureId = ref("");
    const isDialogOpen = ref(false);

    const openDeleteDialog = async (pictureId: string) => {
      isDialogOpen.value = true;
      deletingPictureId.value = pictureId;
    };

    const closeDeleteDialog = () => {
      isDialogOpen.value = false;
    };

    const deletePicture = async (pictureId: string) => {
      isDialogOpen.value = false
      const success = await pictureStore.deletePicture(pictureId);
      if (success)
        await fetchGallery();
    };

    watch(() => route.query.user, fetchGallery, { immediate: true });

    const filterUser = (userId: string) => {
      router.push({ name: 'gallery', query: { user: userId } });
    };

    onMounted(() => {
      fetchGallery();
    });

    return {
      currentPage,
      totalPages,
      pictures,
      fetchGallery,
      isDialogOpen,
      deletingPictureId,
      openDeleteDialog,
      closeDeleteDialog,
      deletePicture,
      filterUser,
    };
  },
});
</script>

<style scoped>
.gallery-container {
  margin: 20px auto;
  width: fit-content;
  height: fit-content;
}

.v-pagination {
  margin-top: 20px;
  justify-content: center;
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

.delete-button {
  background-color: #ff0000;
  color: white;
}

.delete-button:hover {
  background-color: #ff2222;
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