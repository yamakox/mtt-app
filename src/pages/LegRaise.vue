<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import BaseFrame from '../components/BaseFrame.vue'
import TrainingButtonSet from '../components/TrainingButtonSet.vue'
import { useRoute } from 'vue-router'
import illustration from '@/assets/leg-raise.png'

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
          下腹部全体をダイレクトに刺激して鍛えるトレーニングです。
          腹筋が大きく伸び縮みするため、<span class="strike-out">少々</span
          >かなりきついです。
          腹直筋・腹横筋・腹斜筋を鍛えることで、下腹部の引き締めが期待できます。
        </p>
        <p>やり方</p>
        <ol class="list-decimal pl-4 text-left text-sm">
          <li>脚を伸ばして仰向けになり、手は身体の横かお尻の下に置く。</li>
          <li>脚をそろえた状態で、太ももを天井に向かって真っすぐ上げる。</li>
          <li>
            息を吐きながら、脚を床につくぎりぎりのところまでゆっくり下ろす。
          </li>
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

<style scoped>
.strike-out {
  text-decoration: line-through;
}
</style>
