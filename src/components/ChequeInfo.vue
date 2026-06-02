<template>
  <div class="mt-3">
    <h6>{{ title }}</h6>
    <ul class="list-group">
      <li class="list-group-item"><b>ID:</b> {{ cheque.id }}</li>
      <li class="list-group-item"><b>Amount:</b> £{{ cheque.amount }}</li>
      <li class="list-group-item"><b>Payer:</b> {{ cheque.payerRealname }} ({{ cheque.payerUsername }})</li>
      <li class="list-group-item"><b>Payee:</b> {{ cheque.payeeRealname }} ({{ cheque.payeeUsername }})</li>
      <li class="list-group-item"><b>Status:</b> {{ cheque.status }}</li>
      <li class="list-group-item"><b>Expiry:</b> {{ cheque.expiryDate }}</li>
    </ul>
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