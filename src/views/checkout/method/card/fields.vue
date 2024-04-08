<template>
  <div>
    <transition name="f-fade-enter">
      <router-view />
    </transition>
    <f-fields-customer />
    <f-fields-custom />
    <f-fields-user />
    <f-subscription-wrapper />
    <f-offer />
    <router-view name="button-pay" />
    <div v-if="isDemo" class="f-demo-desc" v-text="$t('demo_desc')" />
    <f-button-cancel-wrapper />
  </div>
</template>

<script>
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsCustom from '@/components/fields/custom'
import FFieldsUser from '@/components/fields/user'
import FSubscriptionWrapper from '@/components/subscription-wrapper'
import FOffer from '@/components/offer'
import FButtonCancelWrapper from '@/components/button/button-cancel-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FFieldsCustomer,
    FFieldsCustom,
    FFieldsUser,
    FSubscriptionWrapper,
    FOffer,
    FButtonCancelWrapper,
  },
  computed: {
    ...mapState('options', ['disable_request']),
    isDemo() {
      return this.disable_request
    },
  },
}
</script>
