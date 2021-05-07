<template>
  <div class="f-header">
    <div class="f-header-logo">
      <transition name="f-fade-enter">
        <f-button-link
          v-if="showBack"
          key="back"
          class="f-btn-methods"
          @click="goMenu"
        >
          <f-svg name="back" size="lg" />
        </f-button-link>
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
import FButtonLink from '@/components/button/button-link'
import FSvg from '@/components/svg'
import { SvgLogo } from '@/import'
import FFormBase from '@/components/form/form/form-base'
import { resizeMixin } from '@/mixins/resize'
import { mapState } from '@/utils/store'
import { sort, parseSelect } from '@/utils/sort'

export default {
  components: {
    FButtonLink,
    FSvg,
    SvgLogo,
    FFormBase,
  },
  mixins: [resizeMixin],
  props: {
    back: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['isOnlyCard']),
    ...mapState('params', ['lang']),
    ...mapState('options', ['locales', 'logo_url', 'full_screen']),
    ...mapState('options', {
      optionsLang: 'lang',
    }),
    locale() {
      return this.locales.map(parseSelect).sort(sort('text'))
    },
    showBack() {
      return !this.isOnlyCard && this.isBreakpointMd && this.back
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
    goMenu() {
      this.$router
        .push({
          name: 'menu',
        })
        .catch(() => {})
    },
  },
}
</script>
