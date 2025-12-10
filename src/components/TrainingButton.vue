<script setup lang="ts">
import { ref, onUnmounted, useTemplateRef } from 'vue'
import type { Ref } from 'vue'
import { loadAudioBuffer, playBuffer } from './audio'
import WakeLock from './WakeLock'
import TrainingView from './TrainingView.vue'
import sec1 from '@/assets/sounds/sec1.mp3'
import sec5 from '@/assets/sounds/sec5.mp3'
import turnEnd from '@/assets/sounds/turn-end.mp3'
import count1 from '@/assets/sounds/count1.mp3'
import count2 from '@/assets/sounds/count2.mp3'
import count3 from '@/assets/sounds/count3.mp3'
import finish from '@/assets/sounds/finish.mp3'

const container = useTemplateRef<HTMLElement | null>('container')

export interface Props {
  index: number // インデックス番号(一意識別子)
  category: string // ドローイン、プランクなど
  caption: string // 1セット名など
  disabled?: boolean // 無効化フラグ
  repeat?: number // 回数
  duration?: number | null // 秒数
  tempo?: number | null // テンポ
  trainingInterval?: number | null // 次までのインターバル
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  repeat: 15,
  duration: null,
  tempo: null,
  trainingInterval: null,
})

const emit = defineEmits<{
  trainingFinished: [index: number]
  trainingIntervalFinished: [index: number]
}>()

const caption: Ref<string> = ref(`${props.caption} スタート`)
const disabled: Ref<boolean> = ref(props.disabled)
const errorMessage: Ref<string | null> = ref(null)
const currentText: Ref<string> = ref('')
const leadingText: Ref<string> = ref('')
const trailingText: Ref<string> = ref('')
const trainingFinished: Ref<boolean> = ref(false)

if (props.tempo == null && props.duration == null) {
  errorMessage.value =
    'プログラムエラー: tempo属性またはduration属性に値が必要です。'
  disabled.value = true
} else if (props.tempo && props.duration) {
  errorMessage.value =
    'プログラムエラー: tempo属性とduration属性は同時に指定できません。'
  disabled.value = true
} else if (props.repeat < 1) {
  errorMessage.value = 'プログラムエラー: repeat属性には1以上の値が必要です。'
  disabled.value = true
}

const wakeLock = new WakeLock()
let playingSource: AudioBufferSourceNode | undefined = undefined
let isRunning: boolean = false
let isStopping: boolean = false

function clearPlayingSource() {
  if (playingSource) {
    playingSource.stop()
    playingSource = undefined
  }
}

async function waitAndPlayBuffer(
  begin: number,
  span: number,
  buffer: AudioBuffer | null
) {
  if (buffer) {
    clearPlayingSource()
    playingSource = playBuffer(buffer, () => {})
  }
  const sleep = 25
  while (Date.now() - begin <= span * 1000 - sleep) {
    if (isStopping) {
      return begin
    }
    await new Promise((resolve) => setTimeout(resolve, sleep))
  }
  return begin + span * 1000
}

