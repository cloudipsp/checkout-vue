import Vue from 'vue'
import VueI18n from 'vue-i18n'
import * as en from '@/lang/en'
import store from '@/store'
import { Validator } from 'vee-validate'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages: {
    en: en.messages
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
        let validate = {}
        let messages = {}
        Object.assign(validate, Validator.dictionary.container['en'].messages, msgs.validate, store.state.validate[lang])
        Object.assign(messages, msgs.messages, store.state.messages[lang])

        i18n.setLocaleMessage(lang, messages)
        Validator.localize(lang, { messages: validate })

        loadedLanguages.push(lang)
        return setI18nLanguage(lang)
      })
    }
    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}
