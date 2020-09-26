<template>
  <div class="f-success" :data-e2e-status="order.order_status">
    <div class="f-success-title">
      <svg-approved v-if="isApproved" />
      <svg-decline v-if="isDeclined" />
      <div v-t="order.order_status" class="f-title" />
    </div>
    <f-info />
    <div class="f-success-form-group">
      <div class="f-row">
        <div v-t="'payment_id'" class="f-col" />
        <div class="f-col f-text-right">
          {{ order.payment_id }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
