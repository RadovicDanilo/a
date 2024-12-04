<template>
  <v-container class="d-flex justify-center align-center">
    <v-card class="elevation-3 px-6 py-6" max-width="800">
      <v-card-title class="text-h4 text-center">Register a new account</v-card-title>
      <v-card-subtitle class="text-p6 text-center">Pick your username and password below</v-card-subtitle>
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-text-field label="Username" v-model="username" :error-messages="usernameError" dense></v-text-field>
          <v-text-field label="Password" v-model="password" type="password" :error-messages="passwordError" outlined
            dense></v-text-field>
          <v-btn type="submit" class="mt-4" color="primary" block>
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "@/stores/authStore";
import router from "@/router";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();

    const validationSchema = yup.object({
      username: yup.string().min(2).max(32).required("Username is required"),
      password: yup.string().min(8).max(128).required("Password is required"),
    });

    const { handleSubmit } = useForm({ validationSchema });

    const { value: username, errorMessage: usernameError } = useField<string>("username");
    const { value: password, errorMessage: passwordError } = useField<string>("password");

    const onSubmit = handleSubmit(async (values) => {
      const loginReq = {
        username: values.username,
        password: values.password
      }
      const success = authStore.login(loginReq);
      if (!success) {
        return;
      }
      router.push("gallery");
    });

    return {
      username,
      usernameError,
      password,
      passwordError,
      onSubmit,
    };
  },
});
</script>

<style>
.min-vh-100 {
  min-height: 100vh;
}
</style>