<template>
  <span>
    <b :class="amountClass">
      {{ integer }}
      <component :is="tagFractional">{{ fractional }}</component>
    </b>
    &nbsp;
    <span v-t="currency" :class="currencyClass" />
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    sup: {
      type: Boolean,
      default: false,
    },
    amountClass: {
      type: String,
      default: null,
    },
    currencyClass: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      separator: '.',
    }
  },
  computed: {
    amount() {
      let result = this.value / 100
      try {
        result = new Intl.NumberFormat().format(result)
        // eslint-disable-next-line no-empty
      } catch (e) {}

      if (this.value % 100 === 0) {
        result = result + this.separator + '00'
      } else if (this.value % 10 === 0) {
        result = result + '0'
      }

      return result
    },
    integer() {
      return String(this.amount).slice(0, -2)
    },
    fractional() {
      return String(this.amount).slice(-2)
    },
    tagFractional() {
      return this.sup ? 'sup' : 'span'
    },
  },
  created() {
    try {
      this.separator = new Intl.NumberFormat().format(0.1)[1]
      // eslint-disable-next-line no-empty
    } catch (e) {}
  },
}
</script>
