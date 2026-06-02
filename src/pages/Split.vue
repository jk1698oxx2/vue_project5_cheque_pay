<template>
  <BaseCard :showLogo="false">
    <h5 class="text-center fw-bold mb-3">Split Cheque</h5>

    <div id="reader" class="mb-3" v-show="!cheque"></div>

    <ChequeInfo v-if="cheque" title="Original Cheque" :cheque="cheque">
      <div class="mt-3" v-if="!newCheques.length">
        <label class="form-label">Split Amounts (comma separated)</label>
        <input v-model="splitAmountsInput" type="text" class="form-control" placeholder="e.g. 1000, 1000">
        <div class="d-grid gap-2 mt-3">
          <button class="btn btn-primary" @click="splitCheque" :disabled="loading">Split Cheque</button>
        </div>
      </div>
    </ChequeInfo>

    <div v-if="newCheques.length > 0" class="mt-4">
      <h6>New Cheques</h6>
      <div class="row">
        <div v-for="c in newCheques" :key="c.id" class="col-md-6 mb-3">
          <div class="card p-2">
            <p class="mb-1"><b>ID:</b> <span class="small">{{ c.id }}</span></p>
            <p class="mb-1"><b>Amount:</b> £{{ c.amount }}</p>
            <img v-if="c.qrCodeBase64" :src="`data:image/png;base64,${c.qrCodeBase64}`" class="qr-preview w-100 mb-2"/>
            <div class="d-grid gap-2">
              <a class="btn btn-sm btn-outline-success" :download="`cheque-${c.id}.png`" :href="`data:image/png;base64,${c.qrCodeBase64}`">Download QR</a>
              <button class="btn btn-sm btn-outline-primary" @click="sendEmailForSplit(c.id)">Send Email</button>
            </div>
            <div :id="`emailMsg-${c.id}`" class="mt-2 small text-center"></div>
          </div>
        </div>
      </div>
    </div>

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