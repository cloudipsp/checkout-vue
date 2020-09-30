import translation from '@/i18n/po/en/translation.json'
import countries from '@umpirsky/country-list/data/en/country.json'
import datepicker from 'vue2-datepicker/locale/en'
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
