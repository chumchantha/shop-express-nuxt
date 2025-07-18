<template>
  <section class="flex flex-col justify-center items-start gap-4 m-4">
    <h1 class="text-2xl font-extrabold">Top Up</h1>
    <form @submit.prevent="handleSubmit">
      <UInput v-model="amount" type="number" required />
      <UButton type="submit">Submit</UButton>
    </form>

    <ClientOnly>
      <p v-if="auth.user">{{ Number(auth.user.balance ?? 0).toFixed(2) }}$</p>
      <pre v-else>Loading...</pre>
    </ClientOnly>
    <div v-if="isPaid && paidAmount">
      <p>Paid: {{ paidAmount }}$</p>
    </div>
    <div v-else>
      <h2>KHQR</h2>
      <p v-if="qrCode">
        {{ qrCode }}
      </p>
      <div v-if="qrCode">
        <h2 class="text-lg font-semibold">Scan with Bakong</h2>
        <canvas ref="qrCanvas" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuth } from "~~/stores/auth";
import QRCode from "qrcode";

const auth = useAuth();
const amount = ref(null);
const qrCode = ref("");
const md5 = ref("");
const qrCanvas = ref(null);
const isPaid = ref(false);
const paidAmount = ref(null);

async function handleSubmit() {
  isPaid.value = false;

  try {
    const { data } = await $fetch("http://localhost:8080/top-up", {
      method: "POST",
      credentials: "include",
      body: {
        amount: Number(amount.value),
      },
    });

    qrCode.value = data.qr;
    md5.value = data.md5;

    await nextTick();

    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, qrCode.value, {
        width: 300,
      });
    }

    startPolling();

    amount.value = null;
  } catch (err) {
    console.log(err);
    qrCode.value = "";
    md5.value = "";
  }
}
//Polling keep loop refetch verify
function startPolling() {
  paidAmount.value = null;
  const poll = setInterval(async () => {
    const res = await $fetch(
      `http://localhost:8080/top-up/verify/${md5.value}`,
      {
        credentials: "include",
      }
    );

    console.log(res);
    if (res.success) {
      clearInterval(poll);
      await auth.refreshUser();

      paidAmount.value = res.amount;
      isPaid.value = true;
    }
  }, 4000); //every 4s : 1000 = 1s
}
</script>
