<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import BaseFrame from '../components/BaseFrame.vue'
import TrainingButtonSet from '../components/TrainingButtonSet.vue'
import { useRoute } from 'vue-router'
import illustration from '@/assets/twist-crunch.png'

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
          ひねり動作を伴う腹筋運動です。
          上体をひねることで脇腹が刺激されるため、下腹部だけでなく引き締まったくびれも手に入ります。
          上体をひねるときは反動を使わず、腹筋を意識して行うことがポイントです。
        </p>
        <p>やり方</p>
        <ol class="list-decimal pl-4 text-left text-sm">
          <li>仰向けになり両ひざを曲げ、両手は耳の後ろ付近に当てる。</li>
          <li>
            対角のひじとひざを近づけるように、上体を丸めながら身体をひねる。
          </li>
          <li>反対も同様に行う。</li>
          <li>
            2～3を{{ buttonSet?.repeat }}回×{{
              buttonSet?.count
            }}セット繰り返す。({{ Number(buttonSet?.tempo) * 2 }}秒間/回)
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
        tempo="2"
      />
    </template>
  </BaseFrame>
</template>

<style scoped></style>
