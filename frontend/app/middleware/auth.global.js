import { useAuth } from "~~/stores/auth";
import { defineNuxtRouteMiddleware } from "#app";

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth();
  await auth.fetchUser();
});
