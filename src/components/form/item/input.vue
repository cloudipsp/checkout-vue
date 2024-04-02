<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <f-form-input
      ref="input"
      v-model="innerValue"
      :class="className"
      v-bind="attrs"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @keydown="$emit('keydown', $event)"
      @keyup.enter="onEnter"
    />
    <slot :id="id" />
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import { itemMixin } from '@/mixins/item'
import { FFormInput } from '@/components/form/item/helpers/form-input'
import { removeAddEventListenerMixin } from '@/mixins/remove-add-event-listener'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_FUNCTION } from '@/constants/props'

export default {
  components: {
    ValidationProvider,
    FFormInput,
  },
  mixins: [itemMixin, removeAddEventListenerMixin],
  props: {
    format: makeProp(PROP_TYPE_FUNCTION, value => value),
    parse: makeProp(PROP_TYPE_FUNCTION, value => value),
    noLabelFloating: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    className() {
      return [
        {
          'f-form-control-no-floating': this.noLabelFloating,
        },
        this.classInput,
      ]
    },
  },
  methods: {
    watchInnerValue(newValue) {
      let value = this.format(this.parse(newValue))

      if (newValue !== value) {
        this.innerValue = value
        this.$refs.input.localValue = value
        this.$refs.input.vModelValue = value
      } else {
        this.$emit('input', this.parse(newValue))
      }
    },
    watchValue(newValue) {
      this.innerValue = this.format(newValue)
    },
  },
}
</script>
