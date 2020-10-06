import translation from '@/i18n/po/ro/translation.json'
import countries from '@umpirsky/country-list/data/ro/country.json'
import datepicker from 'vue2-datepicker/locale/ro'
import locales from '@/config/locales.json'
import { clearEmptyValue, generateValidateMessage } from '@/utils/helpers'

export const messages = Object.assign(
  {},
  countries,
  locales,
  clearEmptyValue(translation),
  {
    datepicker,
  }
)

export const validate = generateValidateMessage(translation)
