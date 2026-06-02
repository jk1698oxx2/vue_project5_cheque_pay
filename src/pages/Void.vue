<template>
  <BaseCard :showLogo="false">
    <h5 class="text-center fw-bold mb-3">Void Cheque</h5>

    <div id="reader" class="mb-3" v-show="!cheque"></div>

    <ChequeInfo v-if="cheque" title="Cheque Information" :cheque="cheque">
      <div class="d-grid gap-2 mt-3" v-if="cheque.status !== 'Voided'">
        <button class="btn btn-outline-secondary" @click="cancelCheque" :disabled="loading">Void Cheque</button>
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