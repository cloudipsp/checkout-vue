<template>
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
    <f-preloader v-if="showAmount" :condition="total_amount" tag="span">
      <f-amount :value="total_amount" :currency="currency" />
    </f-preloader>
  </f-button>
</template>

<script>
import FButton from '@/components/button/button'
import FPreloader from '@/components/preloader'
import FAmount from '@/components/base/amount'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'
import { validatorMixin } from '@/mixins/validator'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FButton,
    FPreloader,
    FAmount,
  },
  mixins: [validatorMixin],
  inject: ['submit'],
  props: {
    noAmount: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      isSubmit: false,
    }
  },
  computed: {
    ...mapState('options', { show: 'button' }),
    ...mapState('options', ['show_button_amount']),
    ...mapState('params', ['currency', 'verification_type']),
    ...mapState(['total_amount']),
    disabled() {
      return this.isError && this.isSubmit
    },
    showAmount() {
      return (
        this.verification_type !== 'amount' &&
        !this.noAmount &&
        this.show_button_amount
      )
    },
  },
  mounted() {
    this.$nextTick().then(this.autoSubmit)
  },
  methods: {
    click() {
      this.isSubmit = true
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
