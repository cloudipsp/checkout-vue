<template>
  <ul>
    <li>{{ commithash }} {{ branch }}</li>
    <li v-for="error in $route.query.errors" :key="error">
      {{ error }}
    </li>
  </ul>
</template>

<script>
import { commithash, branch } from '@/config/config'

export default {
  data() {
    return {
      commithash,
      branch,
    }
  },
}
</script>
