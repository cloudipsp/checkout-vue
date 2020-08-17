<template>
  <div class="f-header">
    <div class="f-header-logo">
      <transition name="fade">
        <f-button-methods v-if="showBack" />
      </transition>
      <transition name="fade">
        <div v-if="!showBack" class="f-logo" :style="styleLogo" />
      </transition>
    </div>
    <div class="f-header-menu">
      <select v-if="showLang" :value="lang" class="f-lang" @input="changeLang">
        <option v-for="item in locales" :key="item" v-t="item" :value="item" />
      </select>
    </div>
  </div>
</template>

<script>
import Resize from '@/mixins/resize'
import { mapState } from '@/utils/store'
import FButtonMethods from '@/components/button/button-methods'

export default {
  components: {
    FButtonMethods,
  },
  mixins: [Resize],
  computed: {
    ...mapState(['css', 'isOnlyCard']),
    ...mapState('params', ['lang']),
    ...mapState('router', ['page']),
    ...mapState('options', ['locales', 'logo_url', 'show_menu_first']),
    ...mapState('options', {
      optionsLang: 'lang',
    }),
    showBack() {
      return (
        !this.isOnlyCard &&
        !this.show_menu_first &&
        this.isTablet &&
        this.page !== 'success'
      )
    },
    styleLogo() {
      if (!this.logo_url) return {}
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
