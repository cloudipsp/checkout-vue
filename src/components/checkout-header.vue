<template>
  <div class="f-header">
    <div class="f-header-menu">
      <select v-if="options.locales.length" :class="[css.fc, 'f-input-sm', 'f-hidden-mobile']" v-model="options.locale">
        <option v-for="item in options.locales" :key="item" :value="item">{{ locales[item] }}</option>
      </select>
    </div>
    <div class="f-logo"></div>
  </div>
</template>

<script>
  import store from '@/store'
  import { setCookie } from '@/utils/helpers'

  export default {
    inject: ['$validator'],
    data () {
      return {
        css: store.state.css,
        options: store.state.options,
        form: store.state.form,
        locales: store.config.locales
      }
    },
    watch: {
      'options.locale': {
        handler: function (locale) {
          setCookie('lang', locale, {
            path: '/',
            expires: 3600
          })
          this.$validator.localize(locale)
          this.$i18n.locale = locale
          this.form.lang = locale
        },
        immediate: true
      }
    }
  }
</script>
