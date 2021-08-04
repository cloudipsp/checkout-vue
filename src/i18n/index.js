import Vue from 'vue'
import VueI18n from '../../lib/vue-i18n.esm'
import { messages, validate as validateEn } from '@/i18n/lang/en'
import { localize } from 'vee-validate'
import configLocales from '@/config/locales.json'
import { loadLang } from '@/import'
import { api } from '@/utils/api'

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
  return loadLang(lang).then(({ messages, validate }) => {
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

    api.extendParams({
      messages: {
        modalHeader: i18n.t('3ds_title'),
        modalLinkLabel: i18n.t('3ds_link'),
      },
    })

    return setI18nLanguage(lang)
  })
}

export default i18n

function setI18nLanguage(lang) {
  i18n.locale = lang
  return lang
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
