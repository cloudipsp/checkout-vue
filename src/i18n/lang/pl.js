import translation from '@/i18n/po/pl/translation.json'
import countries from '@umpirsky/country-list/data/pl/country.json'
import datepicker from 'vue2-datepicker/locale/pl'
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
