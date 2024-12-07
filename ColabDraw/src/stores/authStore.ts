import { defineStore } from "pinia";
import axios from "@/stores/axiosConfig";
import { useToast } from "vue-toastification";
import type { UserCreationReq, UserCreationRes, LoginReq, LoginRes } from "@/types/auth";

const toast = useToast();

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
                const response = await axios.post<LoginRes>("/auth/login", LoginReq);
                this.token = response.data.token;
                this.user_id = response.data.user_id;
                this.username = response.data.username;
                toast.success("Successfully logged in.");
                return true;
            } catch {
                return false;
            }
        },

        async register(UserCreationReq: UserCreationReq): Promise<boolean> {
            try {
                await axios.post<UserCreationRes>("/auth/register", UserCreationReq);
                toast.success("Successfully registered, please log in.");
                return true;
            } catch {
                return false;
            }
        },

        logout() {
            this.token = "";
            this.user_id = "";
            this.username = "";
            toast.success("Successfully logged out.");
        },
    },
});
