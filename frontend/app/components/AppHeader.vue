<template>
  <header class="bg-black">
    <nav class="px-6 h-10 flex justify-start items-center">
      <div class="text-base font-semibold flex gap-4 items-center">
        <NuxtLink to="/" class="w-8">
          <client-only>
            <h2>
              {{ auth.isLogin ? `${auth.user.username}` : "Name" }}
            </h2>
          </client-only>
        </NuxtLink>
        <ul v-for="list in navList" :key="list.name">
          <li>
            <NuxtLink :to="list.label">{{ list.name }}</NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuth } from "~~/stores/auth";

const navList = [
  {
    name: "Home",
    label: "/",
  },
  {
    name: "Movie",
    label: "/movie",
  },
  {
    name: "Login",
    label: "/login",
  },
  {
    name: "TopUp",
    label: "/top-up",
  },
];

const auth = useAuth();
</script>
