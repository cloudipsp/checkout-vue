import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { messages, validate as validateEn } from '@/i18n/lang/en'
import { localize } from 'vee-validate'
import { getId } from '@/utils/helpers'
import configLocales from '@/config/locales.json'

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
    .then(({ messages, validate }) => {
      localize(lang, {
        messages: Object.assign(
          {},
          validateEn,
          validate,
          store.state.validate[lang]
        ),
      })

      i18n.setLocaleMessage(
        lang,
        Object.assign({}, messages, store.state.messages[lang])
      )

      return setI18nLanguage(lang)
    })
}

export default i18n

function setI18nLanguage(lang) {
  i18n.locale = lang
  return lang
}

function loadScript(url) {
  return new Promise(function (resolve, reject) {
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

export const getBrowserLanguage = () => {
  let n = window.navigator
  const browserLanguage = (n.language || n.browserLanguage || '')
    .toLowerCase()
    .split('-')[0]
  return getSupportLang(browserLanguage)
}

function getSupportLang(value) {
  return isSupportLang(value) ? value : 'en'
}

function isSupportLang(value) {
  return Object.keys(configLocales).includes(value)
}
