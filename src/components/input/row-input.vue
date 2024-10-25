<template>
  <f-row v-slot="{ invalid }" v-bind="attrsRow">
    <f-input
      v-bind="attrs"
      :invalid="invalid"
      v-on="$listeners"
      @focus="focus"
      @blur="blur"
    />
  </f-row>
</template>

<script>
import FRow from '@/components/input/row'
import FInput from '@/components/input/input'
import { idMixin, idProps } from '@/mixins/id'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FRow,
    FInput,
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
