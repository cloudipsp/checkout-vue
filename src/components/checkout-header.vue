<template>
  <div class="f-header">
    <div class="f-header-menu">
      <select
        v-if="show"
        v-model="params.lang"
        :class="[
          $css.fc,
          'f-input-sm',
          'f-hidden-mobile',
          'f-visible-inline-block',
        ]"
      >
        <option
          v-for="item in options.locales"
          :key="item"
          v-t="item"
          :value="item"
        />
      </select>
      <button
        v-if="!min"
        v-t="'other'"
        type="button"
        :class="[
          $css.btn,
          $css.bd,
          $css.btnSm,
          'f-visible-mobile-inline-block',
        ]"
        @click="changeMethods"
      />
    </div>
    <div class="f-logo" :style="style" />
  </div>
</template>

<script>
import { setCookie } from '@/utils/helpers'
import { loadLanguageAsync } from '@/i18n'

export default {
  inject: ['$validator'],
  props: {
    min: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    style() {
      if (!this.options.logo_url) return {}
      return {
        'background-image': `url(${this.options.logo_url})`,
      }
    },
    show() {
      return this.options.langs && this.options.locales.length
    },
  },
  watch: {
    'params.lang': {
      handler: function(lang) {
        loadLanguageAsync(lang).then(() => {
          this.$validator.localize(lang)
        })
        setCookie('lang', lang, {
          path: '/',
          expires: 3600,
        })
      },
      immediate: true,
    },
    'state.showChangeMethods': function(show) {
      document.querySelector('#f').style.overflow = show ? 'hidden' : 'visible'
    },
  },
  methods: {
    changeMethods() {
      this.store.state.showChangeMethods = !this.store.state.showChangeMethods
    },
  },
}
</script>
