import translation from '@/i18n/po/ro/messages.json'
import countries from '@/i18n/countries/ro.json'
import formatLocale from 'date-format-parse/lib/locale/ro'
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
      monthBeforeYear: true,
    },
  }
)

export const validate = generateValidateMessage(translation)
