<template>
  <div :class="className" :style="style" />
</template>

<script>
import configMethods from '@/config/methods.json'
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  props: {
    name: makeProp(PROP_TYPE_STRING, undefined, true),
    size: makeProp(PROP_TYPE_STRING, 'md', value => {
      return arrayIncludes(['sm', 'md', 'lg'], value)
    }),
    type: makeProp(PROP_TYPE_STRING, 'card', value => {
      return arrayIncludes([...configMethods, 'card/max'], value)
    }),
  },
  data() {
    return {
      map: {
        banklinks_eu: 'banks',
        local_methods: 'banks',
      },
    }
  },
  computed: {
    style() {
      return {
        'background-image': `url(${CDN}svg/${
          this.map[this.type] || this.type
        }/${this.name}.svg)`,
      }
    },
    className() {
      return ['f-icon', `f-icon-${this.size}`, `f-icon-${this.name}`]
    },
  },
}
</script>
