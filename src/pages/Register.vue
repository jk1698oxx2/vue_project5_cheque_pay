<template>
  <BaseCard>
    <h5 class="text-center fw-bold mb-3">Register</h5>
    
    <div v-if="showSuccess" class="alert alert-success text-center">
      Registration Successful! Redirecting to login...
    </div>

    <form v-else @submit.prevent="handleRegister">
      <input v-model="form.username" type="text" class="form-control mb-3" placeholder="Username" required>
      <input v-model="form.realname" type="text" class="form-control mb-3" placeholder="Full Name" required>
      <input v-model="form.email" type="email" class="form-control mb-3" placeholder="Email" required>
      <input v-model="form.phoneNumber" type="text" class="form-control mb-3" placeholder="Phone Number" required>
      <input v-model="form.password" type="password" class="form-control mb-3" placeholder="Password" required>
      <button type="submit" class="btn btn-success w-100" :disabled="loading">Register</button>
    </form>
    
    <div class="text-center mt-3">
      <router-link to="/login">Back to Login</router-link>
    </div>
    <div v-if="errorMsg" class="text-danger text-center mt-2">{{ errorMsg }}</div>
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