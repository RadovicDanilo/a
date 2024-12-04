import { defineStore } from "pinia";
import axios from "axios";
import useToast from "vue-toastification"
import type {
    UserCreationReq,
    UserCreationRes,
    LoginReq,
    LoginRes
} from "@/types/auth";

const API_BASE_URL = "https://raf-pixeldraw.aarsen.me/api";

const toast = useToast()

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorCode = error.response?.data?.code;
        let errorMessage = "An unexpected error occurred.";

        switch (errorCode) {
            case "DUPLICATE_USERNAME":
                errorMessage = "Usernam is alredy taken.";
                break;
            case "LOGGED_IN":
                errorMessage = "Alredy logged in.";
                break;
            case "INCORRECT_CREDENTIALS":
                errorMessage = "Wrong username or password.";
                break;
            case "INVALID_DATA":
                errorMessage = "Invalid data.";
                break;
            default:
                break;
        }

        toast.error(errorMessage);

        return Promise.reject(error);
    }
);

export const useAuthStore = defineStore({
    id: "auth",

    state: () => ({
        token: "",
        user_id: "",
        username: "",
    }),

    actions: {
        async login(LoginReq: LoginReq) {
            try {
                const response = await axios.post<LoginRes>(
                    `${API_BASE_URL}/auth/login`,
                    LoginReq
                );
                this.token = response.data.token;
                this.user_id = response.data.user_id;
                this.username = response.data.username;
                return true;
            } catch (error) {
                console.log("Failed to login", error)
                return false;
            }
        },

        async register(UserCreationReq: UserCreationReq) {
            try {
                const response = await axios.post<UserCreationRes>(
                    `${API_BASE_URL}/auth/register`,
                    UserCreationReq
                );
                return true;
            } catch (error) {
                console.log("Failed to register", error)
                return false;;
            }
        },

        logout() {
            this.token = "";
            this.user_id = "";
            this.username = "";
        },
    }
})