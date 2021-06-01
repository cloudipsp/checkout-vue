<template>
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    :class="className"
  >
    <path fill="currentColor" :d="paths" />
  </svg>
</template>

<script>
import icons from '@/config/icons'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  props: {
    name: makeProp(PROP_TYPE_STRING, undefined, true),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(
        [
          'lg',
          'md',
          'xs',
          'sm',
          '1x',
          '2x',
          '3x',
          '4x',
          '5x',
          '6x',
          '7x',
          '8x',
          '9x',
          '10x',
        ],
        value
      )
    ),
    spin: makeProp(PROP_TYPE_BOOLEAN, false),
    fw: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      icons,
    }
  },
  computed: {
    icon() {
      return this.icons[this.name] || [512, 512, 16, '']
    },
    paths() {
      return this.icon[3]
    },
    className() {
      return [
        'f-svg',
        `f-svg-${this.name}`,
        `f-svg-w-${this.icon[2]}`,
        `f-svg-${this.size}`,
        {
          'f-svg-spin': this.spin,
          'f-svg-fw': this.fw,
        },
      ]
    },
    viewBox() {
      return `0 0 ${this.icon[0]} ${this.icon[1]}`
    },
  },
}
</script>
