<template>
  <div class="f-container-sm">
    <template v-if="isBreakpointMd">
      <f-price />
    </template>
    <f-field-email />
    <f-fields-customer />
    <f-fields-button />
    <f-fields-user />
    <f-offer />
    <div ref="button-pay-wallet" />
  </div>
</template>

<script>
import FPrice from '@/components/price'
import FFieldEmail from '@/components/fields/email'
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsButton from '@/components/fields/button'
import FFieldsUser from '@/components/fields/user'
import FOffer from '@/components/offer'
import { resizeMixin } from '@/mixins/resize'
import { mountedButtonPayWallet } from '@/components/button-pay-wallet'

export default {
  components: {
    FPrice,
    FFieldEmail,
    FFieldsCustomer,
    FFieldsButton,
    FFieldsUser,
    FOffer,
  },
  mixins: [resizeMixin],
  mounted() {
    mountedButtonPayWallet(this.$refs['button-pay-wallet'])
  },
}
</script>
