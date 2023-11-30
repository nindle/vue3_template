<template>
  <router-view v-slot="{ Component }">
    <component
      :is="Component"
      :key="$route.name"
      v-if="!$route.meta.keepAlive"
    />
  </router-view>
</template>

<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue"
</script>

<style scoped></style>
