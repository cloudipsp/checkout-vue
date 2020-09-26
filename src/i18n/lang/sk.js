import translation from '@/i18n/po/sk/translation.json'
import countries from '@umpirsky/country-list/data/sk/country.json'
import datepicker from 'vue2-datepicker/locale/sl'
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
