import countries from '@umpirsky/country-list/data/fr/country.json'
import locales from '@/config/locales'
import { messages as validateMessages } from 'vee-validate/dist/locale/fr'

export const messages = Object.assign({}, countries, locales, {})

export const validate = Object.assign({}, validateMessages, {})
