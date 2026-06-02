<template>
  <BaseCard>
    <h5 class="text-center fw-bold mb-3">User Profile</h5>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="profile" class="text-start">
      <div class="profile-item mb-2">
        <strong>Username:</strong> <span>{{ profile.username }}</span>
      </div>
      <div class="profile-item mb-2">
        <strong>Full Name:</strong> <span>{{ profile.realname }}</span>
      </div>
      <div class="profile-item mb-2">
        <strong>Email:</strong> <span>{{ profile.email }}</span>
      </div>
      <div class="profile-item mb-2">
        <strong>Phone:</strong> <span>{{ profile.phoneNumber }}</span>
      </div>
    </div>

    <div v-if="errorMsg" class="text-danger mt-3 text-center">{{ errorMsg }}</div>

    <div class="d-grid gap-2 mt-4">
      <button class="btn btn-outline-primary" @click="router.push('/')">Back to Dashboard</button>
      <button class="btn btn-danger" @click="authStore.logout()">Logout</button>
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