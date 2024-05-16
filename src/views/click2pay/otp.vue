<template>
  <div class="f-container-sm">
    <click2pay-header :class="$style.mb_16" :email-short="email">
      <f-link @click="goSwitchId">{{ $t('another_user') }}</f-link>
    </click2pay-header>
    <h3 :class="$style.h3" v-text="$t('c2p_access_to_saved_cards')" />
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
          :placeholder="$t('enter_code')"
          size="48"
          rules="required|digits:6"
          no-label-floating
          :format="format"
          :disabled="loading"
        />
      </div>
      <div :class="$style.mb_32">
        <f-form-group v-model="rememberMe" name="" component="checkbox">
          <div v-html="$t('skip_verification_next_time')" />
        </f-form-group>
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
    <div :class="$style.or">
      <div :class="$style.or_hr" />
      <div :class="$style.or_text" v-text="$t('or')" />
    </div>
    <f-button
      :class="$style.mb_32"
      block
      size="lg"
      :text="$t('enter_card_details')"
      @click="goCard"
    />
  </div>
</template>

<script>
import Click2payHeader from '@/views/click2pay/header'
import FForm from '@/components/form/form/form'
import FLink from '@/components/link'
import FButton from '@/components/button/button'
import FSvg from '@/components/svg'
import { timeoutMixin } from '@/mixins/timeout'
import {
  getRememberMe,
  initiateIdentityValidation,
  complete,
  setRememberMe,
  hasCards,
} from '@/click2pay'

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
      timer: 60,
      second: 0,
      loading: false,
      validationData: '',
      rememberMe: getRememberMe(),
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
    this.second = this.timer
    this.tick()
    this.resend().catch(() => {})
    this.store.setClick2payOtp(true)
  },
  methods: {
    tick() {
      this.second -= 1
      if (!this.second) return

      this.timeout('tick', 1000)
    },
    resend() {
      this.messageOk = ''
      this.message = ''

      return initiateIdentityValidation()
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
      this.messageOk = ''
      this.message = ''

      complete({ validationData: this.validationData })
        .finally(() => {
          this.loading = false
        })
        .then(() => {
          setRememberMe(this.rememberMe)
          this.store.setClick2payOtp(false)
          hasCards()
            .then(() => {
              this.$router.push({ name: 'click2pay' }).catch(() => {})
            })
            .catch(() => {
              this.$router.push({ name: 'card' }).catch(() => {})
            })
        })
        .catch(error => {
          this.validationData = ''
          this.loading = false
          this.message = this.$t(error)
        })
    },
    goCard() {
      this.store.setClick2payOtp(false)

      this.$router.push({ name: 'card' }).catch(() => {})
    },
    goSwitchId() {
      this.$router.push({ name: 'click2pay_switch_id' }).catch(() => {})
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

.mb_32 {
  margin-bottom: px-to-rem(32px);
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
.or {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: px-to-rem(32px);
  margin-bottom: px-to-rem(32px);
}

.or_hr {
  position: absolute;
  height: 1px;
  top: 50%;
  left: 0;
  right: 0;

  :global(.f-theme-light) & {
    background-color: #d5dae0;
  }
}

.or_text {
  position: relative;
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  padding: 0 px-to-rem(12px);
  background-color: $container-bg;

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.mb_32 {
  margin-bottom: px-to-rem(32px);
}
</style>
