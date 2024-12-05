import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification"
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
        async login(LoginReq: LoginReq): Promise<boolean> {
            try {
                const response = await axios.post<LoginRes>(
                    `${API_BASE_URL}/auth/login`,
                    LoginReq
                );
                this.token = response.data.token;
                this.user_id = response.data.user_id;
                this.username = response.data.username;
                toast.success("Sucesefully loged in.");
                return true;
            } catch (error) {
                return false;
            }
        },

        async register(UserCreationReq: UserCreationReq): Promise<boolean> {
            try {
                const response = await axios.post<UserCreationRes>(
                    `${API_BASE_URL}/auth/register`,
                    UserCreationReq
                );
                toast.success("Sucesefully registered, please log in.");
                return true;
            } catch (error) {
                return false;;
            }
        },

        logout() {
            this.token = "";
            this.user_id = "";
            this.username = "";
            toast.success("Sucesefully loged out");

        },
    }
})