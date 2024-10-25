<template>
  <f-row v-slot="{ invalid }" v-bind="attrsRow">
    <f-checkbox
      v-bind="attrs"
      :invalid="invalid"
      v-on="$listeners"
      @focus="focus"
      @blur="blur"
    >
      <slot />
    </f-checkbox>
  </f-row>
</template>

<script>
import FRow from '@/components/input/row'
import FCheckbox from '@/components/input/checkbox'
import { idMixin, idProps } from '@/mixins/id'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FRow,
    FCheckbox,
  },
  mixins: [idMixin],
  inheritAttrs: false,
  props: {
    ...idProps,
    name: makeProp(PROP_TYPE_STRING),
  },
  data() {
    return {
      focused: false,
    }
  },
  computed: {
    attrsRow() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        name: this.name || this.safeId(),
        focused: this.focused,
      }
    },
    attrs() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        name: this.name || this.safeId(),
      }
    },
  },
  methods: {
    focus() {
      this.focused = true
    },
    blur() {
      this.focused = false
    },
  },
}
</script>
