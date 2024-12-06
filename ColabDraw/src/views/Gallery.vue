<template>
  <div class="gallery-container">
    <v-container>
      <v-row>
        <v-col cols="12" md="6" lg="3" v-for="picture in pictures" :key="picture.picture_id">
          <Picture :picture="picture" @delete="deletePicture" />
        </v-col>
      </v-row>
    </v-container>
    <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" @input="fetchGallery"></v-pagination>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, Text } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePictureStore } from "@/stores/pictureStore";
import Picture from "@/components/Picture.vue";
import { VContainer, VRow, VCol } from "vuetify/components";
import type { PictureDto } from "@/types/pictures";

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
      await pictureStore.fetchPictures(
        {
          limit: ITEMS_PER_PAGE,
          page: currentPage.value,
          author: route.query.user ? String(route.query.user) : undefined,
          olderFirst: false,
        }
      );
      pictures.value = pictureStore.items;
      totalPages.value = Math.ceil(pictureStore.items.length / ITEMS_PER_PAGE);
    };

    const deletePicture = async (pictureId: string) => {
      const success = await pictureStore.deletePicture(pictureId);
      if (success)
        await fetchGallery();
    };

    fetchGallery();

    return {
      currentPage,
      totalPages,
      pictures,
      fetchGallery,
      deletePicture,
    };
  },
});
</script>

<style scoped>
.gallery-container {
  margin: 20px auto;
  max-width: 1200px;
}

.v-pagination {
  margin-top: 20px;
  justify-content: center;
}
</style>
