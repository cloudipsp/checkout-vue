import translation from '@/i18n/po/fr/translation.json'
import countries from '@umpirsky/country-list/data/fr/country.json'
import datepicker from 'vue2-datepicker/locale/fr'
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
