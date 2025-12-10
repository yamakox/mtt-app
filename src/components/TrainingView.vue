<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import type { Ref } from 'vue'

export interface Props {
  category?: string
  caption?: string
  leadingText?: string
  trailingText?: string
  value?: string
  visible?: boolean
  trainingFinished?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  category: '',
  caption: '',
  leadingText: '',
  trailingText: '',
  value: '',
  visible: false,
  trainingFinished: false,
})

const size: Ref<number> = ref(0)

const valueStyle = computed(() => {
  const k = props.trainingFinished ? 0.22 : 0.32
  return {
    fontSize: `${size.value * k}px`,
    lineHeight: `${size.value * k}px`,
    textAlign: 'center' as const,
    transform: 'translateY(-3%)' as const,
    fontFamily: 'ui-monospace' as const,
    fontWeight: 'bold' as const,
    margin: '0 1rem',
    /*
    padding: '0',
    whiteSpace: 'nowrap' as const,
*/
  }
})

const leadingStyle = computed(() => {
  return {
    fontSize: `${size.value * 0.13}px`,
    lineHeight: `${size.value * 0.13}px`,
    textAlign: 'right' as const,
  }
})

const trailingStyle = computed(() => {
  return {
    fontSize: `${size.value * 0.13}px`,
    lineHeight: `${size.value * 0.13}px`,
    textAlign: 'left' as const,
  }
})

function updateSize() {
  if (typeof window == 'undefined') {
    return
  }
  const w = window.innerWidth
  //const h = window.innerHeight
  //size.value = Math.round(Math.min(w, h) * 1.0)
  size.value = w
}

onMounted(() => {
  updateSize()
  window.addEventListener('resize', updateSize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize)
})
</script>

<template>
  <transition name="fade">
    <div class="viewport" v-if="visible">
      <div class="content">
        <div class="description nowrap">
          <span class="mx-2 my-0 p-0 text-2xl">{{ props.category }}</span>
          <span class="mx-2 my-0 p-0 text-2xl">{{ props.caption }}</span>
          <span class="mx-2 my-0 p-0 text-2xl" v-if="props.trainingFinished"
            >終了</span
          >
        </div>
        <div class="progress">
          <div
            :class="{ text: true, 'training-finished': props.trainingFinished }"
            :style="leadingStyle"
          >
            {{ props.leadingText }}
          </div>
          <div
            :class="{ text: true, 'training-finished': props.trainingFinished }"
            :style="valueStyle"
          >
            {{ props.value }}
          </div>
          <div
            :class="{ text: true, 'training-finished': props.trainingFinished }"
            :style="trailingStyle"
          >
            {{ props.trailingText }}
          </div>
        </div>
        <div class="description nowrap text-lg">タップすると中断</div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.viewport {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 150vh;
  backdrop-filter: blur(8px);
  opacity: 1;
  user-select: none;
  -webkit-user-select: none;
  z-index: 10000;
}

.viewport .content {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.progress {
  margin: 0.5rem 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.progress .text {
  margin: 0;
  padding: 0;
  font-weight: bold;
  white-space: nowrap;
}

@media (prefers-color-scheme: light) {
  .progress .text {
    color: rgba(0, 0, 0, 1);
    text-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
    &.training-finished {
      color: rgba(128, 128, 128, 1);
      text-shadow: 0 4px 8px rgba(128, 128, 128, 0.5);
    }
  }
}

@media (prefers-color-scheme: dark) {
  .progress .text {
    color: rgba(255, 255, 255, 1);
    text-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
    &.training-finished {
      color: rgba(160, 160, 160, 1);
      text-shadow: 0 4px 8px rgba(160, 160, 160, 0.5);
    }
  }
}

.description.nowrap {
  white-space: nowrap;
}

/* <transition name="fade">のスタイル */
.fade-enter-active,
.fade-leave-active {
  transition:
    backdrop-filter 0.3s ease,
    opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  backdrop-filter: blur(0px);
  opacity: 0;
}
</style>
