import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import http from '../api/http';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('jwt'));
  const balance = ref<number>(0);
  const realname = ref<string>('');
  const router = useRouter();

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('jwt', newToken);
  };

  const logout = () => {
    token.value = null;
    localStorage.removeItem('jwt');
    router.push('/login');
  };

  const fetchBalance = async () => {
    try {
      const res = await http.get('/account/balance');
      balance.value = res.data.amount;
      realname.value = res.data.payeeRealname;
    } catch (error) {
      console.error('Failed to load balance', error);
    }
  };

  return { token, balance, realname, setToken, logout, fetchBalance };
});