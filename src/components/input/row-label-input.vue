<template>
  <f-row-label v-slot="{ invalid }" v-bind="attrsRow" @focus="focusInput">
    <f-input
      v-bind="attrs"
      :invalid="invalid"
      v-on="$listeners"
      @focus="focus"
      @blur="blur"
    />
  </f-row-label>
</template>

<script>
import FRowLabel from '@/components/input/row-label'
import FInput from '@/components/input/input'
import { idMixin, idProps } from '@/mixins/id'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FRowLabel,
    FInput,
  },
  mixins: [idMixin],
  inheritAttrs: false,
  props: {
    ...idProps,
    name: makeProp(PROP_TYPE_STRING),
    prepend: makeProp(PROP_TYPE_STRING),
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
        prepend: this.prepend,
        focused: this.focused,
      }
    },
    attrs() {
      return {
        ...this.$attrs,
        ref: 'input',
        id: this.safeId(),
        name: this.name || this.safeId(),
        inputClass: this.inputClass,
      }
    },
    inputClass() {
      return {
        [this.$style.prepend]: this.prepend,
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
    focusInput() {
      this.$refs.input.focus()
    },
  },
}
</script>

<style lang="scss" module>
.prepend {
  --padding-left: #{px-to-rem(40px)};
}
</style>
