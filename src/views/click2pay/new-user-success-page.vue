<template>
  <div v-if="show">
    <click2pay-header :class="$style.mb_24" :email="email" />
    <transition name="f-fade-enter">
      <click2pay-new-user-success-page-checkout
        v-if="showRegistration"
        ref="registration"
        :start-status="status"
        :class="$style.mb_36"
        :email="email"
      />
      <div v-else :class="$style.mb_44">
        <div
          ref="desc"
          :class="$style.desc"
          @click.prevent="open"
          v-html="$t('c2p_save_card_desc', { masked_card, click2pay })"
        />
        <f-button
          class="f-mb-24"
          variant="success"
          size="lg"
          :text="$t('save_card')"
          block
          @click="click"
        />
      </div>
    </transition>
    <click2pay-modal-about ref="about" />
  </div>
</template>

<script>
import Click2payHeader from '@/views/click2pay/header'
import FButton from '@/components/button/button'
import Click2payNewUserSuccessPageCheckout from '@/views/click2pay/new-user-success-page-checkout'
import Click2payModalAbout from '@/views/click2pay/modal-about'
import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    Click2payHeader,
    FButton,
    Click2payNewUserSuccessPageCheckout,
    Click2payModalAbout,
  },
  data() {
    return {
      show: false,
      showRegistration: false,
      status: '',
    }
  },
  computed: {
    ...mapState('order', ['order_data']),
    email() {
      return this.order_data.sender_email
    },
    masked_card() {
      const card = this.order_data.masked_card.split('X').slice(-1)
      return `<span class="${this.$style.bold}">**** ${card}</span>`
    },
    click2pay() {
      return `<a href="">${this.$t('click2pay')}</a>`
    },
  },
  created() {
    if (this.order_data.click2pay_checkout_data) {
      this.store
        .click2payCardEncrypt()
        .then(({ encryptedCard }) => {
          this.show = true
          this.showRegistration = true
          this.status = 'loading'

          this.$nextTick(() => {
            this.$refs.registration.checkout({
              ...this.order_data.click2pay_checkout_data,
              encryptedCard,
            })
          })
        })
        .catch(errorHandler)
    } else {
      this.store
        .click2payCardEncrypt({
          first_name: ' ',
          last_name: ' ',
        })
        .then(() => {
          this.show = true
        })
        .catch(errorHandler)
    }
  },
  methods: {
    click() {
      this.showRegistration = true
      this.status = 'registration'
    },
    open({ target }) {
      if (target !== this.$refs.desc.querySelector('a')) return

      this.$refs.about.show()
    },
  },
}
</script>

<style lang="scss" module>
.desc {
  font-size: px-to-rem(14px);
  font-weight: 400;
  line-height: px-to-rem(20px);
  margin-bottom: px-to-rem(24px);

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.bold {
  font-weight: 600;

  :global(.f-theme-light) & {
    color: #313539;
  }
}

.mb_24 {
  margin-bottom: px-to-rem(24px);
}

.mb_36 {
  margin-bottom: px-to-rem(36px);
}

.mb_44 {
  margin-bottom: px-to-rem(44px);
}
</style>
