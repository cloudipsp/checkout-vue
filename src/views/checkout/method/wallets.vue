<template>
  <div class="f-container-sm">
    <template v-if="isBreakpointMd">
      <f-price />
    </template>
    <f-fields-customer />
    <f-fields-button />
    <f-fields-user />
    <f-offer />
    <f-button-wallet-el />
  </div>
</template>

<script>
import FPrice from '@/components/price'
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsButton from '@/components/fields/button'
import FFieldsUser from '@/components/fields/user'
import FOffer from '@/components/offer'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FPrice,
    FFieldsCustomer,
    FFieldsButton,
    FFieldsUser,
    FOffer,
    FButtonWalletEl,
  },
  mixins: [resizeMixin],
}
</script>
