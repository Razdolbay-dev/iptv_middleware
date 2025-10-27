<template>
  <div class="tv-screen bg-[#1c1f2a] text-white w-full h-full flex overflow-hidden">

    <!-- Список каналов -->
    <div class="channels-list w-2/5 bg-[#20263a] p-4 overflow-hidden">
      <div class="text-sm text-gray-400 mb-2">
        {{ channels.length }} channels
      </div>

      <div
          v-for="(ch, i) in visibleChannels"
          :key="i"
          class="channel-item flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-all duration-150"
          :class="i + scrollOffset === selectedIndex ? 'bg-blue-600' : 'hover:bg-[#2c3350]'"
      >
        <div class="flex items-center gap-3">
          <span class="text-gray-400 w-10 text-right">{{ i + scrollOffset + 1 }}</span>
          <div>
            <div class="font-semibold truncate max-w-[160px]">{{ ch.name }}</div>
            <div class="text-xs text-gray-400 truncate">{{ ch.attrs['group-title'] }}</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <img
              v-if="ch.attrs['tvg-logo']"
              :src="ch.attrs['tvg-logo']"
              alt="logo"
              class="w-6 h-6 rounded"
          />
          <span v-if="ch.attrs['tvg-id']?.includes('4k')" class="text-yellow-400 text-xs">4K</span>
        </div>
      </div>
    </div>

    <!-- Превью справа -->
    <div class="flex-1 bg-[#181b27] p-6 flex flex-col justify-between">
      <div>
        <div class="text-2xl font-bold mb-2">{{ currentChannel?.name }}</div>
        <div class="text-gray-400 text-sm">{{ currentChannel?.attrs['group-title'] }}</div>
      </div>

      <div class="flex justify-center items-center flex-1">
        <img
            v-if="currentChannel?.attrs['tvg-logo']"
            :src="currentChannel.attrs['tvg-logo']"
            class="max-h-48 object-contain rounded-lg shadow"
            alt="logo"
        />
      </div>

      <div class="text-sm text-gray-400">
        URL: <span class="text-blue-400 break-all">{{ currentChannel?.url }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {remote} from '@/utils/remoteControl'
import { getChannels } from '@/api/tvApi'

const router = useRouter()

const channels = ref([])
const selectedIndex = ref(0)
const scrollOffset = ref(0)
const pageSize = 10

const visibleChannels = computed(() =>
    channels.value.slice(scrollOffset.value, scrollOffset.value + pageSize)
)
const currentChannel = computed(() => channels.value[selectedIndex.value])

// Загрузка каналов
async function fetchChannels() {
  try {
    const data = await getChannels()
    channels.value = data.channels || []
  } catch (err) {
    console.error('Ошибка загрузки каналов:', err)
  }
}

// Навигация ↑ ↓
function moveUp() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
    if (selectedIndex.value < scrollOffset.value) scrollOffset.value--
  }
}

function moveDown() {
  if (selectedIndex.value < channels.value.length - 1) {
    selectedIndex.value++
    if (selectedIndex.value >= scrollOffset.value + pageSize) scrollOffset.value++
  }
}

// Открыть канал
function openChannel(channel) {
  if (!channel?.url) return
  router.push({ path: '/player', query: { url: channel.url } })
}

// Подключаем управление пультом
onMounted(() => {
  fetchChannels()

  remote.on('up', moveUp)
  remote.on('down', moveDown)
  remote.on('enter', () => openChannel(currentChannel.value))
  remote.on('back', () => router.push('/'))

  console.log('TV navigation ready')
})

onUnmounted(() => {
  remote.off('up', moveUp)
  remote.off('down', moveDown)
  remote.off('enter')
  remote.off('back')
})
</script>

<style scoped>
.tv-screen {
  height: 100vh;
}
.channel-item {
  min-height: 3rem;
}
</style>
