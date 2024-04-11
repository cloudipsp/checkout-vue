<template>
  <div :class="$style.wrapper" :data-e2e-status="status">
    <div :class="$style.center">
      <svg-approved v-if="isApproved" :class="$style.svg" />
      <svg-decline v-if="isDeclined" :class="$style.svg" />
      <div :class="$style.title" v-text="title" />
    </div>
    <click2pay-new-user-success-page-wrapper />
    <click2pay-user-exists-success-page-wrapper />
    <f-info />
    <f-price readonly />
    <f-link-download-receipt v-if="receipt_url" />
    <div :class="$style.box">
      <div class="f-row">
        <div class="f-col" v-text="$t('payment_id')" />
        <div class="f-col" :class="$style.right" data-e2e-payment-id>
          {{ order_data.payment_id }}
        </div>
      </div>
    </div>
    <f-button-return-to-site v-if="response_url" />
  </div>
</template>

<script>
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import SvgApproved from '@/svg/approved.svg'
import SvgDecline from '@/svg/decline.svg'
import { mapState } from '@/utils/store'
import { FButtonReturnToSite, FLinkDownloadReceipt } from '@/import'
import Click2payNewUserSuccessPageWrapper from '@/views/click2pay/new-user-success-page-wrapper'
import Click2payUserExistsSuccessPageWrapper from '@/views/click2pay/user-exists-success-page-wrapper'

export default {
  components: {
    FInfo,
    FPrice,
    SvgDecline,
    SvgApproved,
    FLinkDownloadReceipt,
    FButtonReturnToSite,
    Click2payNewUserSuccessPageWrapper,
    Click2payUserExistsSuccessPageWrapper,
  },
  computed: {
    ...mapState('order', ['order_data', 'response_url', 'receipt_url']),
    status() {
      return this.order_data.order_status
    },
    isApproved() {
      return this.status === 'approved'
    },
    isDeclined() {
      return this.status === 'declined'
    },
    title() {
      return this.$t(`title_${this.status}`)
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  width: 100%;
  max-width: px-to-rem(384px);
  margin: 0 auto;
}

.center {
  text-align: center;
}

.svg {
  margin: px-to-rem(-16px) 0;
}

.title {
  margin: 0;
  margin-bottom: px-to-rem(20px);
  font-size: px-to-rem(20px);
  font-weight: 500;
  text-align: center;
  color: $title_color;
}

.box {
  padding: px-to-rem(16px);
  word-wrap: break-word;
  border: 1px solid $input_border;
  border-radius: px-to-rem(8px);
}

.right {
  text-align: right;
}
</style>
