<template>
  <BaseCard>
    <h5 class="text-center text-xl font-bold text-gray-800 mb-6">User Profile</h5>

    <div 
      v-if="loading" 
      class="flex justify-center items-center py-8"
    >
      <svg 
        class="animate-spin h-6 w-6 text-indigo-600" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div 
      v-else-if="profile" 
      class="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3.5 text-sm"
    >
      <div class="flex items-center justify-between pb-3 border-b border-gray-200/60">
        <span class="font-medium text-gray-500">Username</span>
        <span class="font-semibold text-gray-800 font-mono">{{ profile.username }}</span>
      </div>

      <div class="flex items-center justify-between pb-3 border-b border-gray-200/60">
        <span class="font-medium text-gray-500">Full Name</span>
        <span class="font-semibold text-gray-800">{{ profile.realname }}</span>
      </div>

      <div class="flex items-center justify-between pb-3 border-b border-gray-200/60">
        <span class="font-medium text-gray-500">Email Address</span>
        <span class="font-semibold text-gray-800">{{ profile.email }}</span>
      </div>

      <div class="flex items-center justify-between">
        <span class="font-medium text-gray-500">Phone Number</span>
        <span class="font-semibold text-gray-800 font-mono">{{ profile.phoneNumber }}</span>
      </div>
    </div>

    <div 
      v-if="errorMsg" 
      class="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center font-medium"
    >
      ⚠️ {{ errorMsg }}
    </div>

    <div class="grid grid-cols-1 gap-3 mt-6">
      
      <button 
        @click="router.push('/')"
        class="w-full bg-white border border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-600 font-medium py-2.5 px-4 rounded-xl shadow-sm hover:bg-indigo-50/30
               focus:outline-none focus:ring-4 focus:ring-indigo-500/5
               transition duration-200 text-sm"
      >
        Back to Dashboard
      </button>

      <button 
        @click="authStore.logout()"
        class="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 px-4 rounded-xl
               focus:outline-none focus:ring-4 focus:ring-red-500/10
               transition duration-200 text-sm"
      >
        Logout
      </button>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import http from '../api/http';
import BaseCard from '../components/BaseCard.vue';
import type { UserProfile } from '../types/type.ts';

const router = useRouter();
const authStore = useAuthStore();

const profile = ref<UserProfile | null>(null);
const errorMsg = ref('');
const loading = ref(true);

const loadProfile = async () => {
  errorMsg.value = '';
  loading.value = true;
  try {
    const res = await http.get('/auth/profile');
    profile.value = res.data;
  } catch (err: any) {
    console.error('Failed to load profile:', err);
    errorMsg.value = err.response?.data?.message || 'Failed to load profile.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-item strong {
  display: inline-block;
  width: 100px;
}
</style>