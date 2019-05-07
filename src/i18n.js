import Vue from 'vue'
import VueI18n from 'vue-i18n'
import * as en from '@/lang/en'
import store from '@/store'
import { Validator } from 'vee-validate/dist/vee-validate.minimal.esm.js'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages: {
    en: en.messages,
  },
})

const loadedLanguages = []

function setI18nLanguage(lang) {
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync(lang) {
  if (loadedLanguages.indexOf(lang) > -1)
    return Promise.resolve(setI18nLanguage(lang))

  return import(/* webpackChunkName: "[request]" */
  `@/lang/${lang}`).then(msgs => {
    Validator.localize(lang, {
      messages: Object.assign(
        {},
        Validator.dictionary.container['en'].messages,
        msgs.validate,
        store.state.validate[lang]
      ),
    })

    i18n.setLocaleMessage(
      lang,
      Object.assign({}, msgs.messages, store.state.messages[lang])
    )

    loadedLanguages.push(lang)
    return setI18nLanguage(lang)
  })
}
