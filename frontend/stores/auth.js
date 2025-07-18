import { defineStore } from "pinia";

export const useAuth = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    isLogin: false,
  }),
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        await $fetch("http://localhost:8080/auth/login", {
          method: "POST",
          body: credentials,
          credentials: "include",
        });
        await this.fetchUser();
      } catch (err) {
        this.error = err.msg || err.message || "Failed to login!";
      } finally {
        this.loading = false;
      }
    },
    async fetchUser() {
      this.loading = true;
      this.error = null;
      try {
        const { user } = await $fetch("http://localhost:8080/auth/me", {
          credentials: "include",
        });
        this.user = user;
        this.isLogin = true;
        return user;
      } catch (err) {
        this.user = null;
        this.error = err.msg || err.message || "Failed to fetch user!";
      } finally {
        this.loading = false;
      }
    },
    async refreshUser() {
      // Calls fetchUser to update the user state from backend
      return await this.fetchUser();
    },
  },
});
