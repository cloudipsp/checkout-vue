<template>
  <button v-bind="$attrs" :class="className" type="button" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  props: {
    block: makeProp(PROP_TYPE_BOOLEAN, false),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      arrayIncludes(['default', 'secondary'], value)
    ),
  },
  computed: {
    className() {
      return [
        'f-btn',
        'f-btn-link',
        `f-btn-link-${this.variant}`,
        { 'f-btn-block': this.block },
      ]
    },
  },
}
</script>
