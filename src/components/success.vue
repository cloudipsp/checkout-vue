<template>
  <div class="f-success" :data-e2e-status="order.order_status">
    <div class="f-block f-block-hr">
      <div class="f-form-group">
        <div class="f-block f-title3">
          <i
            :class="[
              'f-icon',
              'f-icon-sm',
              {
                'f-i-error': order.order_status === 'declined',
                'f-i-success': order.order_status === 'approved',
              },
            ]"
          />
          <span v-t="order.order_status" />
        </div>
        <div class="f-row">
          <div
            v-t="{ path: 'number_payment', args: [$t('payment_system')] }"
            class="f-col-xs-6"
          />
          <div class="f-col-xs-6 f-text-bold">
            {{ order.payment_id }}
          </div>
        </div>
        <div class="f-row">
          <div
            v-t="{ path: 'number_payment', args: [$t(options.title)] }"
            class="f-col-xs-6"
          />
          <div class="f-col-xs-6 f-text-bold f-hyphens">
            {{ order.order_id }}
          </div>
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
  data() {
    return {}
  },
}
</script>
