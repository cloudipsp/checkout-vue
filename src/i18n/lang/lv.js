import countries from '@umpirsky/country-list/data/lv/country.json'
import locales from '@/config/locales'
import { messages as validateMessages } from 'vee-validate/dist/locale/lv'

export const messages = Object.assign({}, countries, locales, {})

export const validate = Object.assign({}, validateMessages, {})
