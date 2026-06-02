<template>
  <div class="card">
    <div v-if="showLogo" class="logo anton-regular">ChequePay</div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  showLogo: {
    type: Boolean,
    default: true
  }
});
</script>