<template>
  <BaseCard>
    <form @submit.prevent="handleLogin">
      <input v-model="form.username" type="text" class="form-control mb-3" placeholder="Username" required>
      <input v-model="form.password" type="password" class="form-control mb-3" placeholder="Password" required>
      <button type="submit" class="btn btn-primary w-100" :disabled="loading">Login</button>
    </form>
    <div class="text-center mt-3">
      <router-link to="/register">Sign Up</router-link>
      <p class="text-warning mt-2">Join now and claim your £5,000 bonus🎉</p>
    </div>
    <div v-if="errorMsg" class="text-danger text-center mt-2">{{ errorMsg }}</div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import http from '../api/http';
import BaseCard from '../components/BaseCard.vue';

const router = useRouter();
const authStore = useAuthStore();
const form = reactive({ username: '', password: '' });
const errorMsg = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await http.post('/auth/login', form);
    if (res.data.success && res.data.token) {
      authStore.setToken(res.data.token);
      router.push('/');
    } else {
      errorMsg.value = res.data.message || 'Invalid credentials';
    }
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>