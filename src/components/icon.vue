<template>
  <div :class="className" :style="style" />
</template>

<script>
import { mapState } from '@/utils/store'
import configMethods from '@/config/methods.json'

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
    type: {
      type: String,
      default: 'card',
      validator: value => [...configMethods, 'card_system/max'].includes(value),
    },
  },
  data() {
    return {
      map: {
        card: 'card_system',
        banklinks_eu: 'banks',
        xz: 'digital_wallet',
      },
    }
  },
  computed: {
    ...mapState(['cdnIcons']),
    skip() {
      return this.name === 'no_logo'
    },
    style() {
      if (this.skip) return {}
      return {
        'background-image': `url(${this.cdnIcons}svg/${this.map[this.type] ||
          this.type}/${this.name}.svg)`,
      }
    },
    className() {
      return ['f-icon', `f-icon-${this.size}`, `f-icon-${this.name}`]
    },
  },
}
</script>
