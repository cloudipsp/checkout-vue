<template>
  <div class="f-container-sm">
    <click2pay-header :class="$style.mb_16" :email-short="email" />
    <h3 :class="$style.h3" v-text="$t('c2p_otp_title')" />
    <div :class="$style.desc" v-text="$t('c2p_otp_desc', { email, phone })" />
    <div v-if="second" :class="$style.time">
      <span v-text="$t('invite_new_code', { time })" />
    </div>
    <div v-else :class="$style.resend">
      <f-link @click="click">{{ $t('send_again') }}</f-link>
    </div>
    <f-form v-slot="{ submit, disabled }" @submit="onSubmit">
      <div :class="$style.mb_20">
        <f-form-group
          v-model="validationData"
          name="otp"
          label=""
          :placeholder="$t('enter_otp')"
          size="48"
          rules="required|digits:6"
          no-label-floating
          :format="format"
          :disabled="loading"
        />
      </div>
      <transition name="fade-enter">
        <div v-if="message" :class="$style.message">{{ message }}</div>
      </transition>
      <transition name="fade-enter">
        <div v-if="messageOk" :class="$style.message_ok">{{ messageOk }}</div>
      </transition>
      <f-button
        variant="success"
        size="lg"
        block
        :disabled="disabled"
        @click="submit"
      >
        <span v-text="$t('check_and_continue')" />
        <f-svg v-if="loading" :class="$style.spin" name="redo" size="20" spin />
      </f-button>
    </f-form>
  </div>
</template>

<script>
import Click2payHeader from '@/views/click2pay/header'
import FForm from '@/components/form/form/form'
import FLink from '@/components/link'
import FButton from '@/components/button/button'
import FSvg from '@/components/svg'
import { timeoutMixin } from '@/mixins/timeout'
import { initiateIdentityValidation, complete } from '@/click2pay'

export default {
  components: {
    Click2payHeader,
    FForm,
    FLink,
    FButton,
    FSvg,
  },
  mixins: [timeoutMixin],
  data() {
    return {
      count: 6,
      timer: 10,
      second: 0,
      loading: false,
      validationData: '',
      messageOk: '',
      message: '',
      maskedValidationChannel: ',',
    }
  },
  computed: {
    email() {
      return this.maskedValidationChannel.split(',')[0]
    },
    phone() {
      return this.maskedValidationChannel.split(',')[1]
    },
    time() {
      const minutes = Math.floor(this.second / 60)
      const seconds = this.second - minutes * 60
      const minutesFormat = ('0' + minutes).slice(-2)
      const secondsFormat = ('0' + seconds).slice(-2)

      return `${minutesFormat}:${secondsFormat}`
    },
  },
  created() {
    this.initResend()
    this.store.setClick2payOtp(true)
  },
  methods: {
    initResend() {
      this.second = this.timer
      this.tick()
      this.resend()
    },
    tick() {
      this.second -= 1
      if (!this.second) return

      this.timeout('tick', 1000)
    },
    resend() {
      return initiateIdentityValidation()
        .finally(() => {
          this.messageOk = ''
          this.message = ''
        })
        .then(({ maskedValidationChannel }) => {
          this.maskedValidationChannel = maskedValidationChannel
        })
        .catch(error => {
          this.message = this.$t(error)

          return Promise.reject()
        })
    },
    click() {
      this.second = this.timer
      this.tick()
      this.resend()
        .then(() => {
          this.messageOk = this.$t('code_sent')
        })
        .catch(() => {})
    },
    format(value = '') {
      return value.replace(/[^\d]/g, '')
    },
    onSubmit() {
      if (this.loading) return

      this.loading = true

      complete({
        validationData: this.validationData,
      })
        .finally(() => {
          this.messageOk = ''
          this.message = ''
          this.loading = false
        })
        .then(() => {
          this.store.setClick2payOtp(false)
          this.$router.push({ name: 'card' }).catch(() => {})
        })
        .catch(error => {
          this.validationData = ''
          this.loading = false
          this.message = this.$t(error)
        })
    },
  },
}
</script>

<style lang="scss" module>
.mb_16 {
  margin-bottom: px-to-rem(16px);
}

.h3 {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 600;
  margin-bottom: px-to-rem(8px);

  :global(.f-theme-light) & {
    color: #313539;
  }
}

.desc {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  margin-bottom: px-to-rem(8px);

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.time {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  display: flex;
  justify-content: center;
  margin-bottom: px-to-rem(12px);
}

.resend {
  display: flex;
  justify-content: flex-end;
  margin-bottom: px-to-rem(12px);
}

.mb_20 {
  margin-bottom: px-to-rem(20px);
}

.message {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: $error;
  margin-bottom: px-to-rem(8px);
}

.message_ok {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: #08a835;
  margin-bottom: px-to-rem(8px);
}

.spin {
  position: relative;
  z-index: 1;
  margin-left: px-to-rem(4px);
}
</style>
