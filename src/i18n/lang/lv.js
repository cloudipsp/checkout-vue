import translation from '@/i18n/po/lv/translation.json'
import countries from '@umpirsky/country-list/data/lv/country.json'
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
