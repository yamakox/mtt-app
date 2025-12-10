import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../pages/Home.vue'
import DrawIn from '../pages/DrawIn.vue'
import DeadBug from '../pages/DeadBug.vue'
import LegRaise from '../pages/LegRaise.vue'
import Plank from '../pages/Plank.vue'
import TwistCrunch from '../pages/TwistCrunch.vue'
import Squat from '../pages/Squat.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'ホーム',
    },
  },
  {
    path: '/training/draw-in',
    name: 'DrawIn',
    component: DrawIn,
    meta: {
      title: 'ドローイン',
      difficulty: '★☆☆☆☆',
    },
  },
  {
    path: '/training/plank',
    name: 'Plank',
    component: Plank,
    meta: {
      title: 'プランク',
      difficulty: '★★☆☆☆',
    },
  },
  {
    path: '/training/dead-bug',
    name: 'DeadBug',
    component: DeadBug,
    meta: {
      title: 'デッドバグ',
      difficulty: '★★☆☆☆',
    },
  },
  {
    path: '/training/twist-crunch',
    name: 'TwistCrunch',
    component: TwistCrunch,
    meta: {
      title: 'ツイストクランチ',
      difficulty: '★★★★☆',
    },
  },
  {
    path: '/training/leg-raise',
    name: 'LegRaise',
    component: LegRaise,
    meta: {
      title: 'レッグレイズ',
      difficulty: '★★★★★',
    },
  },
  {
    path: '/training/squat',
    name: 'Squat',
    component: Squat,
    meta: {
      title: 'スクワット',
      difficulty: '★★★★★',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
