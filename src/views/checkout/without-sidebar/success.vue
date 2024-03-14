<template>
  <div class="f-success" :data-e2e-status="status">
    <div class="f-success-title">
      <svg-approved v-if="isApproved" />
      <svg-decline v-if="isDeclined" />
      <div class="f-title" v-text="title" />
    </div>
    <f-info />
    <f-price readonly />
    <div class="f-success-form-group">
      <div class="f-row">
        <div class="f-col" v-text="$t('payment_id')" />
        <div class="f-col f-text-right">
          {{ order.order_data.payment_id }}
        </div>
      </div>
    </div>
    <f-button-return-to-site v-if="response_url" />
  </div>
</template>

<script>
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import SvgApproved from '@/svg/approved'
import SvgDecline from '@/svg/decline'
import { mapState } from '@/utils/store'
import { FButtonReturnToSite } from '@/import'

export default {
  components: {
    FInfo,
    FPrice,
    SvgDecline,
    SvgApproved,
    FButtonReturnToSite,
  },
  computed: {
    ...mapState(['order']),
    ...mapState('order', ['response_url']),
    status() {
      return this.order.order_data.order_status
    },
    isApproved() {
      return this.status === 'approved'
    },
    isDeclined() {
      return this.status === 'declined'
    },
    title() {
      return this.$t(`title-${this.status}`)
    },
  },
}
</script>
