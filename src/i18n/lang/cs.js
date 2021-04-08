import countries from '@umpirsky/country-list/data/cs/country.json'
import locales from '@/config/locales'
import { messages as validateMessages } from 'vee-validate/dist/locale/cs'

export const messages = Object.assign({}, countries, locales, {})

export const validate = Object.assign({}, validateMessages, {})
