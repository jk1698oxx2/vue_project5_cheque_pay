<template>
  <BaseCard :showLogo="false">
    <h5 class="text-center fw-bold mb-3">Redeem Cheque</h5>

    <div id="reader" class="mb-3"></div>

    <ChequeInfo v-if="cheque" title="Cheque Information" :cheque="cheque">
      <div class="d-grid gap-2 mt-3">
        <button class="btn btn-warning" @click="verifyCheque" :disabled="loading">Verify Cheque</button>
        <button class="btn btn-success" @click="settleCheque" :disabled="loading">Redeem Cheque</button>
      </div>
    </ChequeInfo>

    <div v-if="resultMsg" class="mt-3 text-center text-success">{{ resultMsg }}</div>
    <div v-if="errorMsg" class="mt-3 text-center text-danger">{{ errorMsg }}</div>

    <div class="d-grid gap-2 mt-4">
      <button class="btn btn-outline-primary" @click="router.push('/')">Back to Dashboard</button>
      <button class="btn btn-danger" @click="authStore.logout()">Logout</button>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import { useQrScanner } from '../composables/useQrScanner';
import http from '../api/http';
import type { Cheque } from '../types/type.ts';
import BaseCard from '../components/BaseCard.vue';
import ChequeInfo from '../components/ChequeInfo.vue';

const router = useRouter();
const authStore = useAuthStore();
const cheque = ref<Cheque | null>(null);
const resultMsg = ref('');
const errorMsg = ref('');
const loading = ref(false);

useQrScanner('reader', (decodedText) => {
  try {
    const chequeObj = JSON.parse(decodedText);
    loadCheque(chequeObj.chequeId);
  } catch (e) {
    errorMsg.value = 'Invalid QR Code format';
  }
});

const loadCheque = async (id: string) => {
  try {
    const res = await http.get(`/cheques/${id}`);
    cheque.value = res.data;
    resultMsg.value = '';
    errorMsg.value = '';
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || '❌ Failed to load cheque';
  }
};

const verifyCheque = async () => {
  if (!cheque.value) return;
  loading.value = true;
  resultMsg.value = '';
  errorMsg.value = '';
  
  try {
    const res = await http.post(`/clearing/verify?chequeId=${cheque.value.id}`);
    
    if (res.data.success) {
      resultMsg.value = `✅ ${res.data.message || 'Cheque verified successfully!'}`;
    } else {
      errorMsg.value = `❌ ${res.data.message || 'Verification failed'}`;
    }
  } catch (err: any) {
    console.error('Verification error:', err);
    
    const serverMessage = err.response?.data?.message;
    errorMsg.value = serverMessage ? `❌ ${serverMessage}` : '❌ Verification error occured.';
  } finally {
    loading.value = false;
  }
};

const settleCheque = async () => {
  if (!cheque.value) return;
  loading.value = true;
  resultMsg.value = '';
  errorMsg.value = '';
  
  try {
    const res = await http.post(`/clearing/settle?chequeId=${cheque.value.id}`);
    
    if (res.data.success) {
      resultMsg.value = `✅ ${res.data.message || 'Cheque redeemed successfully!'}`;
      cheque.value.status = 'Settled';
    } else {
      errorMsg.value = `❌ ${res.data.message || 'Redemption failed'}`;
    }
  } catch (err: any) {
    console.error('Redemption error:', err);
    
    const serverMessage = err.response?.data?.message;
    errorMsg.value = serverMessage ? `❌ ${serverMessage}` : '❌ Redemption error occured.';
  } finally {
    loading.value = false;
  }
};
</script>