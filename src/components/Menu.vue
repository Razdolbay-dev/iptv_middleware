<template>
  <div class="layout" tabindex="0" ref="menuRoot">
    <!-- Верхняя панель -->
    <div class="top-bar">
      <div class="flex flex-col items-center">
        <nav class="fixed top-0 container mx-auto">
          <div class="flex justify-between items-center p-4 w-full">
            <!-- Логотип -->
            <div class="flex items-center space-x-2 text-white">
              <svg width="36" height="36" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M67.289 48.8538C67.3095 48.8103 67.3277 48.7659 67.3422 48.7203C71.4895 38.7495 70.7485 26.5257 65.3619 17.1829C68.2376 13.602 64.5022 8.47388 60.4174 10.458C59.6995 9.69392 58.9459 8.96159 58.1648 8.26914C59.6979 3.92811 54.5814 0.367009 51.395 3.61039C42.1334 -1.26109 30.614 -1.1994 21.4036 3.77523C18.1271 0.158421 12.6245 4.0364 14.6083 8.57433C13.4721 9.60915 12.3968 10.727 11.4052 11.9092C10.5491 12.9299 12.1001 14.3289 12.9503 13.3153C13.8728 12.2156 14.8722 11.1754 15.9279 10.2114C17.9694 11.7452 20.9295 10.9638 22.0494 8.62263C25.7454 9.73083 29.2749 11.3213 32.5638 13.3626C32.2885 14.3968 32.4009 15.5519 32.8734 16.5067C30.1665 18.9423 27.7287 21.6976 25.6119 24.7171C23.6577 24.102 21.5037 25.1316 20.6539 27.0593C16.3443 27.0834 12.0213 27.5663 7.77697 28.5008C7.40219 27.7733 6.834 27.1705 6.14516 26.7667C6.9426 23.5274 8.20564 20.4461 9.90693 17.5969C10.5848 16.4614 8.87368 15.2809 8.16475 16.4681C6.35595 19.4971 5.01248 22.7729 4.16279 26.2163C-0.751772 26.3032 -1.57684 33.3852 3.10178 34.7476C3.03284 44.8268 7.21644 54.6262 14.4711 61.3016C12.9577 65.5598 17.8708 69.0722 21.113 66.0687C30.5753 71.3098 42.534 71.3105 51.9968 66.0705C55.2945 69.4677 60.5762 65.6724 58.7187 61.2312C62.4576 57.77 65.3621 53.5365 67.289 48.8538ZM65.9964 46.4639C63.1567 43.5251 60.049 40.8592 56.7311 38.519C57.2023 36.9815 56.7928 35.2517 55.6924 34.1167C58.4824 29.2846 60.6727 24.1032 62.2145 18.6906C62.7283 18.6924 63.2222 18.5937 63.6773 18.415C68.4016 26.7262 69.2656 37.442 65.9964 46.4639ZM18.7895 58.5438C17.9262 49.735 19.4412 40.9471 23.1907 33.0055C25.5201 33.7626 28.0379 32.167 28.4902 29.6764C35.5639 30.5847 42.3765 32.7479 48.77 36.1168C48.4625 37.3618 48.7171 38.7346 49.4495 39.7702C42.2429 49.2805 32.7302 56.4368 21.8429 60.5383C21.1832 59.4502 20.0738 58.6889 18.7895 58.5438ZM50.6907 37.1996C50.6907 35.9887 51.6295 35.0036 52.7836 35.0036C55.56 35.124 55.5591 39.2757 52.7836 39.3957C51.6295 39.3957 50.6907 38.4106 50.6907 37.1996ZM64.3165 14.3575C64.3165 15.5684 63.3776 16.5535 62.2236 16.5535C59.447 16.4331 59.4477 12.2815 62.2236 12.1615C63.3776 12.1615 64.3165 13.1466 64.3165 14.3575ZM58.8497 11.8453C57.4318 13.9205 58.0899 16.9204 60.2275 18.1539C58.734 23.3748 56.6166 28.3727 53.923 33.0344C53.3598 32.8657 52.7347 32.8239 52.1557 32.9162C49.3402 26.6535 45.2435 21.0127 40.2389 16.507C40.7118 15.5516 40.8245 14.3986 40.5487 13.3629C43.7165 11.397 47.1096 9.84766 50.6579 8.7463C51.8372 11.118 55.0008 11.7876 56.9649 10.0122C57.6158 10.5955 58.2459 11.2083 58.8497 11.8453ZM34.4633 14.5229C34.4633 13.312 35.4022 12.3269 36.5562 12.3269C39.3328 12.4473 39.3319 16.5989 36.5562 16.7188C35.4022 16.7188 34.4633 15.7337 34.4633 14.5229ZM54.306 4.49546C55.4601 4.49546 56.399 5.48056 56.399 6.69148C56.2838 9.60473 52.3278 9.60402 52.2131 6.69148C52.2131 5.48056 53.1519 4.49546 54.306 4.49546ZM18.3406 8.88735C17.1866 8.88735 16.2477 7.90226 16.2477 6.69134C16.3629 3.77794 20.3189 3.77894 20.4336 6.69134C20.4336 7.90226 19.4946 8.88735 18.3406 8.88735ZM22.4814 6.52749C22.4707 6.23085 22.4316 5.94204 22.3665 5.66336C30.9541 1.03751 41.6822 0.956869 50.336 5.44821C50.2248 5.83561 50.1639 6.24524 50.1619 6.66939C46.4297 7.81948 42.8609 9.44402 39.5292 11.5081C37.9277 9.78255 35.1854 9.78198 33.5834 11.508C30.1115 9.35682 26.3846 7.6847 22.4814 6.52749ZM34.2316 18.1084C35.6189 19.0946 37.4932 19.0948 38.8805 18.1086C43.6586 22.4058 47.5727 27.7851 50.2688 33.7585C50.0861 33.9048 49.9154 34.0668 49.7584 34.2422C43.0179 30.681 35.8248 28.4167 28.3533 27.5057C28.1515 26.8697 27.8129 26.2986 27.3733 25.8312C29.3785 22.9937 31.6797 20.4022 34.2316 18.1084ZM24.4192 26.6706C25.5732 26.6706 26.5121 27.6557 26.5121 28.8667C26.3969 31.7801 22.4409 31.7792 22.3261 28.8667C22.3263 27.6557 23.2652 26.6706 24.4192 26.6706ZM2.03242 30.5486C2.03242 29.3377 2.97129 28.3526 4.12531 28.3526C6.9017 28.473 6.90088 32.6245 4.12531 32.7445C2.97142 32.7446 2.03242 31.7595 2.03242 30.5486ZM5.15336 34.7467C5.15336 34.7467 8.26938 34.0389 8.26938 30.5768C8.26938 30.5768 16.2651 29.2455 20.288 29.1988C20.3635 30.234 20.7879 31.1683 21.4388 31.8732C17.441 40.2511 15.8285 49.5396 16.7567 58.8474C16.357 59.0209 15.9891 59.2581 15.6638 59.5465C8.97093 53.3011 5.15336 42.8369 5.15336 34.7467ZM18.3406 65.0469C17.1866 65.0469 16.2477 64.0618 16.2477 62.8509C16.2477 61.6399 17.1866 60.6549 18.3406 60.6549C19.4792 60.6549 20.4336 61.6821 20.4336 62.8509C20.4336 64.0618 19.4946 65.0469 18.3406 65.0469ZM36.5562 67.8789C31.5772 67.8789 26.6536 66.6368 22.2531 64.2787C22.4317 63.7454 22.5105 63.1378 22.4758 62.5719C33.7381 58.3433 43.5797 50.9534 51.0351 41.1271C51.6476 41.4263 52.3273 41.5636 53.0026 41.5267C53.4583 43.2887 53.8185 45.0864 54.0737 46.8839C54.2692 48.26 56.2994 47.9525 56.1034 46.5713C55.8324 44.6627 55.4488 42.7537 54.9617 40.8841C55.2069 40.7251 55.4348 40.5398 55.6424 40.3325C59.0658 42.7533 62.2575 45.5323 65.1489 48.608C63.3557 52.7372 60.7458 56.476 57.4298 59.5653C57.1019 59.3089 56.7363 59.1026 56.3439 58.9558C56.5455 56.9692 56.6333 54.9634 56.6037 52.9795C56.583 51.5835 54.5314 51.6163 54.5523 53.0126C54.5807 54.9195 54.4959 56.8477 54.3012 58.7573C51.8816 59.1581 50.2992 61.7715 50.9659 64.2207C46.5377 66.6163 41.576 67.8789 36.5562 67.8789ZM54.952 65.2327C53.7979 65.2327 52.8591 64.2476 52.8591 63.0367C52.9742 60.1233 56.9302 60.1243 57.045 63.0367C57.045 64.2476 56.1061 65.2327 54.952 65.2327Z" fill="white"/>
              </svg>

              <span class="text-white px-2 font-semibold text-lg">ONLINE | КЭСКО</span>
            </div>


            <span class="text-white px-2 font-semibold text-lg">{{ currentDate }}, {{ currentTime }}</span>
            <span class="text-white px-2 font-semibold text-lg">Договор [0001]</span>

          </div>


        </nav>
      </div>

    </div>

    <!-- Центральное меню -->
    <div class="menu">
      <button
          v-for="(item, index) in menuItems"
          :key="item.name"
          class="elem cursor-pointer flex flex-col justify-center items-center rounded-2xl transition-all duration-200
             text-center font-semibold select-none outline-none focus:outline-none"
          :class="[
          sizeClass,
          selectedIndex === index
            ? 'bg-blue-600 ring-4 ring-blue-300'
            : 'bg-gray-800 hover:bg-gray-700'
        ]"
          @focus="selectedIndex = index"
          @click="open(item)"
      >
        <div :class="['icon', iconSizeClass]">
          <img :src="item.icon" :alt="item.name" class="w-full h-full object-contain" />
        </div>
        <div class="mt-4">{{ item.name }}</div>
      </button>
    </div>

    <!-- Нижняя панель -->
    <div class="bottom-bar">

    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import { remote } from '@/utils/remoteControl.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedIndex = ref(0)
