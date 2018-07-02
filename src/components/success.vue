<template>
  <div class="f-success">
    <div class="f-block f-block-hr">
      <div class="f-form-group">
        <div class="f-block f-title3">
          <i :class="['f-icon', 'f-icon-sm', {
            'f-i-error': order.order_status === 'declined',
            'f-i-success': order.order_status === 'approved'
          }]"></i> <span v-t="order.order_status"></span>
        </div>
        <div class="f-row">
          <div class="f-col-xs-6" v-t="{path: 'number_payment', args: [$t('payment_system')]}"></div>
          <div class="f-col-xs-6 f-text-bold">{{ order.payment_id }}</div>
        </div>
        <div class="f-row">
          <div class="f-col-xs-6" v-t="{path: 'number_payment', args: [$t(options.title)]}"></div>
          <div class="f-col-xs-6 f-text-bold">{{ order.order_id }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['order'],
    data () {
      return {
      }
    }
  }
</script>
