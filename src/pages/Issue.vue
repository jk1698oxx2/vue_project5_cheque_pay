<template>
  <BaseCard :showLogo="false">
    <h5 class="text-center fw-bold mb-3">Issue a Cheque</h5>

    <form v-if="!issuedCheque" @submit.prevent="issueCheque">
      <div class="mb-3">
        <label class="form-label">Payee Username</label>
        <input v-model="form.payeeUsername" type="text" class="form-control" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Payee Full Name</label>
        <input v-model="form.payeeRealname" type="text" class="form-control" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Amount</label>
        <input v-model="form.amount" type="number" class="form-control" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Expiry Date</label>
        <input v-model="form.expiryDate" type="datetime-local" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-success w-100" :disabled="loading">Issue Cheque</button>
    </form>

    <div v-else>
      <div class="alert alert-success">
        <strong>Cheque Issued Successfully!</strong><br>
        Cheque ID: {{ issuedCheque.id }}<br>
        Payee: {{ issuedCheque.payeeRealname }} ({{ issuedCheque.payeeUsername }})<br>
        Amount: £{{ issuedCheque.amount }}<br>
        Expiry: {{ issuedCheque.expiryDate }}
      </div>

      <div class="d-grid gap-2 mt-3">
        <button class="btn btn-primary" @click="generateQR" :disabled="qrLoading">Generate QR Code</button>
        <input v-model="emailInput" type="email" placeholder="Enter recipient email" class="form-control">
        <button class="btn btn-outline-info" @click="sendEmail" :disabled="emailLoading">Send QR Code via Email</button>
        <div v-if="emailStatus" class="text-center mt-2" v-html="emailStatus"></div>
      </div>

      <div v-if="qrCodeBase64" class="text-center mt-3">
        <img :src="`data:image/png;base64,${qrCodeBase64}`" alt="QR Code" class="qr-preview"/>
        <div class="mt-2">
          <a :href="`data:image/png;base64,${qrCodeBase64}`" download="cheque_qr.png" class="btn btn-outline-success">Download QR Code</a>
        </div>
      </div>
    </div>

    <div v-if="errorMsg" class="mt-3 text-center text-danger">{{ errorMsg }}</div>

    <div class="d-grid gap-2 mt-4">
      <button class="btn btn-outline-primary" @click="router.push('/')">Back to Dashboard</button>
      <button class="btn btn-danger" @click="authStore.logout()">Logout</button>
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