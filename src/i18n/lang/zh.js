import translation from '@/i18n/po/zh/translation.json'
import countries from '@umpirsky/country-list/data/zh/country.json'
import formatLocale from 'date-format-parse/lib/locale/zh-cn'
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
      yearFormat: 'YYYY年',
      monthFormat: 'MMM',
      monthBeforeYear: false,
    },
  }
)

export const validate = generateValidateMessage(translation)
