<script setup lang="ts">
import { ref, useTemplateRef, watch, computed } from 'vue'
import type { Ref } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import TrainingButton from './TrainingButton.vue'
import ResetLink from './ResetLink.vue'
import { getStorage, setStorage } from './storage'

export interface Props {
  category: string // ドローイン、プランクなど
  count?: string // セット数
  repeat?: string | null // 回数
  duration?: string | null // 秒数
  durationMin?: string // 最小秒数
  durationMax?: string // 最大秒数
  durationStep?: string // 秒数間隔
  tempo?: string | null // テンポ
  trainingInterval?: string // 次までのインターバル
}

const props = withDefaults(defineProps<Props>(), {
  useTempo: false,
  count: '3',
  repeat: null,
  duration: null,
  durationMin: '5',
  durationMax: '30',
  durationStep: '5',
  tempo: null,
  trainingInterval: '60',
})

const count: Ref<string | null> = ref(getStorage(props.category + '/count'))
const repeat: Ref<string | null> = ref(getStorage(props.category + '/repeat'))
const tempo: Ref<string | null> = ref(getStorage(props.category + '/tempo'))
const duration: Ref<string | null> = ref(
  getStorage(props.category + '/duration')
)
const trainingInterval: Ref<string | null> = ref(
  getStorage(props.category + '/trainingInterval')
)
const trainingTimestamp: Ref<string | null> = ref(
  getStorage(props.category + '/trainingTimestamp')
)

if (count.value == null) {
  count.value = props.count
}
watch(count, (newVal) => {
  if (newVal) {
    setStorage(props.category + '/count', newVal)
  }
})

if (props.repeat != null) {
  if (repeat.value == null) {
    repeat.value = props.repeat
  }
  watch(repeat, (newVal) => {
    if (newVal) {
      setStorage(props.category + '/repeat', newVal)
    }
  })
} else {
  repeat.value = '1'
}

if (props.tempo != null) {
  if (tempo.value == null) {
    tempo.value = props.tempo
  }
  watch(tempo, (newVal) => {
    if (newVal) {
      setStorage(props.category + '/tempo', newVal)
    }
  })
}

if (props.duration != null) {
  if (duration.value == null) {
    duration.value = props.duration
  }
  watch(duration, (newVal) => {
    if (newVal) {
      setStorage(props.category + '/duration', newVal)
    }
  })
}

if (trainingInterval.value == null) {
  trainingInterval.value = props.trainingInterval
}
watch(trainingInterval, (newVal) => {
  if (newVal) {
    setStorage(props.category + '/trainingInterval', newVal)
  }
})

const buttons = useTemplateRef<
  ComponentExposed<typeof TrainingButton>[] | null
>('button')
const settingPanelVisible: Ref<boolean> = ref(false)

const errorMessage = computed(() => {
  for (let i = 0; i < Number(count.value); i++) {
    const msg = buttons.value?.at(i)?.errorMessage
    if (msg) {
      return msg
    }
  }
  return ''
})

const trainingIntervalText = computed(() => {
  return Number(trainingInterval.value) ? `${trainingInterval.value}秒` : `オフ`
})

const lastTrainingDate = computed(() => {
  if (trainingTimestamp.value == null) {
    return 'なし'
  }
  const t = new Date(Number(trainingTimestamp.value))
  const lastDate = new Date(t.getFullYear(), t.getMonth(), t.getDate())
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = today.getTime() - lastDate.getTime()
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (diffDays == 0) {
    return '今日'
  } else if (diffDays == 1) {
    return '昨日'
  } else {
    return `${diffDays}日前`
  }
})

function tonum(value: string | null): number | undefined {
  return value != null ? Number(value) : undefined
}

function* range(start: number, end: number, step: number) {
  for (let i = start; i <= end; i += step) {
    yield i
  }
}

function beforeEnterSettingPanel(el: Element) {
  const _el = el as HTMLElement
  _el.style.height = '0'
  _el.style.overflow = 'hidden'
}

function enterSettingPanel(el: Element) {
  const _el = el as HTMLElement
  _el.style.transition = 'height 0.3s ease'
  _el.style.height = _el.scrollHeight + 'px'
  _el.addEventListener(
    'transitionend',
    () => {
      _el.style.height = 'auto' // 開き終わったら自動調整に戻す
    },
    { once: true }
  )
}

function beforeLeaveSettingPanel(el: Element) {
  const _el = el as HTMLElement
  _el.style.height = _el.scrollHeight + 'px'
  _el.style.overflow = 'hidden'
}

function leaveSettingPanel(el: Element) {
  const _el = el as HTMLElement
  _el.style.transition = 'height 0.3s ease'
  requestAnimationFrame(() => {
    _el.style.height = '0'
  })
}

function handleTrainingFinished() {
  trainingTimestamp.value = Date.now().toString()
  setStorage(props.category + '/trainingTimestamp', trainingTimestamp.value)
}

async function handleTrainingIntervalFinished(index: number) {
  if (index < Number(count.value) - 1) {
    buttons.value?.at(index + 1)?.scroll()
    await buttons.value?.at(index + 1)?.startOrStop()
  }
}

function resetSetting() {
  count.value = props.count
  if (props.repeat != null) repeat.value = props.repeat
  if (props.tempo != null) tempo.value = props.tempo
  if (props.duration != null) duration.value = props.duration
  trainingInterval.value = props.trainingInterval
}

