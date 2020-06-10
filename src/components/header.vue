<template>
  <div class="f-header">
    <div class="f-header-logo">
      <div class="f-logo" :style="styleLogo" />
    </div>
    <div class="f-header-menu">
      <select v-if="showLang" :value="lang" class="f-lang" @input="changeLang">
        <option v-for="item in locales" :key="item" v-t="item" :value="item" />
      </select>
      <button
        v-if="showButtonMethods"
        v-t="'other'"
        type="button"
        @click="toggleModalMethods"
      />
    </div>
  </div>
</template>

<script>
import Resize from '@/mixins/resize'
import { mapState } from '@/utils/store'

export default {
  mixins: [Resize],
  props: {
    min: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['css', 'showModalMethods']),
    ...mapState('params', ['lang']),
    ...mapState('options', ['locales', 'logo_url']),
    ...mapState('options', {
      optionsLang: 'lang',
    }),
    styleLogo() {
      if (!this.logo_url) return {}
      return {
        'background-image': `url(${this.logo_url})`,
      }
    },
    showLang() {
      return this.optionsLang && this.locales.length > 1
    },
    showButtonMethods() {
      return false && !this.min
    },
  },
  // watch: {
  //   showModalMethods(show) {
  //     this.$root.$el.style.overflow = show ? 'hidden' : 'visible'
  //   },
  // },
  methods: {
    changeLang($event) {
      this.store.changeLang($event.target.value)
    },
    toggleModalMethods() {
      this.store.toggleModalMethods()
    },
    // resize() {
    //   if (window.innerWidth >= 992) {
    //     this.$root.$el.style.overflow = 'visible'
    //   } else if (this.showModalMethods) {
    //     this.$root.$el.style.overflow = 'hidden'
    //   }
    // },
  },
}
</script>
