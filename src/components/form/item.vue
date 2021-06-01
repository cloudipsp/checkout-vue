<template>
  <component :is="name" :class="className" v-bind="$attrs" v-on="$listeners">
    <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
  </component>
</template>

<script>
import FFormItemInput from '@/components/form/item/input'
import FFormItemDate from '@/components/form/item/date'
import FFormItemCheckbox from '@/components/form/item/checkbox'
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    FFormItemInput,
    FFormItemDate,
    FFormItemCheckbox,
  },
  inheritAttrs: false,
  props: {
    component: makeProp(PROP_TYPE_STRING, 'input', value =>
      arrayIncludes(['input', 'date', 'checkbox', 'select'], value)
    ),
  },
  computed: {
    name() {
      return 'f-form-item-' + this.component
    },
    className() {
      return [
        'f-form-item-' + this.component,
        {
          ['f-form-item-' + this.$attrs.size]: this.$attrs.size,
        },
      ]
    },
  },
}
</script>
