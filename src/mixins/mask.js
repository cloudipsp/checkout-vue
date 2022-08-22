import mask from '@/utils/masker'
import {
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_FUNCTION,
} from '@/constants/props'
import { makeProp } from '@/utils/props'

// @vue/component
export const maskMixin = {
  props: {
    mask: makeProp(PROP_TYPE_STRING),
    masked: makeProp(PROP_TYPE_BOOLEAN, false),
    format: makeProp(PROP_TYPE_FUNCTION, value => value),
    parse: makeProp(PROP_TYPE_FUNCTION, value => value),
  },
  methods: {
    watchInnerValue(newValue) {
      let value = mask(this.format(this.parse(newValue)), this.mask, true)
      if (newValue !== value) {
        this.innerValue = value
        this.$refs.input.localValue = value
        this.$refs.input.vModelValue = value
      } else {
        this.$emit('input', mask(this.parse(newValue), this.mask, this.masked))
      }
    },
    watchValue(newValue, oldValue = '') {
      this.innerValue = mask(
        this.format(newValue),
        this.mask,
        true,
        newValue.length > oldValue.length
      )
    },
  },
}
