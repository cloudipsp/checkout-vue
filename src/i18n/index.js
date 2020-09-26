import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { messages } from '@/i18n/lang/en'
import { Validator } from 'vee-validate/dist/vee-validate.minimal.esm.js'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages: {
    en: messages,
  },
})

export const loadLanguageAsync = (lang, store) => {
  return Promise.resolve()
    .then(() => {
      let url = getUrl(lang, store)
      let id = getId(url)
      return store.state.cdn && lang !== 'en' && !document.getElementById(id)
        ? Promise.reject()
        : Promise.resolve()
    })
    .catch(() => {
      let url = getUrl(lang, store)
      return loadScript(url)
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
          lang !== 'en' ? Validator.dictionary.container['en'] : {},
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

function setI18nLanguage(lang) {
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

function loadScript(url) {
  return new Promise(function(resolve, reject) {
    let id = getId(url)
    let el = document.createElement('script')
    el.setAttribute('id', id)
    el.setAttribute('src', url)
    el.addEventListener('load', resolve)
    el.addEventListener('error', () => {
      el.remove()
      reject()
    })
    document.getElementsByTagName('head')[0].appendChild(el)
  })
}

function getUrl(lang, store) {
  return `${store.state.cdn}/i18n/${lang}.js`
}

function getId(url) {
  return url.replace(/\W/g, '_')
}
