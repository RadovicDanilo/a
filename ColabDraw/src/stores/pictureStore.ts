import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import { find, filter } from "lodash";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "vue-toastification"
import type {
  BasePictureDto,
  PictureDto,
  NewPictureReq,
  PictureListingPage,
} from "@/types/pictures";

const API_BASE_URL = "https://raf-pixeldraw.aarsen.me/api";

const getAuthToken = () => {
  const authStore = useAuthStore();
  return authStore.token;
};

axios.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const toast = useToast()

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorCode = error.response?.data?.code;
    let errorMessage = "An unexpected error occurred.";

    switch (errorCode) {
      case "BAD_PICTURE_DATA":
        errorMessage = "Picture data is invalid.";
        break;
      case "NOT_AUTHENTICATED":
        errorMessage = "You must be logged in to perform this action.";
        break;
      case "NO_SUCH_ENTITY":
        errorMessage = "The picture does not exist.";
        break;
      case "NOT_YOURS":
        errorMessage = "This picture does not belong to you.";
        break;
      case "INVALID_DATA":
        errorMessage = "Invalid input data. Please check the provided fields.";
        break;
      case "INTERNAL_ERROR":
        errorMessage = "There was an internal error on the server.";
        break;
      default:
        break;
    }

    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export const usePictureStore = defineStore({
  id: "pictures",

  state: () => ({
    items: [] as PictureDto[],
  }),

  getters: {
    getPictureById: (state) => (id: string) =>
      find(state.items, { picture_id: id }),
  },

  actions: {
    async fetchPictures(params: {
      limit?: number;
      page?: number;
      author?: string;
      olderFirst?: boolean;
    } = {}) {
      try {
        const response = await axios.get<PictureListingPage>(`${API_BASE_URL}/pictures`, {
          params: {
            limit: params.limit,
            page: params.page,
            author: params.author,
            older_first: params.olderFirst,
          },
        });

        this.items = response.data.pictures;
      } catch (error) {
        console.error("Failed to fetch pictures", error);
      }
    },

    async fetchPictureById(pictureId: string) {
      const existingPicture = this.getPictureById(pictureId);
      if (existingPicture) return existingPicture;

      try {
        const response = await axios.get<{ picture: PictureDto }>(
          `${API_BASE_URL}/pictures/${pictureId}`
        );
        this.items.push(response.data.picture);
        return response.data.picture;
      } catch (error) {
        console.error("Failed to fetch picture", error);
      }
    },

    async createPicture(newPicture: NewPictureReq) {
      try {
        const response = await axios.post<{ picture_id: string }>(
          `${API_BASE_URL}/pictures`,
          newPicture
        );
        await this.fetchPictureById(response.data.picture_id);
        toast.success("Picture created sucesefully.");
      } catch (error) {
        console.error("Failed to create picture", error);
      }
    },

    async updatePicture(pictureId: string, updates: Partial<BasePictureDto>) {
      try {
        await axios.patch(`${API_BASE_URL}/pictures/${pictureId}`, updates);
        this.items = filter(this.items, (p: PictureDto) => p.picture_id !== pictureId);
        await this.fetchPictureById(pictureId);
        toast.success("Picture updated sucesefully.");
      } catch (error) {
        console.error("Failed to update picture", error);
      }
    },

    async deletePicture(pictureId: string) {
      try {
        await axios.delete(`${API_BASE_URL}/pictures/${pictureId}`);
        this.items = filter(this.items, (p: PictureDto) => p.picture_id !== pictureId);
        toast.success("Picture deleted sucesefully.");
      } catch (error) {
        console.error("Failed to delete picture", error);
      }
    },
  },
});