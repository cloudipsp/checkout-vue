<template>
  <div :class="className" :style="style" :data-e2e-icon="name" />
</template>

<script>
import configMethods from '@/config/methods.json'
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  props: {
    name: makeProp(PROP_TYPE_STRING, undefined, true),
    size: makeProp(PROP_TYPE_STRING, undefined, value => {
      return arrayIncludes(['24', '36', '48'], value)
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
        'background-image': `url(${SAAS_CDN_URL}svg/${
          this.map[this.type] || this.type
        }/${this.name}.svg)`,
      }
    },
    className() {
      return [
        this.$style.style,
        this.$style[`s_${this.size}`],
        this.$style[this.name],
      ]
    },
  },
}
</script>

<style lang="scss" module>
.style {
  display: inline-block;
  vertical-align: middle;
  background-color: $white;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: contain;
}

.s_24 {
  width: px-to-rem(24px);
  min-width: px-to-rem(24px);
  height: px-to-rem(24px);
}

.s_36 {
  width: px-to-rem(36px);
  min-width: px-to-rem(36px);
  height: px-to-rem(36px);
}

.s_48 {
  width: px-to-rem(48px);
  min-width: px-to-rem(48px);
  height: px-to-rem(48px);
}

.trustly {
  width: px-to-rem(50px);
}

.google {
  width: px-to-rem(45px);
  background-color: inherit;
}
</style>
