import countries from '@umpirsky/country-list/data/sk/country.json'
import locales from '@/config/locales'
import { messages as validateMessages } from 'vee-validate/dist/locale/sk'

export const messages = Object.assign({}, countries, locales, {})

export const validate = Object.assign({}, validateMessages, {})
