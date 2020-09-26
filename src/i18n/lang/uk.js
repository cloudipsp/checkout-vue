import translation from '@/i18n/po/uk/translation.json'
import countries from '@umpirsky/country-list/data/uk/country.json'
import datepicker from 'vue2-datepicker/locale/uk'
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
