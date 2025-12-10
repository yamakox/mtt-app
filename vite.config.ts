import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { cloudflare } from "@cloudflare/vite-plugin"

// 追加
import tailwindcss from "@tailwindcss/vite"
import { loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    plugins: [
      vue(),
      vueDevTools(),
      cloudflare(),
      tailwindcss(),  // 追加
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },

    // 以下、追加
    // NOTE: Vue RouterのcreateWebHistory(import.meta.env.BASE_URL)で用いられるベースURLは`base`で設定する。
    base: env.BASE_URL || "/",
    server: {
      host: true,
      hmr: {
        host: "localhost",
        // HMR crashes with ENOENT when deleting SVG asset with Vite + Tailwind v4
        // https://github.com/vitejs/vite/issues/19786
        overlay: false,
      },
    },
    build: {
      outDir: fileURLToPath(
        new URL(env.BUILD_DIR || "./dist", import.meta.url)
      ),
      emptyOutDir: true, // ビルド時にフォルダーを空にする(以前のjsファイルなどが残るため)
      chunkSizeWarningLimit: 1024 * 1024 * 10, // 10MiB
    },
  }
})
