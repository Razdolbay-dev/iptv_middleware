<template>
  <div
      class="flex flex-col items-center justify-center w-full h-full text-center"
      tabindex="0"
      ref="root"
  >
    <h1 class="text-4xl font-bold mb-6">📹 Камеры (заглушка)</h1>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { remote } from '@/utils/remoteControl.js'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.push('/')
}

let cleanup
onMounted(() => {
  cleanup = remote.on('back', () => goBack())
  // можно подписаться на enter/info и т.д.
})
onUnmounted(() => {
  cleanup && cleanup()
})
</script>

