<template>
  <transition name="fade-enter">
    <component :is="tag" v-if="show" key="1" :class="className" />
    <component :is="tag" v-else key="2"><slot /></component>
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
    tag: {
      type: String,
      default: 'div',
      validator: value => ['div', 'span'].includes(value),
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
