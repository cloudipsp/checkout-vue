<template>
  <f-modal-base v-bind="attrs" header-class="f-p-0" v-on="$listeners">
    <div class="f-qr-code-text">
      <div v-if="isMobile">
        <p v-text="$t(`qr_desc_mobile_${id}`)" />

        <f-button
          tag="a"
          variant="secondary"
          :text="$t(`qr_button_${id}`)"
          :href="button"
          target="_blank"
        />
      </div>
      <div v-else>
        <p v-text="$t(`qr_desc_desktop_${id}`)" />

        <p><f-qr-code :text="qr" /></p>

        <a target="_blank" :href="$t(`qr_app_apple_${id}`)">
          <img height="44" :src="apple" />
        </a>
        <a target="_blank" :href="$t(`qr_app_google_${id}`)">
          <img height="44" :src="google" />
        </a>
      </div>
    </div>
  </f-modal-base>
</template>

<script>
import FModalBase from '@/components/modal/modal-base'
import FButton from '@/components/button/button'
import FQrCode from '@/components/base/qr-code'
import { isMobile } from '@/utils/mobile'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FModalBase,
    FButton,
    FQrCode,
  },
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    id: makeProp(PROP_TYPE_STRING),
    qr: makeProp(PROP_TYPE_STRING),
    button: makeProp(PROP_TYPE_STRING),
  },
  data() {
    return {
      apple: `${PUBLIC_PATH}img/app-store.svg`,
      google: `${PUBLIC_PATH}img/google-play.svg`,
      isMobile: isMobile,
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
      }
    },
  },
}
</script>
