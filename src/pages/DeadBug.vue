<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import BaseFrame from '../components/BaseFrame.vue'
import TrainingButtonSet from '../components/TrainingButtonSet.vue'
import { useRoute } from 'vue-router'
import illustration from '@/assets/dead-bug.png'

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
          仰向けで腹直筋を鍛えるトレーニングです。
          腰の負担が少なく腰痛が気になる方にもオススメです。
          腹直筋を鍛えることで、姿勢改善効果が期待できます。
        </p>
        <p>やり方</p>
        <ol class="list-decimal pl-4 text-left text-sm">
          <li>
            仰向けに寝て両手を天井に向かって伸ばし、両ひざと股関節を約90°に曲げた状態で足を浮かせる。
          </li>
          <li>
            息を吐きながら、片方の腕を床に向かってゆっくりと下ろす。
            同時に、下ろした腕と反対の脚を床に向かってひざに伸ばしながらゆっくりと下ろす。
            (※ 床に付けないように注意)
          </li>
          <li>
            腕と脚が床に平行になるまで下ろしたら、息を吸いながら元の姿勢に戻る。
          </li>
          <li>反対側も同様に、対角の腕と脚を同時に下ろす。</li>
          <li>
            3～4を{{ buttonSet?.repeat }}回×{{
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
