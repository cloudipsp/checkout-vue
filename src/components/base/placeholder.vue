<template>
  <div>
    <label v-if="maskedValue" class="f-placeholder" :for="id" :style="style">
      {{ placeholderText }}
    </label>
    <span ref="hidden" class="f-placeholder f-hidden">{{ maskedValue }}</span>
  </div>
</template>

<script>
import mask from '@/utils/masker'

export default {
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      required: true,
    },
    mask: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      left: 0,
    }
  },
  computed: {
    maskedValue() {
      return mask(this.value, this.mask, true)
    },
    placeholderText() {
      return this.$t(this.placeholder)
        .slice(this.maskedValue.length)
        .replace(/ /g, '\xa0')
    },
    style() {
      return {
        left: `${this.left}px`,
      }
    },
  },
  watch: {
    maskedValue: 'setLeft',
  },
  mounted() {
    this.setLeft()
  },
  methods: {
    setLeft() {
      this.$nextTick().then(() => {
        this.left = this.$refs.hidden?.offsetWidth
      })
    },
  },
}
</script>