defineExpose({
  count,
  repeat,
  tempo,
  duration,
  trainingInterval,
})
</script>

<template>
  <div class="content">
    <div class="error text-center" v-if="errorMessage">
      エラーが発生しました:<br />
      {{ errorMessage }}
    </div>

    <div class="mb-1">前回のトレーニング: {{ lastTrainingDate }}</div>

    <a
      href="#"
      class="setting-panel-btn"
      @click.prevent="settingPanelVisible = !settingPanelVisible"
    >
      {{ props.category }}の設定
      <div
        v-if="settingPanelVisible"
        class="ml-1 inline-block h-3 w-3 rotate-45 transform border-r-3 border-b-3 border-yellow-600"
      />
      <div
        v-else
        class="ml-1 inline-block h-3 w-3 translate-y-1 rotate-45 transform border-t-3 border-l-3 border-yellow-600"
      />
    </a>

    <transition
      @before-enter="beforeEnterSettingPanel"
      @enter="enterSettingPanel"
      @before-leave="beforeLeaveSettingPanel"
      @leave="leaveSettingPanel"
    >
      <div class="setting-panel" v-show="settingPanelVisible">
        <div class="setting-item">
          <div class="setting-item-label text-sm">セット数:</div>
          <div class="setting-item-slider-container">
            <input
              type="range"
              v-model="count"
              min="1"
              max="5"
              step="1"
              list="countValues"
              class="setting-item-slider"
            />
            <datalist id="countValues">
              <option :value="i" v-for="i in 5" />
            </datalist>
          </div>
          <div class="setting-item-value text-sm">
            {{ Number(count) }}セット
          </div>
        </div>

        <div class="setting-item" v-if="props.repeat != null">
          <div class="setting-item-label text-sm">回数:</div>
          <div class="setting-item-slider-container">
            <input
              type="range"
              v-model="repeat"
              min="5"
              max="30"
              step="5"
              list="repeatValues"
              class="setting-item-slider"
            />
            <datalist id="repeatValues">
              <option :value="i" v-for="i in range(5, 30, 5)" />
            </datalist>
          </div>
          <div class="setting-item-value text-sm">{{ Number(repeat) }}回</div>
        </div>

        <div class="setting-item" v-if="props.tempo != null">
          <div class="setting-item-label text-sm">テンポ:</div>
          <div class="setting-item-slider-container">
            <input
              type="range"
              v-model="tempo"
              min="1"
              max="5"
              step="0.5"
              list="tempoValues"
              class="setting-item-slider"
            />
            <datalist id="tempoValues">
              <option :value="i" v-for="i in 5" />
            </datalist>
          </div>
          <div class="setting-item-value text-sm">
            {{ Number(tempo) * 2 }}秒間/回
          </div>
        </div>

        <div class="setting-item" v-if="props.duration != null">
          <div class="setting-item-label text-sm">秒数:</div>
          <div class="setting-item-slider-container">
            <input
              type="range"
              v-model="duration"
              :min="durationMin"
              :max="durationMax"
              :step="durationStep"
              list="durationValues"
              class="setting-item-slider"
            />
            <datalist id="durationValues">
              <option
                :value="i"
                v-for="i in range(
                  Number(durationMin),
                  Number(durationMax),
                  Number(durationStep)
                )"
              />
            </datalist>
          </div>
          <div class="setting-item-value text-sm">{{ Number(duration) }}秒</div>
        </div>

        <div class="setting-item">
          <div class="setting-item-label text-sm">インターバル:</div>
          <div class="setting-item-slider-container">
            <input
              type="range"
              v-model="trainingInterval"
              min="0"
              max="120"
              step="30"
              list="trainingIntervalValues"
              class="setting-item-slider"
            />
            <datalist id="trainingIntervalValues">
              <option :value="i" v-for="i in range(0, 120, 30)" />
            </datalist>
          </div>
          <div class="setting-item-value text-sm">
            {{ trainingIntervalText }}
          </div>
        </div>

        <a href="#" class="mb-2 text-sm" @click.prevent="resetSetting">
          設定のリセット
        </a>
      </div>
    </transition>

    <training-button
      v-for="i in Number(count)"
      ref="button"
      :index="i - 1"
      :category="category"
      :caption="`${i}セット目`"
      :repeat="tonum(repeat)"
      :duration="tonum(duration)"
      :tempo="tonum(tempo)"
      :training-interval="tonum(trainingInterval)"
      @training-finished="handleTrainingFinished"
      @training-interval-finished="handleTrainingIntervalFinished"
    />

    <reset-link />
  </div>
</template>

<style scoped>
.setting-panel-btn {
  margin: 0.5rem 0;
  padding: 0;
  font-weight: bold;
}

.setting-panel {
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.setting-item {
  padding: 0.3rem 0;
  margin: 0.3rem 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  gap: 0;
}
.setting-item-label {
  min-width: 6em;
  white-space: nowrap;
  text-align: right;
  margin: 0 0.5rem 0 0;
}
.setting-item-slider-container {
  width: 100%;
  margin: 0;
  padding: 0;
}
.setting-item-slider {
  width: 100%;
  margin: 0;
  padding: 0;
}
.setting-item-value {
  width: 6rem;
  text-align: right;
  white-space: nowrap;
}
</style>
