<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import BaseFrame from '../components/BaseFrame.vue'
import TrainingButtonSet from '../components/TrainingButtonSet.vue'
import { useRoute } from 'vue-router'
import illustration from '@/assets/plank.png'

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
          基本の体幹トレーニングとして有名な、うつ伏せの姿勢をキープするトレーニングです。
          身体を真っすぐにキープすることで、腹筋やインナーマッスルなど数多くの筋肉を鍛えることができます。
          腹直筋・腹斜筋・腹横筋を鍛えることで、お腹周りの引き締めが期待できます。
        </p>
        <p>やり方</p>
        <ol class="list-decimal pl-4 text-left text-sm">
          <li>うつ伏せの姿勢から両ひじを床につける。</li>
          <li>
            腰を浮かせてつま先を立て、横から見ると一直線になるように姿勢をキープする。
          </li>
          <li>2の姿勢を{{ buttonSet?.duration }}秒キープする。</li>
        </ol>
      </div>
    </template>
    <template #content>
      <training-button-set
        ref="buttonSet"
        :category="category"
        count="1"
        duration="60"
        durationMin="10"
        durationMax="60"
        durationStep="10"
      />
    </template>
  </BaseFrame>
</template>

<style scoped></style>
