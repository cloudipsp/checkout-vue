<template>
  <div class="f-header">
    <div class="f-header-logo">
      <transition name="fade-enter">
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
      <select
        v-if="showLang"
        :value="lang"
        class="f-lang"
        dir="rtl"
        @change="changeLang"
      >
        <option v-for="{ value, text } in locale" :key="value" :value="value">
          {{ text }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import Resize from '@/mixins/resize'
import { mapState } from '@/utils/store'
import FButtonMethods from '@/components/button/button-methods'
import { sort } from '@/utils/sort'

export default {
  components: {
    FButtonMethods,
  },
  mixins: [Resize],
  computed: {
    ...mapState(['css', 'isOnlyCard']),
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
    locale() {
      return this.locales.map(this.parseLocale).sort(sort('text'))
    },
    parseLocale() {
      return item => ({ value: item, text: this.$t(item) })
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
        'background-image': `url(${this.logo_url})`,
      }
    },
    showLang() {
      return this.optionsLang && this.locales.length > 1
    },
  },
  methods: {
    changeLang($event) {
      this.store.changeLang($event.target.value)
    },
  },
}
</script>
