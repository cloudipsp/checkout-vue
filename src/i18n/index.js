import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { messages } from './lang/en'
import store from '@/store'
import { Validator } from 'vee-validate/dist/vee-validate.minimal.esm.js'
import axios from 'axios'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages: {
    en: messages,
  },
})

function setI18nLanguage(lang) {
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

function appendScript(text, id) {
  let el = document.createElement('script')
  el.setAttribute(`data-fondy-${id}`, '')
  el.textContent = String(text)
  document.getElementsByTagName('head')[0].appendChild(el)
}

export const loadLanguageAsync = lang => {
  return Promise.resolve()
    .then(() => {
      return store.state.cdn &&
        lang !== 'en' &&
        !document.querySelector(`script[data-fondy-i18-${lang}]`)
        ? Promise.reject()
        : Promise.resolve()
    })
    .catch(() => {
      return axios
        .get(`${store.state.cdn}/i18n/${lang}.js`)
        .then(({ data }) => {
          appendScript(data, `i18-${lang}`)
        })
    })
    .then(() => {
      return import(
        /* webpackChunkName: "i18n/[request]" */
        `./lang/${lang}`
      )
    })
    .then(msgs => {
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

      return setI18nLanguage(lang)
    })
}

export default i18n
