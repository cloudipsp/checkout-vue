import translation from '@/i18n/po/lv/messages.json'
import countries from '@/i18n/countries/lv.json'
import formatLocale from 'date-format-parse/lib/locale/lv'
import locales from '@/config/locales.json'
import { clearEmptyValue, generateValidateMessage } from '@/utils/helpers'

export const messages = Object.assign(
  {},
  countries,
  locales,
  clearEmptyValue(translation),
  {
    datepicker: {
      formatLocale,
      yearFormat: 'YYYY',
      monthFormat: 'MMM',
      monthBeforeYear: false,
    },
  }
)

export const validate = generateValidateMessage(translation)
