<template>
  <div>
    <click2pay-header :class="$style.mb_16" :email-short="emailShort" />

    <f-box>
      <h3 :class="$style.h3" v-text="$t('another_user')" />
      <div
        :class="$style.desc"
        v-text="$t('enter_another_email_to_download_set_of_stored_cards')"
      />
      <f-form
        v-slot="{ submit, disabled }"
        :class="$style.mb_4"
        @submit="onSubmit"
      >
        <f-form-group
          v-model="email"
          name="email"
          :label="$t('email')"
          rules="required|email"
        />
        <div v-if="error" :class="$style.error" v-text="$t(error)" />
        <f-button
          variant="success"
          size="lg"
          block
          :disabled="disabled"
          @click="submit"
        >
          <span v-text="$t('change_user')" />
          <f-svg
            v-if="loading"
            :class="$style.spin"
            name="redo"
            size="20"
            spin
          />
        </f-button>
      </f-form>
      <f-button-link block size="56" @click="goCard">{{
        $t('cancel')
      }}</f-button-link>
    </f-box>
  </div>
</template>

<script>
import Click2payHeader from '@/views/click2pay/header'
import FBox from '@/components/box.vue'
import FForm from '@/components/form/form/form.vue'
import FFormGroup from '@/components/form/group.vue'
import FButton from '@/components/button/button.vue'
import FSvg from '@/components/svg.vue'
import FButtonLink from '@/components/button/button-link.vue'
import { profiles, switchId } from '@/click2pay'

export default {
  components: {
    Click2payHeader,
    FBox,
    FForm,
    FFormGroup,
    FButtonLink,
    FSvg,
    FButton,
  },
  data() {
    return {
      emailShort: '',
      email: '',
      loading: false,
      error: '',
    }
  },
  created() {
    profiles()
      .then(({ profiles }) => {
        this.emailShort = profiles[0].maskedConsumer.maskedEmailAddress
      })
      .catch(() => {})
  },
  methods: {
    goCard() {
      this.store.setClick2payOtp(false)

      this.$router.push({ name: 'card' }).catch(() => {})
    },
    onSubmit() {
      if (this.loading) return
      this.loading = true

      this.error = ''

      switchId(this.email)
        .finally(() => {
          this.loading = false
        })
        .then(() => {
          this.$router.push({ name: 'click2pay_otp' }).catch(() => {})
        })
        .catch(error => {
          this.error = error
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
  margin-bottom: px-to-rem(4px);

  :global(.f-theme-light) & {
    color: #3d3d3d;
  }
}

.desc {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  margin-bottom: px-to-rem(20px);

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

.mb_4 {
  margin-bottom: px-to-rem(4px);
}
</style>
