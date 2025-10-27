<template>
  <transition name="fade" mode="out-in">
    <div class="min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <router-view />
    </div>
  </transition>
</template>

<script setup>
</script>
