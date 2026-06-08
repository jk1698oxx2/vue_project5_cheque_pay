<template>
  <BaseCard :showLogo="false">
    <h5 class="text-center text-xl font-bold text-gray-800 mb-6">Issue a Cheque</h5>

    <form 
      v-if="!issuedCheque" 
      @submit.prevent="issueCheque" 
      class="space-y-4 text-start"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Payee Username</label>
        <input 
          v-model="form.payeeUsername" 
          type="text" 
          required
          placeholder="Enter receiver's username"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 shadow-sm focus:shadow-emerald-500/10
                 transition duration-200"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Payee Full Name</label>
        <input 
          v-model="form.payeeRealname" 
          type="text" 
          required
          placeholder="Enter receiver's full name"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 shadow-sm focus:shadow-emerald-500/10
                 transition duration-200"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
        <input 
          v-model="form.amount" 
          type="number" 
          required
          placeholder="0.00"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 font-mono
                 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 shadow-sm focus:shadow-emerald-500/10
                 transition duration-200"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
        <input 
          v-model="form.expiryDate" 
          type="datetime-local" 
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
          Issuing...
        </span>
        <span v-else>Issue Cheque</span>
      </button>
    </form>

    <div v-else class="space-y-5 text-start">
      
      <div class="bg-linear-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
        
        <div class="flex items-center gap-2 text-emerald-700 font-bold mb-3">
          <span>🎉</span> Cheque Issued Successfully!
        </div>
        
        <div class="space-y-2 text-xs text-gray-600">
          <div class="flex justify-between border-b border-gray-200/60 pb-1.5">
            <span class="font-medium">Cheque ID</span>
            <span class="font-semibold text-gray-900 font-mono select-all">{{ issuedCheque.id }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-200/60 pb-1.5">
            <span class="font-medium">Payee</span>
            <span class="font-semibold text-gray-900">{{ issuedCheque.payeeRealname }} ({{ issuedCheque.payeeUsername }})</span>
          </div>
          <div class="flex justify-between border-b border-gray-200/60 pb-1.5">
            <span class="font-medium">Amount</span>
            <span class="font-bold text-emerald-600 text-sm font-mono">£{{ issuedCheque.amount }}</span>
          </div>
          <div class="flex justify-between pt-0.5">
            <span class="font-medium">Expiry Date</span>
            <span class="font-semibold text-gray-900 font-mono">{{ issuedCheque.expiryDate }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <button 
          :disabled="qrLoading"
          @click="generateQR"
          class="w-full bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 
                 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition"
        >
          {{ qrLoading ? 'Generating...' : 'Generate QR Code' }}
        </button>

        <div class="space-y-2">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Recipient</label>
          <div class="flex gap-2">
            <input 
              v-model="emailInput" 
              type="email" 
              placeholder="Enter recipient email" 
              class="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition"
            >
            <button 
              :disabled="emailLoading"
              @click="sendEmail"
              class="bg-white border border-gray-200 hover:border-sky-200 text-gray-700 hover:text-sky-600 font-medium px-4 rounded-xl text-sm transition hover:bg-sky-50/30 whitespace-nowrap"
            >
              Send Email
            </button>
          </div>
        </div>
        
        <div 
          v-if="emailStatus" 
          v-html="emailStatus"
          class="text-center text-xs font-medium text-gray-600 mt-1"
        ></div>
      </div>

      <div 
        v-if="qrCodeBase64" 
        class="flex flex-col items-center bg-white border border-gray-100 rounded-xl p-4 shadow-inner text-center mx-auto"
      >
        <img 
          :src="`data:image/png;base64,${qrCodeBase64}`" 
          alt="QR Code" 
          class="w-full max-w-[180px] h-auto p-2 bg-white border border-gray-200 rounded-lg"
        />
        <div class="mt-3 w-full">
          <a 
            :href="`data:image/png;base64,${qrCodeBase64}`" 
            download="cheque_qr.png" 
            class="inline-block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl text-xs transition"
          >
            Download QR Code
          </a>
        </div>
      </div>
    </div>

    <div 
      v-if="errorMsg" 
      class="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center font-medium"
    >
      ⚠️ {{ errorMsg }}
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import http from '../api/http';
import BaseCard from '../components/BaseCard.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  payeeUsername: '',
  payeeRealname: '',
  amount: '',
  expiryDate: ''
});

const issuedCheque = ref<any>(null);
const qrCodeBase64 = ref<string | null>(null);
const emailInput = ref('');
const emailStatus = ref('');
const errorMsg = ref('');

const loading = ref(false);
const qrLoading = ref(false);
const emailLoading = ref(false);

const issueCheque = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const payload = {
      ...form,
      amount: parseFloat(form.amount)
    };
    const res = await http.post('/cheques', payload);
    issuedCheque.value = res.data;
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Payee full name does not match the account';
  } finally {
    loading.value = false;
  }
};

const generateQR = async () => {
  if (!issuedCheque.value) return;
  qrLoading.value = true;
  try {
    const res = await http.post(`/transfer/qr?chequeId=${issuedCheque.value.id}`);
    qrCodeBase64.value = res.data.qrCodeBase64;
  } catch (err) {
    errorMsg.value = '❌ Failed to generate QR Code';
  } finally {
    qrLoading.value = false;
  }
};

const sendEmail = async () => {
  if (!issuedCheque.value || !emailInput.value) {
    emailStatus.value = '<span class="text-danger">❌ Please enter an email</span>';
    return;
  }
  emailLoading.value = true;
  emailStatus.value = '<span class="text-info">Sending...</span>';
  try {
    await http.post(`/transfer/email?chequeId=${issuedCheque.value.id}&email=${encodeURIComponent(emailInput.value)}`);
    emailStatus.value = '<span class="text-success">✅ Email sent successfully!</span>';
  } catch (err) {
    emailStatus.value = '<span class="text-danger">❌ Failed to send email</span>';
  } finally {
    emailLoading.value = false;
  }
};
</script>