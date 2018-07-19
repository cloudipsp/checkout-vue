<template>
  <div class="f-header">
    <div class="f-header-menu">
      <select v-if="options.locales.length" :class="[$css.fc, 'f-input-sm', 'f-hidden-mobile']" v-model="form.lang">
        <option v-for="item in options.locales" :key="item" :value="item" v-t="item"></option>
      </select>
    </div>
    <div class="f-logo" :style="style"></div>
  </div>
</template>

<script>
  import { setCookie } from '@/utils/helpers'
  import { loadLanguageAsync } from '@/i18n'

  export default {
    inject: ['$validator'],
    data () {
      return {
      }
    },
    watch: {
      'form.lang': {
        handler: function (lang) {
          loadLanguageAsync(lang).then(() => {
            this.$validator.localize(lang)
          })
          setCookie('lang', lang, {
            path: '/',
            expires: 3600
          })
        },
        immediate: true
      }
    },
    computed: {
      style (){
        if(!this.options.logoUrl) return {}
        return {
          'background-image': `url(${this.options.logoUrl})`
        }
      }
    }
  }
</script>
