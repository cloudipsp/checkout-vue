<template>
  <div class="f-success" :data-e2e-status="order.order_status">
    <div>
      <div class="f-form-group">
        <div>
          <f-svg
            v-if="isApproved"
            class="f-text-success"
            name="check-circle"
            size="lg"
          />
          <f-svg
            v-if="isDeclined"
            class="f-text-danger"
            name="times-circle"
            size="lg"
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
            v-t="{ path: 'number_payment', args: [$t(title)] }"
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
import { mapState } from '@/utils/store'

export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('options', ['title']),
    isApproved() {
      return this.order.order_status === 'approved'
    },
    isDeclined() {
      return this.order.order_status === 'declined'
    },
  },
}
</script>
