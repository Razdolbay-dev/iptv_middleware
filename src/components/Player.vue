<template>
  <div class="player-screen flex flex-col items-center justify-center bg-black text-white">
    <div v-if="!isSTB">
      <video ref="videoRef" controls autoplay class="w-full h-full object-contain bg-black" />
    </div>
    <div v-else>
      <p class="text-lg">▶️ Воспроизведение на STB...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { remote } from '@/utils/remoteControl'

const route = useRoute()
const router = useRouter()
const videoRef = ref(null)

const url = route.query.url || ''
const isSTB = typeof window.gSTB !== 'undefined'

function playSTB(url) {
  try {
    gSTB.Stop()
    gSTB.Play(url)
    console.log('STB: start playback', url)
  } catch (e) {
    console.error('STB playback error:', e)
  }
}

function stopSTB() {
  try {
    gSTB.Stop()
    console.log('STB: stop playback')
  } catch {}
}

function playHTML5(url) {
  if (videoRef.value) {
    videoRef.value.src = url
    videoRef.value.play().catch(console.error)
  }
}

onMounted(() => {
  if (isSTB) playSTB(url)
  else playHTML5(url)

  remote.on('back', handleBack)
})

function handleBack() {
  if (isSTB) stopSTB()
  router.push('/tv')
}

onUnmounted(() => {
  remote.off('back', handleBack)
  if (isSTB) stopSTB()
})
</script>

<style scoped>
.player-screen {
  width: 100vw;
  height: 100vh;
}
</style>
