<template>
  <div>
    <div v-if="error" :class="$style.error" v-text="$t(error)" />
    <f-button
      class="f-button-pay"
      variant="success"
      size="lg"
      block
      @click="click"
    >
      <span v-text="$t('pay')" />&nbsp;
      <f-amount v-if="showAmount" :value="total_amount" :currency="currency" />
      <f-svg v-if="loading" :class="$style.spin" name="redo" size="20" spin />
    </f-button>
  </div>
</template>

<script>
import FButton from '@/components/button/button'
import FAmount from '@/components/base/amount'
import FSvg from '@/components/svg'
import { validatorMixin } from '@/mixins/validator'
import { mapState } from '@/utils/store'
import { checkoutSelectedCard } from '@/click2pay'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FButton,
    FAmount,
    FSvg,
  },
  mixins: [validatorMixin],
  inject: ['validate', 'formRequest'],
  data() {
    return {
      isSubmit: false,
      loading: false,
      error: '',
    }
  },
  computed: {
    ...mapState('options', ['show_button_amount']),
    ...mapState('params', ['currency']),
    ...mapState(['total_amount']),
    disabled() {
      return this.isError && this.isSubmit
    },
    showAmount() {
      return this.show_button_amount
    },
  },
  methods: {
    click() {
      if (this.loading) return
      this.loading = true

      this.error = ''

      this.isSubmit = true

      this.validate()
        .then(() =>
          checkoutSelectedCard().catch(error => {
            this.error = error

            return Promise.reject()
          })
        )
        .then(this.formRequest)
        .finally(() => {
          this.loading = false
        })
        .catch(errorHandler)
    },
  },
}
</script>

<style lang="scss" module>
.error {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: $error;
  margin-bottom: px-to-rem(8px);
}

.spin {
  position: relative;
  z-index: 1;
  margin-left: px-to-rem(4px);
}
</style>
