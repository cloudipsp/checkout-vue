<template>
  <div :class="$style.style" :style="style" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('options', ['logo_url', 'theme']),
    style() {
      return {
        'background-image': `url("${this.url.replace(/"/g, "'")}")`,
      }
    },
    url() {
      return this.logo_url || LOGO_URL[this.theme.type]
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
