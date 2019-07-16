import countries from '@umpirsky/country-list/data/cs/country.json'
import { messages as validateMessages } from 'vee-validate/dist/locale/cs'

export const messages = Object.assign({}, countries, {})

export const validate = Object.assign({}, validateMessages, {})
