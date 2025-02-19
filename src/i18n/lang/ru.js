import translation from '@/i18n/po/ru/messages.json'
import countries from '@/i18n/countries/ru.json'
import formatLocale from 'date-format-parse/lib/locale/ru'
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