async function startOrStop() {
  scroll()
  errorMessage.value = null

  // 中断
  if (isRunning) {
    if (isStopping) {
      return
    }
    isStopping = true
    disabled.value = true
    caption.value = `停止中...`
    clearPlayingSource()
    const timer = setInterval(() => {
      if (!isRunning) {
        if (trainingFinished.value) {
          caption.value = `${props.caption} 終了`
          clearInterval(timer)
          isStopping = false
          disabled.value = true
        } else {
          caption.value = `${props.caption} スタート`
          clearInterval(timer)
          isStopping = false
          disabled.value = false
        }
      }
    }, 100)
    return
  }

  try {
    await wakeLock.request()
    const sec1Buffer = await loadAudioBuffer(sec1)
    const sec5Buffer = await loadAudioBuffer(sec5)
    const turnEndBuffer = await loadAudioBuffer(turnEnd)
    const finishBuffer = await loadAudioBuffer(finish)
    const countBuffer = [
      await loadAudioBuffer(count1),
      await loadAudioBuffer(count2),
      await loadAudioBuffer(count3),
    ]

    // トレーニング開始前の3カウントダウン
    let t: number = Date.now()
    leadingText.value = ''
    trailingText.value = ''
    currentText.value = '3'
    isRunning = true
    for (let i = 3; i > 0; i--) {
      caption.value = currentText.value = String(i)
      t = await waitAndPlayBuffer(t, 1, countBuffer[i - 1]!)
      if (isStopping) {
        return
      }
    }

    // トレーニング開始
    if (props.repeat == 1 && props.duration) {
      // 回数が1回かつ秒数が指定されている場合
      leadingText.value = 'あと'
      trailingText.value = '秒'
      t = Date.now()
      for (let i = props.duration; i > 0; i--) {
        caption.value = `あと ${i}秒`
        currentText.value = String(i)
        const buffer =
          (i - 1) % 5 ? sec1Buffer : i > 1 ? sec5Buffer : turnEndBuffer
        t = await waitAndPlayBuffer(t, 1, buffer)
        if (isStopping) {
          return
        }
      }
    } else {
      leadingText.value = 'あと'
      trailingText.value = '回'
      t = Date.now()
      for (let i = props.repeat; i > 0; i--) {
        caption.value = `あと ${i}回`
        currentText.value = String(i)
        if (props.tempo) {
          // テンポが指定されている場合
          t = await waitAndPlayBuffer(t, props.tempo, sec1Buffer)
          if (isStopping) {
            return
          }
          t = await waitAndPlayBuffer(
            t,
            props.tempo,
            i > 1 ? sec5Buffer : turnEndBuffer
          )
          if (isStopping) {
            return
          }
        } else if (props.duration) {
          // 秒数が指定されている場合
          for (let i = props.duration; i > 0; i--) {
            const buffer =
              (i - 1) % 5 ? sec1Buffer : i > 1 ? sec5Buffer : turnEndBuffer
            t = await waitAndPlayBuffer(t, 1, buffer)
            if (isStopping) {
              return
            }
          }
        }
      }
    }

    clearPlayingSource()
    playingSource = playBuffer(finishBuffer, () => {
      clearPlayingSource()
    })
    trainingFinished.value = true
    emit('trainingFinished', props.index)

    // インターバル開始
    if (props.trainingInterval) {
      leadingText.value = '次は'
      trailingText.value = '秒後'
      t = Date.now()
      for (let i = props.trainingInterval; i > 0; i--) {
        caption.value = `次は ${i}秒後`
        currentText.value = String(i)
        t = await waitAndPlayBuffer(t, 1, null)
        if (isStopping) {
          return
        }
      }
      emit('trainingIntervalFinished', props.index)
    }

    // トレーニング・インターバル終了
    isStopping = true
    disabled.value = true
    caption.value = `${props.caption} 終了`
  } catch (error) {
    errorMessage.value = String(error)
  } finally {
    isRunning = false
    await wakeLock.release()
  }
}

function scroll() {
  if (container.value) {
    container.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

onUnmounted(() => {
  isStopping = true
  clearPlayingSource()
})

defineExpose({
  errorMessage,
  startOrStop,
  scroll,
})
</script>

<template>
  <div ref="container" class="container">
    <button class="fancy-button" @click="startOrStop" :disabled="disabled">
      {{ caption }}
    </button>
    <training-view
      :category="props.category"
      :caption="props.caption"
      :leading-text="leadingText"
      :value="String(currentText)"
      :trailing-text="trailingText"
      :visible="isRunning && !isStopping"
      :training-finished="trainingFinished"
      @click="startOrStop"
    />
  </div>
</template>

<style scoped>
.container {
  margin: 0;
  padding: 0;
}
</style>
