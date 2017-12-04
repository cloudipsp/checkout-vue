import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '@/lang/en'
import store from '@/store'
import { Validator } from 'vee-validate'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages: {
    en: en
  }
})

const loadedLanguages = ['en']

function setI18nLanguage (lang) {
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang) {
  if (i18n.locale !== lang) {
    if (loadedLanguages.indexOf(lang) < 0) {
      return import(/* webpackChunkName: "[request]" */ `@/lang/${lang}`).then(msgs => {
        i18n.setLocaleMessage(lang, msgs.default)
        i18n.mergeLocaleMessage(lang, store.state.options.messages[lang])
        Validator.localize(lang, { messages: msgs.default.validate })
        loadedLanguages.push(lang)
        return setI18nLanguage(lang)
      })
    }
    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}
