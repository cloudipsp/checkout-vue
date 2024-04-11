<template>
  <div :class="$style.mb_36">
    <click2pay-user-exists-success-page-header />
    <transition name="f-fade-enter">
      <click2pay-loader v-if="isLoading" key="1" />
      <div
        v-else-if="isRegistered"
        key="2"
        :class="$style.registered"
        v-text="$t('c2p_card_add')"
      />
      <div
        v-else-if="isExpired"
        key="3"
        :class="$style.expired"
        v-text="$t('c2p_card_add_expired')"
      />
      <div
        v-else-if="isError"
        key="4"
        :class="$style.error"
        v-text="$t(error)"
      />
    </transition>
  </div>
</template>

<script>
import Click2payUserExistsSuccessPageHeader from '@/views/click2pay/user-exists-success-page-header'
import Click2payLoader from '@/views/click2pay/loader'
import { checkout } from '@/click2pay'
import { mapState } from '@/utils/store'

export default {
  components: {
    Click2payUserExistsSuccessPageHeader,
    Click2payLoader,
  },
  data() {
    return {
      status: '',
    }
  },
  computed: {
    ...mapState('order', ['order_data']),
    isLoading() {
      return this.status === 'loading'
    },
    isRegistered() {
      return this.status === 'registered'
    },
    isError() {
      return this.status === 'error'
    },
    isExpired() {
      return this.status === 'expired'
    },
  },
  created() {
    this.store
      .click2payCardEncrypt({
        first_name: ' ',
        last_name: ' ',
      })
      .then(({ encryptedCard }) => {
        checkout({
          ...this.order_data.click2pay_checkout_data,
          encryptedCard,
        })
          .then(() => {
            this.status = 'registered'
          })
          .catch(error => {
            this.status = 'error'
            this.error = error
          })
      })
      .catch(() => {
        this.status = 'expired'
      })
  },
  mounted() {
    this.status = 'loading'
  },
}
</script>

<style lang="scss" module>
.registered {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: #08a835;
}

.error {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: $error;
}

.expired {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: $error;
}

.mb_36 {
  margin-bottom: px-to-rem(36px);
}
</style>
