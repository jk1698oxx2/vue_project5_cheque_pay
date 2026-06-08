<template>
  <div class="mt-5 text-start">
    <h6 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
      {{ title }}
    </h6>
    
    <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div class="space-y-3.5 text-sm">
        
        <div class="flex flex-col sm:flex-row sm:justify-between pb-2 border-b border-gray-100">
          <span class="font-medium text-gray-400 text-xs sm:text-sm">Cheque ID</span>
          <span class="font-semibold text-gray-800 font-mono break-all select-all pt-0.5 sm:pt-0">{{ cheque.id }}</span>
        </div>

        <div class="flex justify-between items-center pb-2 border-b border-gray-100">
          <span class="font-medium text-gray-400">Amount</span>
          <span class="font-extrabold text-emerald-600 font-mono text-base">£{{ cheque.amount }}</span>
        </div>

        <div class="flex justify-between items-center pb-2 border-b border-gray-100">
          <span class="font-medium text-gray-400">Payer</span>
          <span class="font-semibold text-gray-800 text-right">{{ cheque.payerRealname }} <span class="text-xs text-gray-400 font-mono">({{ cheque.payerUsername }})</span></span>
        </div>

        <div class="flex justify-between items-center pb-2 border-b border-gray-100">
          <span class="font-medium text-gray-400">Payee</span>
          <span class="font-semibold text-gray-800 text-right">{{ cheque.payeeRealname }} <span class="text-xs text-gray-400 font-mono">({{ cheque.payeeUsername }})</span></span>
        </div>

        <div class="flex justify-between items-center pb-2 border-b border-gray-100">
          <span class="font-medium text-gray-400">Status</span>
          <span 
            class="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono shadow-sm"
            :class="{
              'bg-emerald-50 text-emerald-700 border border-emerald-200': cheque.status === 'Active' || cheque.status === 'Redeemed',
              'bg-amber-50 text-amber-700 border border-amber-200': cheque.status === 'Pending',
              'bg-red-50 text-red-700 border border-red-200': cheque.status === 'Voided' || cheque.status === 'Expired'
            }"
          >
            {{ cheque.status }}
          </span>
        </div>

        <div class="flex justify-between items-center">
          <span class="font-medium text-gray-400">Expiry Date</span>
          <span class="font-semibold text-gray-700 font-mono text-xs sm:text-sm">{{ cheque.expiryDate }}</span>
        </div>
      </div>
    </div>
    
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import type { Cheque } from '../types/type.ts';

defineProps<{
  title?: string;
  cheque: Cheque;
}>();
</script>