<template>
  <div v-if="show">
    <f-form-group v-model="save" name="" component="checkbox" @input="input">
      <div ref="save" :class="$style.save" @click="open">
        <svg-click2pay :class="$style.svg" />
        <span v-html="$t('c2p_save_card_desc', { click2pay })" />
      </div>
    </f-form-group>
    <f-box v-if="save" :class="$style.mb_32">
      <div class="f-input-group">
        <f-calling-codes
          v-model="countryCode"
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
        :value="consumer.maskedLastName"
        name="last_name"
        :label="$t('last_name')"
        disabled
      />
      <f-form-group
        :value="consumer.maskedFirstName"
        name="first_name"
        :label="$t('first_name')"
        disabled
      />
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
  profiles,
  getCheckoutSettings,
  srcCorrelationId,
  idToken,
} from '@/click2pay'
import { mapState, mapStateGetSet } from '@/utils/store'
import { maskPhone } from '@/config/mask'

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
      show: false,
      save: false,
      consumer: {},
      countryCode: '',
      maskPhone,
    }
  },
  computed: {
    ...mapStateGetSet(['params']),
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
  created() {
    this.countryCode = this.country_user_by_ip

    profiles()
      .then(({ profiles }) => {
        this.show = true
        this.consumer = profiles[0].maskedConsumer
      })
      .catch(() => {})
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
            idToken,
            srcCorrelationId,
            consumer: {
              mobileNumber: {
                phoneNumber: '',
                countryCode: '',
              },
            },
          })
        )
      } else {
        delete this.params.click2pay_checkout_data
      }
    },
    onCallingCode(value) {
      this.params.click2pay_checkout_data.consumer.mobileNumber.countryCode =
        value
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
