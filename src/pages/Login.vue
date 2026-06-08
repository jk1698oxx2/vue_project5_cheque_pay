<template>
  <BaseCard>
    <form @submit.prevent="handleLogin" class="space-y-4 text-start">
      <input 
        v-model="form.username" 
        type="text" 
        placeholder="Username" 
        required
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                 focus:outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 
                 shadow-sm focus:shadow-indigo-500/10 transition duration-200" 
      >
      <input 
        v-model="form.password" 
        type="password" 
        placeholder="Password" 
        required
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                 focus:outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 
                 shadow-sm focus:shadow-indigo-500/10 transition duration-200"
      >
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-linear-to-r from-indigo-500 to-blue-500 hover:from-indigo-700 hover:to-blue-700 
               text-white font-medium py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg
               focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
               disabled:opacity-60 disabled:cursor-not-allowed
               transition duration-200 mt-2" 
      >
        Login
      </button>
    </form>
    <div class="text-center mt-4 space-y-3">
      <router-link 
        to="/register"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-500 underline underline-offset-4 transition"
        >
        Don't have an account? Sign Up
      </router-link>
      <p class="text-sm font-medium text-yellow-500 mt-2">
        Join now and claim your £5,000 bonus🎉
      </p>
    </div>
    <div 
      v-if="errorMsg"
      class="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center font-medium animate-pulse"
    >
      {{ errorMsg }}
    </div>
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