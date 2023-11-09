<template>
  <div>
    <f-button
      v-if="show"
      class="f-button-pay"
      variant="success"
      :disabled="form.disabled"
      size="lg"
      block
      @click="click"
    >
      <span v-text="$t('pay')" />&nbsp;
      <f-preloader v-if="showAmount" :condition="total_amount" tag="span">
        <f-amount :value="total_amount" :currency="currency" />
      </f-preloader>
    </f-button>
    <div v-if="isDemo" class="f-demo-desc" v-text="$t('demo-desc')" />
    <f-button-cancel v-if="cancel_url" />
  </div>
</template>

<script>
import FButton from '@/components/button/button'
import FPreloader from '@/components/preloader'
import FAmount from '@/components/base/amount'
import { FButtonCancel } from '@/import'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FButton,
    FPreloader,
    FAmount,
    FButtonCancel,
  },
  inject: ['submit', 'form'],
  props: {
    noAmount: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapState(['cancel_url']),
    ...mapState('options', { show: 'button' }),
    ...mapState('options', ['show_button_amount', 'disable_request']),
    ...mapState('params', ['currency', 'verification_type']),
    ...mapState(['total_amount']),
    showAmount() {
      return (
        this.verification_type !== 'amount' &&
        !this.noAmount &&
        this.show_button_amount
      )
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
