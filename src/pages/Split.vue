<template>
  <BaseCard :showLogo="false">
    <h5 class="text-center text-xl font-bold text-gray-800 mb-6">Split Cheque</h5>

    <div 
      v-show="!cheque"
      id="reader" 
      class="w-full bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-inner text-center [&_img]:mx-auto [&_video]:mx-auto p-4 mb-5"
    ></div>

    <ChequeInfo 
      v-if="cheque" 
      title="Original Cheque" 
      :cheque="cheque"
    >
      <div 
        v-if="!newCheques.length" 
        class="mt-5 space-y-3 text-start"
      >
        <label class="block text-sm font-medium text-gray-700">
          Split Amounts (comma separated)
        </label>
        
        <input 
          v-model="splitAmountsInput" 
          type="text" 
          placeholder="e.g. 1000, 1000"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 font-mono
                 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 shadow-sm focus:shadow-indigo-500/10
                 transition duration-200"
        >
        
        <div class="grid grid-cols-1 gap-3 pt-2">
          <button 
            type="button"
            :disabled="loading"
            @click="splitCheque"
            class="w-full bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 
                   text-white font-medium py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                   disabled:opacity-60 disabled:cursor-not-allowed
                   transition duration-200 text-sm"
          >
            Split Cheque
          </button>
        </div>
      </div>
    </ChequeInfo>

    <div 
      v-if="newCheques.length > 0" 
      class="mt-6 text-start"
    >
      <h6 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
        New Cheques
      </h6>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          v-for="c in newCheques" 
          :key="c.id"
          class="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
        >
          <div class="space-y-1.5 text-xs text-gray-600 mb-3">
            <p class="flex flex-col">
              <span class="font-medium text-gray-400">ID</span>
              <span class="font-semibold text-gray-900 font-mono break-all select-all">{{ c.id }}</span>
            </p>
            <p class="flex justify-between items-end pt-1 border-t border-gray-100">
              <span class="font-medium text-gray-400">Amount</span>
              <span class="font-bold text-emerald-600 font-mono text-sm">£{{ c.amount }}</span>
            </p>
          </div>

          <div 
            v-if="c.qrCodeBase64" 
            class="bg-gray-50 border border-gray-100 rounded-xl p-2 mb-3 flex justify-center shadow-inner"
          >
            <img 
              :src="`data:image/png;base64,${c.qrCodeBase64}`" 
              alt="QR Code"
              class="w-full max-w-[130px] h-auto"
            />
          </div>

          <div class="grid grid-cols-1 gap-2">
            <a 
              :download="`cheque-${c.id}.png`" 
              :href="`data:image/png;base64,${c.qrCodeBase64}`"
              class="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 px-3 rounded-xl text-xs transition"
            >
              Download QR
            </a>
            
            <button 
              type="button"
              @click="sendEmailForSplit(c.id)"
              class="w-full bg-white border border-gray-200 hover:border-indigo-200 text-gray-600 hover:text-indigo-600 font-medium py-1.5 px-3 rounded-xl text-xs transition hover:bg-indigo-50/30"
            >
              Send Email
            </button>
          </div>

          <div 
            :id="`emailMsg-${c.id}`" 
            class="mt-2 text-center text-[11px] font-medium text-gray-500 min-h-[16px]"
          ></div>
        </div>
      </div>
    </div>

    <div 
      v-if="resultMsg" 
      class="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl text-center font-medium"
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

interface SplitCheque extends Cheque {
  qrCodeBase64?: string;
}

const router = useRouter();
const authStore = useAuthStore();
const cheque = ref<Cheque | null>(null);
const splitAmountsInput = ref('');
const newCheques = ref<SplitCheque[]>([]);
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
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || '❌ Failed to load cheque';
  }
};

const splitCheque = async () => {
  if (!cheque.value) return;
  
  const amounts = splitAmountsInput.value.split(',').map(a => parseFloat(a.trim()));
  if (amounts.some(isNaN)) {
    errorMsg.value = '❌ Invalid amounts format';
    return;
  }

  const total = amounts.reduce((sum, val) => sum + val, 0);
  if (total !== cheque.value.amount) {
    errorMsg.value = `❌ Split amounts must add up to £${cheque.value.amount}. (Current total: £${total})`;
    return;
  }

  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await http.post(`/cheques/${cheque.value.id}/split`, { splitAmounts: amounts });
    const chequesData = res.data;
    for (const c of chequesData) {
      const qrRes = await http.post(`/transfer/qr?chequeId=${c.id}`);
      c.qrCodeBase64 = qrRes.data.qrCodeBase64;
    }
    newCheques.value = chequesData;
    resultMsg.value = '✅ Cheque split successfully!';
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || '❌ Failed to split cheque';
  } finally {
    loading.value = false;
  }
};

const sendEmailForSplit = async (chequeId: string) => {
  const email = prompt("Enter recipient email:");
  if (!email) return;

  const msgEl = document.getElementById(`emailMsg-${chequeId}`);
  if (msgEl) msgEl.innerHTML = `<span class="text-muted">⏳ Sending...</span>`;

  try {
    await http.post(`/transfer/email?chequeId=${chequeId}&email=${encodeURIComponent(email)}`);
    if (msgEl) msgEl.innerHTML = `<span class="text-success">✅ Email sent successfully!</span>`;
  } catch (err) {
    if (msgEl) msgEl.innerHTML = `<span class="text-danger">❌ Failed to send email</span>`;
  }
};
</script>