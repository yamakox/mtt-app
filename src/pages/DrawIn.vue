<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import BaseFrame from '../components/BaseFrame.vue'
import TrainingButtonSet from '../components/TrainingButtonSet.vue'
import { useRoute } from 'vue-router'
import illustration from '@/assets/draw-in.png'

const route = useRoute()
const category = String(route.meta?.title)

const buttonSet = useTemplateRef<ComponentExposed<
  typeof TrainingButtonSet
> | null>('buttonSet')
</script>

<template>
  <BaseFrame :illustration="illustration">
    <template #title>{{ route.meta?.title }}</template>
    <template #description>
      <div class="flex flex-col gap-2">
        <p>難易度: {{ route.meta?.difficulty }}</p>
        <p class="text-sm">
          インナーマッスルの腹横筋を鍛えるトレーニングです。
          呼吸とお腹の意識だけで行うことができるので初心者でも取り組みやすい筋トレメニューです。
          腹横筋を鍛えて臓器を正しい位置に整えることで、姿勢改善効果が期待できます。
          お腹の動きを意識できるように、お腹に手を当てながら行うのがおすすめです。
        </p>
        <p>やり方</p>
        <ol class="list-decimal pl-4 text-left text-sm">
          <li>両ひざを曲げて仰向けになる。</li>
          <li>ゆっくり息を吐きながらお腹をへこませる。</li>
          <li>
            おなかをへこませた状態をキープしたまま呼吸を続け、{{
              buttonSet?.duration
            }}秒経ったらお腹の力を抜く。
          </li>
          <li>2～3を{{ buttonSet?.count }}セット繰り返す。</li>
        </ol>
      </div>
    </template>
    <template #content>
      <training-button-set
        ref="buttonSet"
        :category="category"
        duration="30"
        durationMin="10"
        durationMax="60"
        durationStep="10"
      />
    </template>
  </BaseFrame>
</template>

<style scoped></style>
