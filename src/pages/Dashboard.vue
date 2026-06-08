<template>
  <BaseCard>
    <h5 class="text-start text-lg font-medium text-gray-600">
      Welcome, 
        <span class="font-bold text-gray-900">{{ authStore.realname || 'User' }}</span>
    </h5>
    <div class="bg-linear-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-xl p-5 my-5 text-center shadow-sm">
      <p class="text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1">
        Balance: 
          <div class="text-3xl font-extrabold text-emerald-600 font-mono">
            <span>£{{ authStore.balance.toFixed(2) }}</span>
          </div>
      </p>
    </div>

    <div class="grid grid-cols-1 gap-3">
      <button 
        @click="router.push('/profile')"
        class="w-full bg-white border border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-600 font-medium py-3 px-4 rounded-xl shadow-sm hover:shadow-indigo-500/5 hover:bg-indigo-50/30
               focus:outline-none focus:ring-4 focus:ring-indigo-500/5
               transition duration-200 text-sm"
      >
        👤 Profile
      </button>

      <button 
        @click="router.push('/issue')"
        class="w-full bg-white border border-gray-200 hover:border-emerald-200 text-gray-700 hover:text-emerald-600 font-medium py-3 px-4 rounded-xl shadow-sm hover:shadow-emerald-500/5 hover:bg-emerald-50/30
               focus:outline-none focus:ring-4 focus:ring-emerald-500/5
               transition duration-200 text-sm"
      >
        ✍️ Issue Cheque
      </button>

      <button 
        @click="router.push('/redeem')"
        class="w-full bg-white border border-gray-200 hover:border-cyan-200 text-gray-700 hover:text-cyan-600 font-medium py-3 px-4 rounded-xl shadow-sm hover:shadow-cyan-500/5 hover:bg-cyan-50/30
               focus:outline-none focus:ring-4 focus:ring-cyan-500/5
               transition duration-200 text-sm"
      >
        💰 Redeem Cheque
      </button>

      <button 
        @click="router.push('/split')"
        class="w-full bg-white border border-gray-200 hover:border-amber-200 text-gray-700 hover:text-amber-600 font-medium py-3 px-4 rounded-xl shadow-sm hover:shadow-amber-500/5 hover:bg-amber-50/30
               focus:outline-none focus:ring-4 focus:ring-amber-500/5
               transition duration-200 text-sm"
      >
        ✂️ Split Cheque
      </button>

      <button 
        @click="router.push('/void')"
        class=" w-full bg-white border border-gray-200 hover:border-gray-100 text-gray-700 hover:text-gray-400 font-medium py-2.5 px-4 rounded-xl shadow-sm hover:bg-gray-50
               focus:outline-none focus:ring-4 focus:ring-gray-500/5
               transition duration-200 text-sm"
      >
        🚫 Void Cheque
      </button>
    </div>

    <button 
      @click="authStore.logout()"
      class="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 px-4 rounded-xl mt-4
             focus:outline-none focus:ring-4 focus:ring-red-500/10
             transition duration-200 text-sm"
    >
      Logout
    </button>
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