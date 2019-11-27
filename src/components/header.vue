<template>
  <div class="f-header">
    <div class="f-header-menu">
      <select
        v-if="showLang"
        :value="lang"
        :class="classLang"
        @input="changeLang"
      >
        <option v-for="item in locales" :key="item" v-t="item" :value="item" />
      </select>
      <button
        v-if="showButtonMethods"
        v-t="'other'"
        type="button"
        :class="classButtonMethods"
        @click="toggleModalMethods"
      />
    </div>
    <div class="f-logo" :style="styleLogo" />
  </div>
</template>

<script>
import Resize from '@/mixins/resize'

export default {
  mixins: [Resize],
  props: {
    min: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    lang() {
      return this.store.state.params.lang
    },
    locales() {
      return this.store.state.options.locales
    },
    styleLogo() {
      if (!this.store.state.options.logo_url) return {}
      return {
        'background-image': `url(${this.store.state.options.logo_url})`,
      }
    },
    showLang() {
      return this.store.state.options.lang && this.locales.length > 1
    },
    showButtonMethods() {
      return !this.min
    },
    classLang() {
      return [this.$css.fc, 'f-input-sm', 'f-visible-inline-block']
    },
    classButtonMethods() {
      return [
        this.$css.btn,
        this.$css.bd,
        this.$css.btnSm,
        'f-visible-mobile-inline-block',
      ]
    },
  },
  watch: {
    'state.showModalMethods': function(show) {
      this.$root.$el.style.overflow = show ? 'hidden' : 'visible'
    },
  },
  methods: {
    changeLang($event) {
      this.store.changeLang($event.target.value)
    },
    toggleModalMethods() {
      this.store.toggleModalMethods()
    },
    resize() {
      if (window.innerWidth >= 768) {
        this.$root.$el.style.overflow = 'visible'
      } else if (this.store.state.showModalMethods) {
        this.$root.$el.style.overflow = 'hidden'
      }
    },
  },
}
</script>
