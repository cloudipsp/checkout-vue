<template>
  <f-row-floating
    v-slot="{ focus, blur, invalid }"
    v-bind="attrsRow"
    @focus="focusInput"
  >
    <f-input
      v-bind="attrs"
      :invalid="invalid"
      v-on="$listeners"
      @focus="focus"
      @blur="blur"
    />
  </f-row-floating>
</template>

<script>
import FRowFloating from '@/components/input/row-floating'
import FInput from '@/components/input/input'
import { idMixin, idProps } from '@/mixins/id'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FRowFloating,
    FInput,
  },
  mixins: [idMixin],
  inheritAttrs: false,
  props: {
    ...idProps,
    prepend: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    name() {
      return this.$attrs.name ? `f-${this.$attrs.name}` : this.safeId()
    },
    attrsRow() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        name: this.name,
        prepend: this.prepend,
      }
    },
    attrs() {
      return {
        ...this.$attrs,
        ref: 'input',
        id: this.safeId(),
        name: this.name,
        inputClass: this.inputClass,
      }
    },
    inputClass() {
      return [
        this.$style.floating,
        {
          [this.$style.prepend]: this.prepend,
        },
      ]
    },
  },
  methods: {
    focusInput() {
      this.$refs.input.focused()
    },
  },
}
</script>

<style lang="scss" module>
.prepend {
  --padding-left: #{px-to-rem(40px)};
}

.floating {
  --padding-top: #{px-to-rem(26px)};
}
</style>
