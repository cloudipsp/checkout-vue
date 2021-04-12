<template>
  <ul>
    <li>{{ commithash }} {{ branch }}</li>
    <li v-for="error in $route.query.errors" :key="error">
      {{ error }}
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      commithash: COMMITHASH,
      branch: BRANCH,
    }
  },
}
</script>
