<template>
  <transition name="f-fade-enter">
    <f-box v-if="isRegistration">
      <div :class="$style.desc">
        {{ $t('c2p_registration_desc') }}
      </div>
      <f-form v-slot="{ submit, disabled }" @submit="onSubmit">
        <div class="f-input-group">
          <f-calling-codes
            v-model="countryCode"
            class="f-col-4"
            rules="required"
            @calling-code="onCallingCode"
          />
          <f-form-group
            v-model="phoneNumber"
            class="f-col"
            name="phone_number"
            :label="$t('phone_number')"
            rules="required"
            :mask="maskPhone"
          />
        </div>
        <f-form-group
          v-model="lastName"
          name="last_name"
          :label="$t('last_name')"
          rules="required"
          :mask="maskLatinCyrillicWord"
        />
        <f-form-group
          v-model="firstName"
          name="first_name"
          :label="$t('first_name')"
          rules="required"
          :mask="maskLatinCyrillicWord"
        />
        <f-form-group v-model="rememberMe" name="" component="checkbox">
          <div v-html="$t('remember_me_on_this_device')" />
        </f-form-group>
        <div v-if="error" :class="$style.error" v-text="$t(error)" />
        <f-button
          class="f-mb-20"
          variant="success"
          size="lg"
          block
          :disabled="disabled"
          @click="submit"
        >
          <span v-text="$t('registration')" />
          <f-svg
            v-if="loading"
            :class="$style.spin"
            name="redo"
            size="20"
            spin
          />
        </f-button>
      </f-form>
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
    <click2pay-loader v-else-if="isLoading" />
    <div
      v-else-if="isRegistered"
      :class="$style.registered"
      v-text="$t('c2p_card_add')"
    />
    <div
      v-else-if="isExpired"
      :class="$style.expired"
      v-text="$t('c2p_card_add_expired')"
    />
  </transition>
</template>

<script>
import FBox from '@/components/box'
import FForm from '@/components/form/form/form'
import FCallingCodes from '@/components/calling-codes'
import FButton from '@/components/button/button'
import FSvg from '@/components/svg'
import Click2payLoader from '@/views/click2pay/loader'
import { checkout, setRememberMe, getRememberMe } from '@/click2pay'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'
import { mapState } from '@/utils/store'
import { maskLatinCyrillicWord, maskPhone } from '@/config/mask'

export default {
  components: {
    FBox,
    FForm,
    FCallingCodes,
    FButton,
    FSvg,
    Click2payLoader,
  },
  props: {
    email: makeProp(PROP_TYPE_STRING),
    startStatus: makeProp(PROP_TYPE_STRING, '', value =>
      ['registration', 'loading'].includes(value)
    ),
  },
  data() {
    return {
      status: '',
      loading: false,
      countryCode: '',
      callingCode: '',
      phoneNumber: '',
      lastName: '',
      firstName: '',
      rememberMe: getRememberMe(),
      error: '',
      maskLatinCyrillicWord: maskLatinCyrillicWord,
      maskPhone: maskPhone,
    }
  },
  computed: {
    ...mapState('params', ['lang']),
    ...mapState('info', ['country_user_by_ip']),
    isRegistration() {
      return this.status === 'registration'
    },
    isLoading() {
      return this.status === 'loading'
    },
    isRegistered() {
      return this.status === 'registered'
    },
    isExpired() {
      return this.status === 'expired'
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
    this.status = this.startStatus
    this.countryCode = this.country_user_by_ip
  },
  methods: {
    onSubmit() {
      if (this.loading) return
      this.loading = true

      this.error = ''

      setRememberMe(this.rememberMe)

      this.store
        .click2payCardEncrypt({
          first_name: this.firstName,
          last_name: this.lastName,
        })
        .then(({ encryptedCard, firstName, lastName }) =>
          checkout({
            encryptedCard,
            consumer: {
              countryCode: this.countryCode,
              firstName,
              lastName,
              languageCode: this.lang,
              mobileNumber: {
                countryCode: this.callingCode,
                phoneNumber: this.phoneNumber,
              },
              consumerIdentity: {
                identityProvider: 'SRC',
                identityType: 'EMAIL_ADDRESS',
                identityValue: this.email,
              },
              emailAddress: this.email,
            },
          })
            .finally(() => {
              this.loading = false
            })
            .then(() => {
              this.status = 'registered'
            })
            .catch(error => {
              this.error = error
            })
        )
        .catch(() => {
          this.status = 'expired'
        })
    },
    checkout(input) {
      checkout(input)
        .then(() => {
          this.status = 'registered'
        })
        .catch(error => {
          const {
            consumer: {
              countryCode,
              firstName,
              lastName,
              mobileNumber: { phoneNumber },
            },
          } = input

          this.countryCode = countryCode
          this.phoneNumber = phoneNumber
          this.lastName = lastName
          this.firstName = firstName
          this.error = error

          this.status = 'registration'
        })
    },
    onCallingCode(value) {
      this.callingCode = value
    },
  },
}
</script>

<style lang="scss" module>
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

.error {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: $error;
  margin-bottom: px-to-rem(8px);
}

.spin {
  position: relative;
  z-index: 1;
  margin-left: px-to-rem(4px);
}

.registered {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: #08a835;
}

.expired {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 500;
  color: #de4761;
}
</style>
