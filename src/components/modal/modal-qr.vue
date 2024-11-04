<template>
  <f-modal-base v-bind="attrs" v-on="$listeners">
    <img :class="$style.img" :src="model.qr_url" alt="QR code" />
    <p>You will be redirected to the mobile application</p>
    <template #footer>
      <f-button
        tag="a"
        :href="model.button"
        variant="secondary"
        target="_blank"
      >
        <span v-text="$t('pay')" />&nbsp;
        <f-amount :value="total_amount" :currency="currency" />
      </f-button>
    </template>
  </f-modal-base>
</template>

<script>
import FModalBase from '@/components/modal/modal-base'
import FButton from '@/components/button/button'
import FAmount from '@/components/base/amount'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_OBJECT } from '@/constants/props'
import { mapState } from '@/utils/store'

export default {
  components: {
    FModalBase,
    FButton,
    FAmount,
  },
  props: {
    model: makeProp(PROP_TYPE_OBJECT),
  },
  computed: {
    ...mapState('params', ['currency']),
    ...mapState(['total_amount']),
    attrs() {
      return {
        ...this.$attrs,
        ref: 'modal',
        footer: true,
        title: 'Scan QR through the mobile application',
      }
    },
  },
  methods: {
    show() {
      this.$refs.modal.show()
    },
  },
}
</script>

<style lang="scss" module>
.img {
  display: block;
  width: 100%;
  max-width: px-to-rem(360px);
  margin: 0 auto;
  margin-bottom: px-to-rem(20px);
}
</style>