const itemsPerRow = 3
const menuItems = [
  { name: 'ТВ', icon: '/images/ico/mm_ico_tv.png', route: '/tv' },
  { name: 'Видеоклуб', icon: '/images/ico/mm_ico_video.png', route: '/video' },
  { name: 'Камеры', icon: '/images/ico/mm_ico_rec.png', route: '/cameras' }
]

// дата и время
const currentDate = ref('')
const currentTime = ref('')
setInterval(() => {
  const now = new Date()
  const days = ['ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА']
  currentDate.value = `${days[now.getDay()]}, ${now.toLocaleDateString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).toUpperCase()}`
  currentTime.value = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}, 1000)

// класс разрешения
const resolutionClass = computed(() => {
  const body = document.body
  if (body.classList.contains('i_480')) return 'i_480'
  if (body.classList.contains('i_720')) return 'i_720'
  if (body.classList.contains('i_1080')) return 'i_1080'
  return 'i_1080'
})

// размеры кнопок
const sizeClass = computed(() => {
  switch (resolutionClass.value) {
    case 'i_480': return 'w-24 h-24 text-lg'
    case 'i_720': return 'w-36 h-36 text-xl'
    case 'i_1080': return 'w-48 h-48 text-2xl'
    default: return 'w-64 h-64 text-2xl'
  }
})

