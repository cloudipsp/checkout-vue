<template>
  <div v-if="show" class="f-header">
    <div class="f-header-logo">
      <transition name="f-fade-enter">
        <div v-if="showBack" key="back"><f-button-methods /></div>
        <div
          v-else-if="showLogoCustom"
          key="logo-custom"
          class="f-logo"
          :style="styleLogo"
        />
        <div v-else-if="showLogo" key="logo-svg" class="f-logo">
          <svg-logo />
        </div>
      </transition>
    </div>
    <div v-if="full_screen" class="f-header-menu">
      <f-form-base>
        <f-form-item-select
          v-if="showLang"
          input-class="f-lang"
          :value="lang"
          :options="locale"
          size="sm"
          dir="rtl"
          @change="changeLang"
        />
      </f-form-base>
    </div>
  </div>
</template>

<script>
import Resize from '@/mixins/resize'
import { mapState } from '@/utils/store'
import FButtonMethods from '@/components/button/button-methods'
import { sort, parseSelect } from '@/utils/sort'
import { SvgLogo } from '@/import'

export default {
  components: {
    FButtonMethods,
    SvgLogo,
  },
  mixins: [Resize],
  computed: {
    ...mapState(['isOnlyCard', 'is_only_wallets']),
    ...mapState('params', ['lang']),
    ...mapState('router', ['page']),
    ...mapState('options', [
      'locales',
      'logo_url',
      'show_menu_first',
      'full_screen',
    ]),
    ...mapState('options', {
      optionsLang: 'lang',
    }),
    show() {
      return !this.is_only_wallets
    },
    locale() {
      return this.locales.map(parseSelect).sort(sort('text'))
    },
    showBack() {
      return (
        !this.isOnlyCard &&
        !this.show_menu_first &&
        this.isBreakpointMd &&
        this.page !== 'success'
      )
    },
    showLogoCustom() {
      return this.logo_url && this.full_screen
    },
    showLogo() {
      return this.full_screen
    },
    styleLogo() {
      return {
        'background-image': `url("${this.logo_url.replace(/"/g, "'")}")`,
      }
    },
    showLang() {
      return this.optionsLang && this.locales.length > 1
    },
  },
  methods: {
    changeLang(value) {
      this.store.changeLang(value)
      this.store.sendRequestInfo({ lang: value })
    },
  },
}
</script>
