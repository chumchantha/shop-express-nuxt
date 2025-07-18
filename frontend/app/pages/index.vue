<template>
  <div class="container mx-auto px-4 py-8">
    <client-only>
      <p v-if="auth.isLogin">Welcome {{ `${auth.user.username}` }}</p>
      <pre>{{ user }}</pre>
    </client-only>
  </div>
</template>

<script setup>
import { useAuth } from "~~/stores/auth";


const auth = useAuth();

const user = await auth.user;


</script>
