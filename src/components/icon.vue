<template>
  <div :class="className" :style="style" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value),
    },
  },
  computed: {
    ...mapState(['cdn']),
    style() {
      return {
        'background-image': `url(${this.cdn}banks/${this.name}.svg)`,
      }
    },
    className() {
      return ['f-icon', `f-icon-${this.size}`]
    },
  },
}
</script>

<style lang="scss">
.f-icon {
  display: inline-block;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 90%;
}

.f-icon-block {
  display: block;
  width: 100%;
  background-size: contain;
}

.f-icon-contain {
  background-size: contain;
}

.f-icon-sm {
  width: 24px;
  height: 24px;
  background-size: contain;
}

.f-icon-md {
  width: 48px;
  height: 48px;
  background-size: contain;
}

.f-icon-lg {
  width: 64px;
  height: 64px;
  background-size: contain;
}
</style>
