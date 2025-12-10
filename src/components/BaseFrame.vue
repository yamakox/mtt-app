<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { routes } from '../router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const prevRoute = ref<RouteRecordRaw | null>(null)
const nextRoute = ref<RouteRecordRaw | null>(null)
const homeRoute = ref<RouteRecordRaw | null>(null)

export interface Props {
  errorMessage?: string
  illustration?: string
}

const props = withDefaults(defineProps<Props>(), {
  errorMessage: undefined,
  illustration: undefined,
})

onMounted(() => {
  if (routes.length > 0 && routes[0]!.path !== route.path) {
    homeRoute.value = routes[0]!
  }
  const index = routes.findIndex((i) => i.path === route.path)
  if (index > -1) {
    prevRoute.value = routes.at(index - 1) ?? null
    nextRoute.value = routes.at((index + 1) % routes.length) ?? null
  }
})
</script>

<template>
  <main class="main">
    <div class="nav-bar">
      <span class="nav-link arrow">&lt;</span>
      <router-link class="nav-link left" :to="prevRoute.path" v-if="prevRoute">
        {{ prevRoute.meta?.title }}
      </router-link>
      <router-link
        class="nav-link center"
        :to="homeRoute.path"
        v-if="homeRoute"
      >
        🏠
      </router-link>
      <div class="nav-link center" v-else />
      <router-link class="nav-link right" :to="nextRoute.path" v-if="nextRoute">
        {{ nextRoute.meta?.title }}
      </router-link>
      <span class="nav-link arrow">&gt;</span>
    </div>
    <div class="illustration-container" v-if="props.illustration">
      <img class="illustration" :src="props.illustration" />
    </div>
    <div class="error text-center" v-if="props.errorMessage">
      エラーが発生しました:<br />
      {{ props.errorMessage }}
    </div>
    <h1 class="title w-lg text-center text-xl font-bold">
      <slot name="title" />
    </h1>
    <div class="description text-center">
      <slot name="description" />
    </div>
    <div class="content text-center">
      <slot name="content" />
    </div>
    <div class="description text-center">
      <a href="https://notolog.tech/">&copy; 2025 notolog.tech</a>
    </div>
  </main>
</template>

<style scoped></style>
