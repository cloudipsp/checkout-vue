import mask from '@/utils/masker'
import {
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_FUNCTION,
} from '@/constants/props'
import { makeProp } from '@/utils/props'

const config = {}

// @vue/component
export const maskMixin = {
  props: {
    mask: makeProp(PROP_TYPE_STRING),
    masked: makeProp(PROP_TYPE_BOOLEAN, false),
    format: makeProp(PROP_TYPE_FUNCTION, value => value),
    parse: makeProp(PROP_TYPE_FUNCTION, value => value),
  },
  data() {
    return {
      innerMask: config[this.mask] || this.mask,
    }
  },
  methods: {
    watchInnerValue(newValue) {
      let value = mask(this.format(this.parse(newValue)), this.innerMask, true)
      if (newValue !== value) {
        this.innerValue = value
        this.$refs.input.localValue = value
      } else {
        this.$emit(
          'input',
          mask(this.parse(newValue), this.innerMask, this.masked)
        )
      }
    },
    watchValue(newValue) {
      this.innerValue = mask(this.format(newValue), this.innerMask, true)
    },
  },
}
