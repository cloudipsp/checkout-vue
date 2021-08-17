<template>
  <transition name="f-fade-enter">
    <component :is="tag" v-if="showPreloader" key="1" :class="className" />
    <component :is="tag" v-if="showContent" key="2"><slot /></component>
  </transition>
</template>

<script>
import { mapState } from '@/utils/store'
import { PROP_TYPE_STRING, PROP_TYPE_ANY } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  props: {
    condition: makeProp(PROP_TYPE_ANY, undefined, true),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['xs', 'sm'], value)
    ),
    tag: makeProp(PROP_TYPE_STRING, 'div'),
  },
  computed: {
    ...mapState(['ready']),
    showPreloader() {
      return !this.condition && !this.ready
    },
    showContent() {
      return this.condition
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
