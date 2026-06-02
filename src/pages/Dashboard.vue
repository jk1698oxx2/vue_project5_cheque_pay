<template>
  <BaseCard>
    <h5>Welcome, <span>{{ authStore.realname || 'User' }}</span></h5>
    <div class="balance">Balance: £<span>{{ authStore.balance.toFixed(2) }}</span></div>

    <button class="btn btn-outline-primary btn-block w-100" @click="router.push('/profile')">Profile</button>
    <button class="btn btn-outline-success btn-block w-100" @click="router.push('/issue')">Issue Cheque</button>
    <button class="btn btn-outline-info btn-block w-100" @click="router.push('/redeem')">Redeem Cheque</button>
    <button class="btn btn-outline-warning btn-block w-100" @click="router.push('/split')">Split Cheque</button>
    <button class="btn btn-outline-secondary btn-block w-100" @click="router.push('/void')">Void Cheque</button>
    <button class="btn btn-danger btn-block w-100 mt-3" @click="authStore.logout()">Logout</button>
  </BaseCard>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import BaseCard from '../components/BaseCard.vue';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchBalance();
});
</script>