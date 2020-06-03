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
      default: null,
      validator: value => ['lg', 'sm'].includes(value),
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
