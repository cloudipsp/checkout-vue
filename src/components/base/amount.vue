<template>
  <span>
    <component :is="tagAmount" :class="amountClass"
      >{{ integer }}<component :is="tagFractional">{{ fractional }}</component>
    </component>
    <template v-if="currency">
      <span :class="currencyClasses" v-text="$t(currency)" />
    </template>
  </span>
</template>

<script>
import {
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
} from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  props: {
    value: makeProp(PROP_TYPE_NUMBER_STRING),
    currency: makeProp(PROP_TYPE_STRING),
    sup: makeProp(PROP_TYPE_BOOLEAN, false),
    amountClass: makeProp(PROP_TYPE_STRING),
    currencyClass: makeProp(PROP_TYPE_STRING),
    noBold: makeProp(PROP_TYPE_BOOLEAN, false),
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
    tagAmount() {
      return this.noBold ? 'span' : 'b'
    },
    tagFractional() {
      return this.sup ? 'sup' : 'span'
    },
    currencyClasses() {
      return [this.currencyClass, this.$style.currency]
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

<style lang="scss" module>
.currency {
  margin-left: px-to-rem(4px);
}
</style>
