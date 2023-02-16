<template>
  <div :class="className">
    <div v-if="backdrop" :class="$style.backdrop" />
    <div :class="$style.custom" :style="style" />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  props: {
    backdrop: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapState('options', ['loading']),
    className() {
      return [
        this.$style.wrapper,
        {
          [this.$style.wrapper_backdrop]: this.backdrop,
        },
      ]
    },
    showCustom() {
      return this.loading
    },
    style() {
      return {
        'background-image': `url("${this.loading.replace(/"/g, "'")}")`,
      }
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper_backdrop {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $zindex-loading;
}

.backdrop {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: $container_bg;
  opacity: $modal-backdrop-opacity;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(xl) {
      border-radius: px-to-rem(16px);
    }
  }
}

.custom {
  width: px-to-rem(64px);
  height: px-to-rem(64px);
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: contain;
}
</style>
