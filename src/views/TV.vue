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
          <div class="flex items-center gap-2">
            <img
                v-if="ch.attrs['tvg-logo']"
                :src="ch.attrs['tvg-logo']"
                alt="logo"
                class="w-6 h-6 rounded"
            />
            <span v-if="ch.attrs['tvg-id']?.includes('4k')" class="text-yellow-400 text-xs">4K</span>
          </div>
          <div>
            <div class="font-semibold truncate max-w-[160px]">{{ ch.name }}</div>
            <div class="text-xs text-gray-400 truncate">{{ ch.attrs['group-title'] }}</div>
          </div>
        </div>


      </div>
    </div>

    <!-- Проигрыватель -->
    <div class="flex-1 bg-[#181b27] p-6 flex flex-col justify-between relative">
      <!-- Overlay с инфо-баром -->
      <transition name="fade">
        <div
            v-if="showInfoBar"
            class="absolute bottom-0 left-0 w-full bg-black/70 text-white p-4 flex justify-between items-center"
        >
          <div>
            <div class="text-xl font-bold">{{ currentChannel?.name }}</div>
            <div class="text-sm text-gray-300">{{ currentChannel?.attrs['group-title'] }}</div>
          </div>
          <div class="flex items-center gap-2">
            <img
                v-if="currentChannel?.attrs['tvg-logo']"
                :src="currentChannel.attrs['tvg-logo']"
                class="w-12 h-12 rounded"
            />
          </div>
        </div>
      </transition>

      <!-- Сообщения плеера -->
      <div v-if="statusMessage" class="absolute inset-0 flex items-center justify-center z-10">
        <div class="text-lg text-gray-300">{{ statusMessage }}</div>
      </div>

      <div>
        <div class="text-2xl font-bold mb-2">{{ currentChannel?.name }}</div>
        <div class="text-gray-400 text-sm">{{ currentChannel?.attrs['group-title'] }}</div>
      </div>

      <div class="flex justify-center items-center flex-1">
        <div id="player-area" class="w-full h-full rounded-lg shadow"></div>
      </div>

      <div class="text-sm text-gray-400">
        URL: <span class="text-blue-400 break-all">{{ currentChannel?.url }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { remote } from '@/utils/remoteControl'
import { getChannels } from '@/api/tvApi'

/* ---------- utils ---------- */
function _debug(...args) {
  // Легкий debug, можно заменить на console.debug
  try { console.log('[tv]', ...args) } catch (e) {}
}

/* ---------- state ---------- */
const router = useRouter()
const channels = ref([])
const selectedIndex = ref(0)
const scrollOffset = ref(0)
const pageSize = 14

const showInfoBar = ref(false)
const statusMessage = ref('')
const cur_view = ref('short') // 'short' или 'full'

let player = null
let infoTimer = null
let plasmaTimer = null
let preview_pos = null

/* карта позиций превью (копия Stalker) */
const preview_pos_map = [
  { mode: 576,  xsize: 320,  ysize: 256,  x: 350,  y: 74 },
  { mode: 720,  xsize: 569,  ysize: 320,  x: 625,  y: 93 },
  { mode: 1080, xsize: 854,  ysize: 480,  x: 933,  y: 139 },
  { mode: 480,  xsize: 300,  ysize: 240,  x: 350,  y: 63 },
  { mode: 3840, xsize: 1708, ysize: 960,  x: 1875, y: 278 }
]

/* ---------- computed ---------- */
const visibleChannels = computed(() =>
    channels.value.slice(scrollOffset.value, scrollOffset.value + pageSize)
)
const currentChannel = computed(() => channels.value[selectedIndex.value] || {})

/* ---------- API ---------- */
async function fetchChannels() {
  try {
    const data = await getChannels()
    channels.value = data.channels || []
  } catch (err) {
    console.error('Ошибка загрузки каналов:', err)
    channels.value = []
  }
}

/* ---------- UI navigation ---------- */
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

/* ---------- plasma saving stub (копия логики Stalker) ---------- */
function start_tv_plasma_saving_count() {
  _debug('start_tv_plasma_saving_count: started')
  // заглушка: через некоторое время можно выключить видео или уменьшить яркость
  clearTimeout(plasmaTimer)
  plasmaTimer = setTimeout(() => {
    _debug('plasma_saving: triggered (stub)')
    // здесь можно вызвать player.SetVideoState(0) или другие меры экономии
  }, 1000 * 60 * 10) // 10 минут — пример
}

/* ---------- пересчёт режима превью (копия логики) ---------- */
function recalculate_preview_mode() {
  _debug('tv.recalculate_preview_mode')

  try {
    // читаем vmode (разрешение)
    try {
      const r = (player && player.RDir) ? player.RDir('vmode') : undefined
      player && (player.video_mode = r)
    } catch (e) {
      _debug('RDir vmode error', e)
    }

    _debug('stb.video_mode', player && player.video_mode)
    _debug('parseInt(stb.video_mode)', parseInt(player && player.video_mode))
    _debug('stb.graphic_mode', player && player.graphic_mode)

    // найдем подходящую позицию
    const vmode = parseInt(player && player.video_mode) || 720
    let idx = preview_pos_map.findIndex(p => p.mode === vmode)
    if (idx === -1) idx = 1 // default 720
    preview_pos = { ...preview_pos_map[idx] }

    // учёт графического масштаба (как в Stalker)
    if (player && player.graphic_mode == 1080) {
      // берём элемент и уменьшаем
      preview_pos.xsize = Math.round(preview_pos.xsize * 0.667)
      preview_pos.ysize = Math.round(preview_pos.ysize * 0.667)
      preview_pos.x = 945
      preview_pos.y = 274
    }

    _debug('preview_pos computed', preview_pos)
  } catch (e) {
    _debug('recalculate_preview_mode error', e)
  }
}

/* ---------- play logic (учитывает SetTopWin/SetViewport и cur_view) ---------- */
function playChannel(channel, isPreview = false) {
  if (!channel?.url) return
  const url = channel.url
  player = window.gSTB || window.stb || window.gstb

  if (!player) {
    console.warn('⚠️ gSTB не найден — откроем браузерный плеер')
    router.push({ path: '/player', query: { url } })
    return
  }

  try {
    // recompute preview coords
    recalculate_preview_mode()

    // native player init
    try { player.Stop && player.Stop() } catch (e) { _debug('Stop error', e) }
    try { player.InitPlayer && player.InitPlayer() } catch (e) { _debug('InitPlayer error', e) }

    // If preview mode requested or cur_view == 'short', use preview viewport
    if (isPreview || cur_view.value === 'short') {
      _debug('setting preview mode')
      try {
        // prefer SetTopWin + SetViewport like Stalker
        if (player.SetTopWin) player.SetTopWin(1)
        if (preview_pos) {
          if (player.SetViewport) {
            player.SetViewport(preview_pos.xsize, preview_pos.ysize, preview_pos.x, preview_pos.y)
          } else if (player.SetPIG) {
            // альтернативный вызов
            player.SetPIG(1, -1, -1, -1)
          } else if (player.SetVideoPortal) {
            // некоторые STB используют SetVideoPortal(x,y,w,h) (coords or order may vary)
            player.SetVideoPortal(preview_pos.x, preview_pos.y, preview_pos.xsize, preview_pos.ysize)
          }
        }
        // если игрок запущен как TV и включён профиль plasma_saving, запускаем счётчик
        try {
          _debug('stb.player.on', player.player && player.player.on)
          _debug('stb.player.is_tv', player.player && player.player.is_tv)
          if (player.player && player.player.on && player.player.is_tv && player.profile && player.profile['plasma_saving'] === '1') {
            start_tv_plasma_saving_count()
          }
        } catch (e) { _debug('player flags check error', e) }
      } catch (e) {
        _debug('preview set error', e)
      }
    } else {
      // full screen mode
      _debug('full screen mode')
      try {
        if (player.SetTopWin) player.SetTopWin(0)
        // optionally clear viewport to full screen — on some devices SetViewport(0,0,0,0) resets
        if (player.SetViewport) {
          // try to set full-screen viewport if API requires explicit size
          // use RDir('vmode') to get native resolution (fallback to 1280x720)
          const vm = parseInt(player && player.video_mode) || 720
          // approximate full sizes for common modes
          const fullMap = { 480: [720,480], 576: [720,576], 720: [1280,720], 1080: [1920,1080], 3840: [3840,2160] }
          const sz = fullMap[vm] || [1280,720]
          player.SetViewport(sz[0], sz[1], 0, 0)
        }
      } catch (e) {
        _debug('full screen set error', e)
      }
    }

    // disable VK and service buttons like Stalker
    try {
      if (player.EnableVKButton) player.EnableVKButton(false)
      if (player.EnableServiceButton) player.EnableServiceButton(false)
    } catch (e) {
      _debug('disable vk/service buttons error', e)
    }

    // finally play
    try {
      if (player.Play) player.Play(url)
      else _debug('player.Play not available')
      // set video state on some boxes (1 = visible)
      if (player.SetVideoState) player.SetVideoState(1)
    } catch (e) {
      _debug('Play error', e)
      statusMessage.value = 'Ошибка воспроизведения'
      setTimeout(() => (statusMessage.value = ''), 3000)
    }

    statusMessage.value = 'Loading...'
    setTimeout(() => (statusMessage.value = ''), 1500)
    _debug('playChannel done:', url)
  } catch (e) {
    _debug('playChannel outer error', e)
    statusMessage.value = 'Ошибка запуска потока'
  }
}

/* ---------- info bar ---------- */
function toggleInfo() {
  showInfoBar.value = true
  clearTimeout(infoTimer)
  infoTimer = setTimeout(() => (showInfoBar.value = false), 4000)
}

/* ---------- lifecycle ---------- */
onMounted(() => {
  fetchChannels()

  setTimeout(() => {
    player = window.gSTB || window.stb || window.gstb
    // try read graphic mode & vmode early
    try {
      if (player) {
        player.graphic_mode = player.graphic_mode || (player.RDir ? parseInt(player.RDir('gmode') || player.RDir('vmode') || 720) : undefined)
        player.video_mode = player.video_mode || (player.RDir ? parseInt(player.RDir('vmode') || 720) : undefined)
        _debug('mounted player available, graphic_mode:', player.graphic_mode, 'video_mode:', player.video_mode)
        recalculate_preview_mode()
      }
    } catch (e) { _debug('mounted player read error', e) }
    player && player.SetVideoState && player.SetVideoState(1)
  }, 300)

  // remote handlers
  remote.on('up', moveUp)
  remote.on('down', moveDown)
  remote.on('enter', () => {
    // play fullscreen on enter
    cur_view.value = 'full'

    playChannel(currentChannel.value, false)
    player.SetTopWin(1)
    toggleInfo()
  })
  remote.on('info', toggleInfo)
  remote.on('back', () => {
    try { player && player.Stop && player.Stop()  } catch (e) {}
    router.push('/')
  })

  // initial preview for selected item (if channels already loaded later watch will call it)
  setTimeout(() => {
    if (channels.value.length && channels.value[selectedIndex.value]) {
      playChannel(channels.value[selectedIndex.value], true)
    }
  }, 800)

  _debug('TV navigation active')
})

onUnmounted(() => {
  try { player && player.Stop && player.Stop()} catch (e) {}
  remote.off('up', moveUp)
  remote.off('down', moveDown)
  remote.off('enter')
  remote.off('info')
  remote.off('back')
  player.SetTopWin(0)
  clearTimeout(infoTimer)
  clearTimeout(plasmaTimer)
})

/* ---------- watch: when selection changes — show preview (short) ---------- */
watch(selectedIndex, (newVal) => {
  const ch = channels.value[newVal]
  if (ch?.url) {
    // stay in short preview
    cur_view.value = 'short'
    playChannel(ch, true)
  }
})
</script>

<style scoped>
.tv-screen {
  height: 100vh;
}
.channel-item {
  min-height: 3rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
