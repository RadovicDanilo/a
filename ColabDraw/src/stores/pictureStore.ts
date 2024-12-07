import { defineStore } from "pinia";
import axios from "@/stores/axiosConfig";
import { find, filter } from "lodash";
import { useToast } from "vue-toastification";
import type { BasePictureDto, PictureDto, NewPictureReq, PictureListingPage } from "@/types/pictures";

const toast = useToast();

export const usePictureStore = defineStore({
  id: "pictures",

  state: () => ({
    items: [] as PictureDto[],
  }),

  getters: {
    getPictureById: (state) => (id: string) => find(state.items, { picture_id: id }),
  },

  actions: {
    async fetchPictures(params: { limit?: number; page?: number; author?: string; olderFirst?: boolean } = {}) {
      try {
        const response = await axios.get<PictureListingPage>("/pictures", {
          params: {
            limit: params.limit,
            page: params.page,
            author: params.author,
            older_first: params.olderFirst,
          },
        });
        this.items = response.data.pictures;
      } catch { }
    },

    async fetchPictureById(pictureId: string) {
      const existingPicture = this.getPictureById(pictureId);
      if (existingPicture) return existingPicture;
      try {
        const response = await axios.get<{ picture: PictureDto }>(`/pictures/${pictureId}`);
        this.items.push(response.data.picture);
        return response.data.picture;
      } catch { }
    },

    async createPicture(newPicture: NewPictureReq) {
      try {
        const response = await axios.post<{ picture_id: string }>("/pictures", newPicture);
        await this.fetchPictureById(response.data.picture_id);
        toast.success("Picture created successfully.");
      } catch { }
    },

    async updatePicture(pictureId: string, updates: Partial<BasePictureDto>) {
      try {
        await axios.patch(`/pictures/${pictureId}`, updates);
        this.items = filter(this.items, (p: PictureDto) => p.picture_id !== pictureId);
        await this.fetchPictureById(pictureId);
        toast.success("Picture updated successfully.");
      } catch { }
    },

    async deletePicture(pictureId: string): Promise<boolean> {
      try {
        await axios.delete(`/pictures/${pictureId}`);
        this.items = filter(this.items, (p: PictureDto) => p.picture_id !== pictureId);
        toast.success("Picture deleted successfully.");
        return true;
      } catch {
        return false;
      }
    },
  },
});
