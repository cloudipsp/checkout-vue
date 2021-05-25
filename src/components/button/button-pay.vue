<template>
  <div>
    <f-button
      v-if="show"
      class="f-button-pay"
      variant="success"
      :disabled="disabled"
      size="lg"
      block
      @click="click"
    >
      <span v-text="$t('pay')" />&nbsp;
      <f-preloader v-if="showAmount" :condition="fullAmount" tag="span">
        <f-amount :value="fullAmount" :currency="currency" />
      </f-preloader>
    </f-button>
    <div v-if="isDemo" class="f-demo-desc" v-text="$t('demo-desc')" />
  </div>
</template>

<script>
import FButton from '@/components/button/button'
import FPreloader from '@/components/preloader'
import FAmount from '@/components/base/amount'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'
import { validatorMixin } from '@/mixins/validator'

export default {
  components: {
    FButton,
    FPreloader,
    FAmount,
  },
  mixins: [validatorMixin],
  inject: ['submit'],
  props: {
    noAmount: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSubmit: false,
    }
  },
  computed: {
    ...mapState('options', { show: 'button' }),
    ...mapState('options', ['show_button_amount', 'disable_request']),
    ...mapState('params', ['amount', 'amount_with_fee', 'currency']),
    disabled() {
      return this.isError && this.isSubmit
    },
    fullAmount() {
      return this.amount_with_fee || this.amount
    },
    showAmount() {
      return !this.noAmount && this.show_button_amount
    },
    isDemo() {
      return this.disable_request
    },
  },
  mounted() {
    this.$nextTick().then(this.autoSubmit)
  },
  methods: {
    click() {
      this.isSubmit = true
      this.submit().catch(errorHandler)
    },
    autoSubmit() {
      if (!this.$route.query.autoSubmit) return
      this.click()
    },
  },
}
</script>
