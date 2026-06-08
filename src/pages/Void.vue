<template>
  <BaseCard :showLogo="false">
    <h5 class="text-center text-xl font-bold text-gray-800 mb-6">Void Cheque</h5>

    <div 
      v-show="!cheque"
      id="reader" 
      class="w-full bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-inner text-center [&_img]:mx-auto [&_video]:mx-auto p-4 mb-5"
    ></div>

    <ChequeInfo 
      v-if="cheque" 
      title="Cheque Information" 
      :cheque="cheque"
    >
      <div 
        v-if="cheque.status !== 'Voided'" 
        class="grid grid-cols-1 gap-3 mt-5"
      >
        <button 
          type="button"
          :disabled="loading"
          @click="cancelCheque"
          class="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 font-medium py-2.5 px-4 rounded-xl shadow-sm
                 focus:outline-none focus:ring-4 focus:ring-gray-400/10
                 disabled:opacity-60 disabled:cursor-not-allowed
                 transition duration-200 text-sm"
        >
          Void Cheque
        </button>
      </div>
    </ChequeInfo>

    <div 
      v-if="resultMsg" 
      class="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl text-center font-medium animate-pulse"
    >
      {{ resultMsg }}
    </div>

    <div 
      v-if="errorMsg" 
      class="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl text-center font-medium"
    >
      {{ errorMsg }}
    </div>

    <div class="grid grid-cols-1 gap-3 mt-6 border-t border-gray-100 pt-4">
      
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import { useQrScanner } from '../composables/useQrScanner';
import http from '../api/http';
import BaseCard from '../components/BaseCard.vue';
import ChequeInfo from '../components/ChequeInfo.vue';
import type { Cheque } from '../types/type.ts';

const router = useRouter();
const authStore = useAuthStore();
const cheque = ref<Cheque | null>(null);
const resultMsg = ref('');
const errorMsg = ref('');
const loading = ref(false);

useQrScanner('reader', (decodedText) => {
  try {
    const obj = JSON.parse(decodedText);
    loadCheque(obj.chequeId);
  } catch (e) {
    errorMsg.value = 'Invalid QR format';
  }
});

const loadCheque = async (id: string) => {
  try {
    const res = await http.get(`/cheques/${id}`);
    cheque.value = res.data;
    errorMsg.value = '';
    resultMsg.value = '';
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || '❌ Failed to load cheque';
  }
};

const cancelCheque = async () => {
  if (!cheque.value) return;
  loading.value = true;
  try {
    await http.patch(`/cheques/${cheque.value.id}/status?status=Voided`);
    resultMsg.value = '✅ Cheque voided successfully!';
    errorMsg.value = '';
    cheque.value.status = 'Voided';
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || '❌ Failed to void cheque';
  } finally {
    loading.value = false;
  }
};
</script>