<template>
  <div class="w-full max-w-125 p-5 rounded-xl shadow-md bg-white text-center mx-auto">
    <div v-if="showLogo" class="mb-5 text-[2.5rem] text-center font-[Anton] not-italic">ChequePay</div>
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