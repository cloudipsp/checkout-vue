<template>
  <div :class="$style.style" :style="styleLogo" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('options', ['logo_url']),
    styleLogo() {
      return {
        'background-image': `url("${this.logo_url.replace(/"/g, "'")}")`,
      }
    },
  },
}
</script>

<style lang="scss" module>
.style {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 0 50%;
  background-size: contain;
}
</style>
