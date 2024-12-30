import axios from "axios";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/authStore";

const API_BASE_URL = "http://localhost:3000";
const toast = useToast();

axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorCode = error.response?.data?.code;
        let errorMessage = "An unexpected error occurred.";

        switch (errorCode) {
            case "DUPLICATE_USERNAME":
                errorMessage = "Username is already taken.";
                break;
            case "BAD_PICTURE_DATA":
                errorMessage = "Picture data is invalid.";
                break;
            case "LOGGED_IN":
                errorMessage = "Already logged in.";
                break;
            case "INCORRECT_CREDENTIALS":
                errorMessage = "Wrong username or password.";
                break;
            case "INVALID_DATA":
                errorMessage = "Invalid data.";
                break;
            case "NO_SUCH_ENTITY":
                errorMessage = "The picture does not exist.";
                break;
            case "NOT_YOURS":
                errorMessage = "This picture does not belong to you.";
                break;
            case "NOT_AUTHENTICATED":
                errorMessage = "You must be logged in to perform this action.";
                break;
            case "INTERNAL_ERROR":
                errorMessage = "There was an internal error on the server.";
                break;
        }

        toast.error(errorMessage);
        return Promise.reject(error);
    }
);

export default axios;
