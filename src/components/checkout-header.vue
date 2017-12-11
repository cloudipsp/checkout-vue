<template>
  <div class="f-header">
    <div class="f-header-menu">
      <select v-if="options.locales.length" :class="[css.fc, 'f-input-sm', 'f-hidden-mobile']" v-model="form.lang">
        <option v-for="item in options.locales" :key="item" :value="item">{{ configLocales[item] }}</option>
      </select>
    </div>
    <div class="f-logo"></div>
  </div>
</template>

<script>
  import store from '@/store'
  import { setCookie } from '@/utils/helpers'
  import { loadLanguageAsync } from '@/i18n'
  import configLocales from '@/config/locales'

  export default {
    inject: ['$validator'],
    data () {
      return {
        css: store.state.css,
        options: store.state.options,
        form: store.state.form,
        configLocales: configLocales
      }
    },
    watch: {
      'form.lang': {
        handler: function (lang) {
          let self = this
          loadLanguageAsync(lang).then(function () {
            self.$validator.localize(lang)
          })
          setCookie('lang', lang, {
            path: '/',
            expires: 3600
          })
        },
        immediate: true
      }
    }
  }
</script>
