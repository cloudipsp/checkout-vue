<template>
  <f-button :class="classButton" :variant="variant" block @click="click">
    <span v-if="isGooglePay">
      <iframe :class="$style.iframe" :src="src" @load="onLoad" />
    </span>
    <div :class="$style.click" />
  </f-button>
</template>

<script>
import Vue from 'vue'
import FButton from '@/components/button/button'
import { mapState, mapStateGetSet } from '@/utils/store'
import { errorHandler, key } from '@/utils/helpers'
import { btn, pay, wallet, variant, color } from '@/config/const'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_NUMBER,
  PROP_TYPE_STRING,
} from '@/constants/props'

const supportLongSvg = [
  'ar',
  'bg',
  'ca',
  'zh',
  'hr',
  'cs',
  'da',
  'nl',
  'en',
  'et',
  'fi',
  'fr',
  'de',
  'el',
  'id',
  'it',
  'ja',
  'ko',
  'ms',
  'no',
  'pl',
  'pt',
  'ru',
  'sr',
  'sk',
  'sl',
  'es',
  'sv',
  'th',
  'tr',
  'uk',
]

export default Vue.extend({
  components: {
    FButton,
  },
  inject: ['validate'],
  props: {
    method: makeProp(PROP_TYPE_STRING, '', true),
    index: makeProp(PROP_TYPE_NUMBER),
    load: makeProp(PROP_TYPE_BOOLEAN),
  },
  computed: {
    ...mapState('css_class', {
      variant: key(btn, pay, wallet, variant),
      color: key(btn, pay, wallet, color),
    }),
    ...mapStateGetSet(['need_validate_card']),
    ...mapState(['has_fields']),
    ...mapState('options', ['wallets_icons']),
    ...mapStateGetSet('tabs', ['most_popular']),
    classButton() {
      return [
        this.$style.btn,
        this.$style[`${this.method}-${this.variant}`],
        {
          [this.$style[`${this.method}-load`]]: this.load,
        },
      ]
    },
    isGooglePay() {
      return (
        this.method === 'google' && supportLongSvg.includes(this.$i18n.locale)
      )
    },
    src() {
      return `https://pay.google.com/gp/p/generate_gpay_btn_img?buttonColor=${this.color}&browserLocale=${this.$i18n.locale}&buttonSizeMode=fill`
    },
  },
  watch: {
    '$i18n.locale': 'watchLocale',
  },
  created() {
    this.wallets_icons.push(this.method)
    this.addMostPopular()
  },
  methods: {
    click() {
      if (this.has_fields) {
        this.need_validate_card = false
        this.$nextTick()
          .then(() => this.validate())
          .then(() => this.$emit('click', this.method))
          .finally(() => {
            this.need_validate_card = true
          })
          .catch(errorHandler)
      } else {
        this.$emit('click', this.method)
      }
    },
    onLoad() {
      this.$emit('update:load', true)
    },
    watchLocale(newValue, old) {
      if (supportLongSvg.includes(newValue) && supportLongSvg.includes(old))
        return

      this.$emit('update:load', false)
    },
    addMostPopular() {
      if (!this.most_popular) return

      this.$set(this.most_popular, this.method, {
        id: this.method,
        method: 'wallets',
        logo: this.method,
        name: `wallets_${this.method}`,
        user_priority: 98 - this.index,
        country: 'XX',
      })
    },
  },
})
</script>

<style lang="scss" module>
.btn {
  &::after {
    padding: px-to-rem(10px);
    background-repeat: no-repeat;
    background-position: center center;
    background-origin: content-box;
    background-size: contain;
  }
}

:global(#f .f-sidebar) .btn {
  margin-bottom: px-to-rem(32px);
}

:global(#f .f-center) .btn {
  margin-bottom: px-to-rem(24px);
}

.iframe {
  height: 100%;
  border: 0;
}

.click {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
}

:global(#f) .google-light,
:global(#f) .google-dark {
  padding: 0;
}

.google-light::after {
  background-image: url('https://www.gstatic.com/instantbuy/svg/light_gpay.svg');
}

.google-dark::after {
  background-image: url('https://www.gstatic.com/instantbuy/svg/dark_gpay.svg');
}

.google-load::after {
  background-image: none;
}

.apple-light::after {
  background-image: url('#{$cdn}svg/wallets/apple-pay-light.svg');
}

.apple-dark::after {
  background-image: url('#{$cdn}svg/wallets/apple-pay-dark.svg');
}
</style>
