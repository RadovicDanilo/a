import { defineStore } from "pinia";
import axios from "axios";
import type {
    UserCreationReq,
    UserCreationRes,
    LoginReq,
    LoginRes
} from "@/types/auth";

const API_BASE_URL = "https://raf-pixeldraw.aarsen.me/api";

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