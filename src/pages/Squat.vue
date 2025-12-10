<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import BaseFrame from '../components/BaseFrame.vue'
import TrainingButtonSet from '../components/TrainingButtonSet.vue'
import { useRoute } from 'vue-router'
import illustration from '@/assets/squat.png'

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
          全身を連動して動かすため、下腹部の筋肉を刺激できるだけでなく脂肪燃焼効果も期待できます。
          腰が反らないように腹筋と股関節の動きを意識し、ゆっくり丁寧に動作してみましょう。
        </p>
        <p>やり方</p>
        <ol class="list-decimal pl-4 text-left text-sm">
          <li>
            足を肩幅くらいに開いて立ち、両手は床に平行になるように前方に伸ばすか、胸の前でクロスする。
          </li>
          <li>
            腰を軽く後ろに引きながら身体をゆっくりと下げ、太ももが床と平行になる地点で一時停止する。
          </li>
          <li>足裏で床を押しながらゆっくり1の姿勢に戻る。</li>
          <li>
            2～3を{{ buttonSet?.repeat }}回×{{
              buttonSet?.count
            }}セット繰り返す。({{ buttonSet?.duration }}秒間/回)
          </li>
        </ol>
      </div>
    </template>
    <template #content>
      <training-button-set
        ref="buttonSet"
        :category="category"
        count="3"
        repeat="15"
        duration="10"
      />
    </template>
  </BaseFrame>
</template>

<style scoped></style>
