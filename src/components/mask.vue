<template>
  <input v-mask="mask" type="text" :value="display" @input="input" />
</template>

<script>
import mask from '@/directives/mask'
import masker from '@/utils/masker'

export default {
  directives: { mask },
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    mask: {
      type: [String],
      required: true,
    },
    masked: {
      // by default emits the value unformatted, change to true to format with the mask
      type: Boolean,
      default: false, // raw
    },
  },
  data() {
    return {
      lastValue: null, // avoid unecessary emit when has no change
      display: this.value,
    }
  },
  watch: {
    value(newValue) {
      if (newValue !== this.lastValue) {
        this.display = newValue
      }
    },
    masked() {
      this.refresh(this.display)
    },
  },
  methods: {
    input(ev) {
      if (ev.isTrusted) return // ignore native event
      this.refresh(ev.target.value)
    },

    refresh(value) {
      this.display = value
      value = masker(value, this.mask, this.masked)
      if (value !== this.lastValue) {
        this.lastValue = value
        this.$emit('input', value)
      }
    },
  },
}
</script>
