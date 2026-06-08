<template>
  <BaseCard>
    <h5 class="text-center text-xl font-bold text-gray-800 mb-6">Register</h5>
    
    <div 
      v-if="showSuccess"
      class="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-center shadow-sm"
    >
      <div class="flex flex-col items-center gap-2">
        <p class="font-medium">Registration Successful!</p>
        <p class="text-sm text-emerald-600/80">Redirecting to login page...</p>
      </div>
    </div>

    <form 
      v-else @submit.prevent="handleRegister"
      class="space-y-4 text-start"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input 
          v-model="form.username" 
          type="text" 
          placeholder="Choose a username" 
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 shadow-sm focus:shadow-emerald-500/10
                 transition duration-200"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input 
          v-model="form.realname" 
          type="text" 
          placeholder="Enter your real name" 
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 shadow-sm focus:shadow-emerald-500/10
                 transition duration-200"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="name@example.com" 
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 shadow-sm focus:shadow-emerald-500/10
                 transition duration-200"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input 
          v-model="form.phoneNumber" 
          type="text" 
          placeholder="e.g. +44 7123 456789" 
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 shadow-sm focus:shadow-emerald-500/10
                 transition duration-200"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          v-model="form.password" 
          type="password" 
          placeholder="Create a strong password" 
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 shadow-sm focus:shadow-emerald-500/10
                 transition duration-200"
        >
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 
               text-white font-medium py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg
               focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
               disabled:opacity-60 disabled:cursor-not-allowed
               transition duration-200 mt-2"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating account...
        </span>
        <span v-else>Register</span>
      </button>
    </form>
    
    <div class="text-center mt-6">
      <router-link 
        to="/login"
        class="text-sm font-medium text-emerald-600 hover:text-emerald-500 underline underline-offset-4 transition"
      >
        Back to Login
      </router-link>
    </div>
    <div 
      v-if="errorMsg" 
      class="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center font-medium"
    >
      {{ errorMsg }}
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import http from '../api/http';
import BaseCard from '../components/BaseCard.vue';

const router = useRouter();
const form = reactive({
  username: '',
  realname: '',
  email: '',
  phoneNumber: '',
  password: ''
});
const errorMsg = ref('');
const showSuccess = ref(false);
const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await http.post('/auth/register', form);
    if (res.data.success) {
      showSuccess.value = true;
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      errorMsg.value = res.data.message || 'Registration failed';
    }
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || err.message || 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>