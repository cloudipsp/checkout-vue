import translation from '@/i18n/po/nl/translation.json'
import countries from '@umpirsky/country-list/data/nl/country.json'
import formatLocale from 'date-format-parse/lib/locale/nl'
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
