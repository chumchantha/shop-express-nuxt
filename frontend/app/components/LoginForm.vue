<template>
  <form
    class="flex flex-col max-w-7xl mx-auto justify-center items-center gap-4"
    @submit.prevent="handleLogin"
  >
    <h2 class="text-bold text-xl">Login Page</h2>
    <UInput v-model="username" placeholder="Username" type="text" />
    <UInput v-model="password" placeholder="Password" type="text" />
    <UButton type="submit">Submit</UButton>
  </form>
</template>

<script setup>
import { useAuth } from "~~/stores/auth";

const username = ref("");
const password = ref("");

const auth = useAuth();

async function handleLogin() {
  await auth.login({
    username: username.value,
    password: password.value,
  });
  if (auth.user) {
    alert(auth.user.username);
  }
}

// onMounted(async () => {
//   await auth.fetchUser();
// });
</script>
