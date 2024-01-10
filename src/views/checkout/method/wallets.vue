<template>
  <div class="f-container-sm">
    <template v-if="isBreakpointDownLg">
      <f-price />
    </template>
    <f-field-email />
    <f-fields-custom />
    <f-fields-user />
    <f-offer />
    <f-button-wallet-el />
    <f-button-cancel v-if="cancel_url" />
  </div>
</template>

<script>
import FPrice from '@/components/price'
import FFieldEmail from '@/components/fields/email'
import FFieldsCustom from '@/components/fields/custom'
import FFieldsUser from '@/components/fields/user'
import FOffer from '@/components/offer'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import { FButtonCancel } from '@/import'
import { resizeMixin } from '@/mixins/resize'
import { mapState } from '@/utils/store'

export default {
  components: {
    FPrice,
    FFieldEmail,
    FFieldsCustom,
    FFieldsUser,
    FButtonCancel,
    FOffer,
    FButtonWalletEl,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState(['cancel_url']),
  },
}
</script>
