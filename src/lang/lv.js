import countries from '@umpirsky/country-list/data/lv/country.json'
import { messages as validateMessages } from 'vee-validate/dist/locale/lv'

export const messages = Object.assign({}, countries, {})

export const validate = Object.assign({}, validateMessages, {})
