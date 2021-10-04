<template>
  <div class="f-container-sm">
    <template v-if="isBreakpointMd">
      <f-price />
    </template>
    <f-fields-customer />
    <f-fields-button />
    <f-fields-user />
    <f-offer />
    <div ref="button-pay-wallet" />
  </div>
</template>

<script>
import FPrice from '@/components/price'
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsButton from '@/components/fields/button'
import FFieldsUser from '@/components/fields/user'
import FOffer from '@/components/offer'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FPrice,
    FFieldsCustomer,
    FFieldsButton,
    FFieldsUser,
    FOffer,
  },
  mixins: [resizeMixin],
  mounted() {
    this.store.mountedButtonPayWallet(this.$refs['button-pay-wallet'])
  },
  destroyed() {
    this.store.destroyedButtonPayWallet()
  },
}
</script>
