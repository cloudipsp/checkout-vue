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
import validator from '@/mixins/validator'

export default {
  components: {
    FButton,
    FPreloader,
    FAmount,
  },
  mixins: [validator],
  inject: ['submit'],
  computed: {
    ...mapState(['verification_type', 'isSubmit']),
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
      return this.verification_type !== 'amount' && this.show_button_amount
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
      this.submit()
        .then(model => {
          this.$emit('success', model)
        })
        .catch(errorHandler)
    },
    autoSubmit() {
      if (!this.$route.query.autoSubmit) return
      this.click()
    },
  },
}
</script>
