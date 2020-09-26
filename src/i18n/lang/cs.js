import translation from '@/i18n/po/cs/translation.json'
import countries from '@umpirsky/country-list/data/cs/country.json'
import datepicker from 'vue2-datepicker/locale/cs'
import locales from '@/config/locales.json'
import { clearEmptyValue } from '@/utils/helpers'

export const messages = Object.assign(
  {},
  countries,
  locales,
  clearEmptyValue(translation),
  {
    datepicker,
  }
)

export const validate = {}
