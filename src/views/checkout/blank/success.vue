<template>
  <div class="f-success" :data-e2e-status="order.order_status">
    <div class="f-success-title">
      <svg-approved v-if="isApproved" />
      <svg-decline v-if="isDeclined" />
      <div class="f-title" v-text="$t(order.order_status)" />
    </div>
    <f-info readonly />
    <div class="f-success-form-group">
      <div class="f-row">
        <div class="f-col" v-text="$t('payment_id')" />
        <div class="f-col f-text-right">
          {{ order.payment_id }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FInfo from '@/components/info'
import SvgApproved from '@/svg/approved'
import { SvgDecline } from '@/import'

export default {
  components: {
    FInfo,
    SvgDecline,
    SvgApproved,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isApproved() {
      return this.order.order_status === 'approved'
    },
    isDeclined() {
      return this.order.order_status === 'declined'
    },
  },
}
</script>
