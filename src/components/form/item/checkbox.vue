<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <checkbox
      v-model="innerValue"
      :class="classInput"
      v-bind="attrs"
      v-on="$listeners"
      @keyup.enter="onEnter"
    />
    <label :class="classLabel" :for="attrs.id">
      <slot>{{ $t(label) }}</slot>
    </label>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import { itemMixin } from '@/mixins/item'
import Checkbox from '@/components/form/item/helpers/checkbox'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    ValidationProvider,
    Checkbox,
  },
  mixins: [itemMixin],
  props: {
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      arrayIncludes(['default', 'secondary'], value)
    ),
    switch: makeProp(PROP_TYPE_BOOLEAN, false),
    label: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    classInput() {
      return [
        {
          'f-switch': this.switch,
          'f-checkbox': !this.switch,
          [`f-checkbox-${this.variant}`]: !this.switch,
          'f-checkbox-error': this.hasError,
        },
        this.inputClass,
      ]
    },
    classLabel() {
      return {
        'f-switch-label': this.switch,
        'f-checkbox-label': !this.switch,
      }
    },
  },
  created() {
    if (this.rules.required) {
      this.rules.required = { allowFalse: false }
    }
  },
  methods: {
    watchValue(newValue) {
      this.innerValue = Boolean(newValue)
    },
  },
}
</script>
