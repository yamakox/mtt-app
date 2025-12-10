<script setup lang="ts">
import { useRoute } from 'vue-router'
import BaseFrame from '../components/BaseFrame.vue'
import TrainingButton from '../components/TrainingButton.vue'
import { routes } from '../router'

const route = useRoute()
</script>

<template>
  <BaseFrame>
    <template #title>音で伝える筋トレタイマー</template>
    <template #description>
      <div class="flex flex-col gap-2">
        <p><b>下腹部を鍛える筋トレメニュー編</b></p>
        <p>
          筋トレの回数や秒数を音でカウントダウンします。<br />
          音量を上げてお使いください。
        </p>
      </div>
    </template>
    <template #content>
      <div v-for="i in routes" :key="i.path">
        <router-link class="link" :to="i.path" v-if="i.path !== route.path">
          {{ i.meta?.title }}
          <span class="text-sm">(難易度: {{ i.meta?.difficulty }})</span>
        </router-link>
      </div>
      <div class="m-4 flex w-full flex-col">
        <p>以下のボタンで音量を確認できます。</p>
        <training-button
          :index="0"
          category="音量確認用"
          caption="テスト音声"
          :repeat="1"
          :duration="30"
        />
      </div>
      <div class="flex flex-col gap-2">
        <p>謝辞</p>
        <p>
          筋トレのメニューは<a href="https://www.mtgec.jp/wellness/sixpad/"
            >SIXPAD</a
          >さんの<a
            href="https://www.mtgec.jp/wellness/sixpad/list/parts_lower-abs/"
            >下腹部を引き締める筋トレ</a
          >を参考にさせていただきました。
        </p>
        <p>
          タイマー音には<a href="https://soundeffect-lab.info/">効果音ラボ</a
          >さんの<a href="https://soundeffect-lab.info/sound/button/">素材</a
          >を利用させていただきました。
        </p>
      </div>
    </template>
  </BaseFrame>
</template>

<style scoped>
.link {
  display: block;
  margin: 0.5rem 0;
  font-weight: bold;
  font-size: 1.1rem;
}
</style>
