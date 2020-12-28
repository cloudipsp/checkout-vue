<template>
  <transition name="fade-enter">
    <div v-if="show" key="1" :class="className" />
    <div v-else key="2"><slot /></div>
  </transition>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  props: {
    condition: {
      type: [String, Number, Boolean],
      required: true,
    },
    size: {
      type: String,
      default: null,
      validator: value => ['xs', 'sm'].includes(value),
    },
  },
  computed: {
    ...mapState(['ready']),
    show() {
      return !this.condition && !this.ready
    },
    className() {
      return [
        'f-preloader',
        {
          [`f-preloader-${this.size}`]: this.size,
        },
      ]
    },
  },
}
</script>
