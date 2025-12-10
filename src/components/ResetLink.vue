<script setup lang="ts">
function reload() {
  location.reload()
}
</script>

<template>
  <a href="#" class="mt-2 text-sm" @click.prevent="reload">リセット</a>
</template>

<style scoped></style>