// размеры иконок
const iconSizeClass = computed(() => {
  switch (resolutionClass.value) {
    case 'i_480': return 'w-8 h-8'
    case 'i_720': return 'w-12 h-12'
    case 'i_1080': return 'w-24 h-24'
    default: return 'w-36 h-36'
  }
})


function move(delta) {
  const len = menuItems.length
  let i = selectedIndex.value + delta
  if (i < 0) i = 0
  if (i >= len) i = len - 1
  selectedIndex.value = i
}

function open() {
  const r = menuItems[selectedIndex.value]?.route
  if (r) router.push(r)
}

let unsub = []
onMounted(() => {
  unsub.push(remote.on('left', () => move(-1)))
  unsub.push(remote.on('right', () => move(1)))
  unsub.push(remote.on('up', () => move(-itemsPerRow)))
  unsub.push(remote.on('down', () => move(itemsPerRow)))
  unsub.push(remote.on('enter', () => open()))
  unsub.push(remote.on('back', () => {
    // optional: go to root or do nothing
    router.push('/')
  }))
})

onUnmounted(() => {
  // off for each handler by calling returned cleanup
  unsub.forEach(fn => fn && fn())
  unsub = []
})
</script>


<style scoped>
.layout {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Верхняя панель */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  z-index: 10;
}

/* Центральная область меню */
.menu {
  flex: 1;
  display: grid;
  place-items: center;
  grid-template-columns: repeat(3, auto);
  gap: 3rem;
  padding-top: 80px;  /* отступ под верхнюю панель */
  padding-bottom: 80px; /* отступ под нижнюю панель */
}

/* Нижняя панель */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  z-index: 10;
}
</style>
