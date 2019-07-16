import countries from '@umpirsky/country-list/data/sk/country.json'
import { messages as validateMessages } from 'vee-validate/dist/locale/sk'

export const messages = Object.assign({}, countries, {})

export const validate = Object.assign({}, validateMessages, {})
