import countries from '@umpirsky/country-list/data/fr/country.json'
import { messages as validateMessages } from 'vee-validate/dist/locale/fr'

export const messages = Object.assign({}, countries, {})

export const validate = Object.assign({}, validateMessages, {})
