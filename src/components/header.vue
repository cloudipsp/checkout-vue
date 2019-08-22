<template>
  <div class="f-header">
    <div class="f-header-menu">
      <select
        v-if="show"
        :value="params.lang"
        :class="[$css.fc, 'f-input-sm', 'f-visible-inline-block']"
        @input="store.changeLocale($event.target.value)"
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
      return this.options.langs && this.options.locales.length > 1
    },
    styleFlag() {
      return function(lang) {
        return {
          'background-image':
            'url(' + this.store.state.cdn + 'flags/' + lang + '.svg)',
        }
      }
    },
  },
  watch: {
    'state.showChangeMethods': function(show) {
      this.$root.$el.style.overflow = show ? 'hidden' : 'visible'
    },
  },
  created() {
    this.$root.$on('resize', () => {
      if (window.innerWidth >= 768) {
        this.$root.$el.style.overflow = 'visible'
      } else if (this.store.state.showChangeMethods) {
        this.$root.$el.style.overflow = 'hidden'
      }
    })
  },
  methods: {
    changeMethods() {
      this.store.state.showChangeMethods = !this.store.state.showChangeMethods
    },
  },
}
</script>
