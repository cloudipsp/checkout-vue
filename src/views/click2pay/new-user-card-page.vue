<template>
  <div>
    <f-form-group
      v-model="registration"
      name=""
      component="checkbox"
      @input="input"
    >
      <div ref="save" :class="$style.save" @click="open">
        <svg-click2pay :class="$style.svg" />
        <span v-html="$t('c2p_save_card_desc', { click2pay })" />
      </div>
    </f-form-group>
    <f-box v-if="registration" :class="$style.mb_32">
      <div :class="$style.desc">
        {{ $t('c2p_registration_desc') }}
      </div>

      <div class="f-input-group">
        <f-calling-codes
          v-model="params.click2pay_checkout_data.consumer.countryCode"
          class="f-col-4"
          rules="required"
          @calling-code="onCallingCode"
        />
        <f-form-group
          v-model="
            params.click2pay_checkout_data.consumer.mobileNumber.phoneNumber
          "
          class="f-col"
          name="phone_number"
          :label="$t('phone_number')"
          rules="required"
          :mask="maskPhone"
        />
      </div>
      <f-form-group
        v-model="params.click2pay_checkout_data.consumer.lastName"
        name="last_name"
        :label="$t('last_name')"
        rules="required"
        :mask="maskLatinCyrillicWord"
      />
      <f-form-group
        v-model="params.click2pay_checkout_data.consumer.firstName"
        name="first_name"
        :label="$t('first_name')"
        rules="required"
        :mask="maskLatinCyrillicWord"
      />
      <f-form-group v-model="rememberMe" name="" component="checkbox">
        <div v-html="$t('remember_me_on_this_device')" />
      </f-form-group>

      <div
        :class="$style.agreement"
        v-html="
          $t('c2p_agreement_with_processing_of_data', {
            terms,
            privacy_notice: privacyNotice,
          })
        "
      />
    </f-box>
    <click2pay-modal-about ref="about" />
  </div>
</template>

<script>
import FFormGroup from '@/components/form/group.vue'
import SvgClick2pay from '@/svg/click2pay.svg'
import FBox from '@/components/box'
import FCallingCodes from '@/components/calling-codes'
import Click2payModalAbout from '@/views/click2pay/modal-about'
import {
  getRememberMe,
  complianceSettings,
  setRememberMe,
  getCheckoutSettings,
} from '@/click2pay'
import { mapState, mapStateGetSet } from '@/utils/store'
import { maskLatinCyrillicWord, maskPhone } from '@/config/mask'

export default {
  components: {
    FFormGroup,
    SvgClick2pay,
    FBox,
    FCallingCodes,
    Click2payModalAbout,
  },
  data() {
    return {
      registration: false,
      rememberMe: getRememberMe(),
      maskLatinCyrillicWord,
      maskPhone,
    }
  },
  computed: {
    ...mapStateGetSet(['params']),
    ...mapState('params', ['email', 'lang']),
    ...mapState('info', ['country_user_by_ip']),
    click2pay() {
      return `<a href="">${this.$t('click2pay')}</a>`
    },
    terms() {
      return `<a href="${this.termsUrl}" target="_blank">
        ${this.$t('terms')}
      </a>`
    },
    termsUrl() {
      return this.$t('c2p_terms_url')
    },
    privacyNotice() {
      return `<a href="${this.privacyNoticeUrl}" target="_blank">
        ${this.$t('privacy_notice')}
      </a>`
    },
    privacyNoticeUrl() {
      return this.$t('c2p_privacy_notice_url')
    },
  },
  watch: {
    rememberMe: 'watchRememberMe',
  },
  methods: {
    open(ev) {
      if (ev.target !== this.$refs.save.querySelector('a')) return
      ev.preventDefault()

      this.$refs.about.show()
    },
    input(value) {
      if (value) {
        this.$set(
          this.params,
          'click2pay_checkout_data',
          getCheckoutSettings({
            consumer: {
              countryCode: this.country_user_by_ip,
              firstName: '',
              lastName: '',
              languageCode: this.lang,
              mobileNumber: {
                countryCode: '',
                phoneNumber: '',
              },
              consumerIdentity: {
                identityProvider: 'SRC',
                identityType: 'EMAIL_ADDRESS',
                identityValue: this.email,
              },
              emailAddress: this.email,
            },
          })
        )
      } else {
        delete this.params.click2pay_checkout_data
      }

      this.$emit('enable', value)
    },
    onCallingCode(value) {
      this.params.click2pay_checkout_data.consumer.mobileNumber.countryCode =
        value
    },
    watchRememberMe() {
      setRememberMe(this.rememberMe)
      this.params.click2pay_checkout_data.complianceSettings =
        complianceSettings()
    },
  },
}
</script>

<style lang="scss" module>
.save {
  display: flex;
}

.svg {
  margin-right: px-to-rem(8px);
  min-width: px-to-rem(36px);

  :global(.f-theme-light) & {
    color: #1434cb;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }
}

.desc {
  font-size: px-to-rem(16px);
  font-weight: 400;
  line-height: px-to-rem(20px);
  margin-bottom: px-to-rem(12px);

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.agreement {
  font-size: px-to-rem(14px);
  font-weight: 400;
  line-height: px-to-rem(20px);

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.mb_32 {
  margin-bottom: px-to-rem(32px);
}
</style>
