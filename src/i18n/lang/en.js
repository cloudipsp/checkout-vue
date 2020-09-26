import translation from '@/i18n/po/en/translation.json'
import countries from '@umpirsky/country-list/data/en/country.json'
import datepicker from 'vue2-datepicker/locale/en'
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

export const validate = {
  _default: 'Value is not valid',
  after: (field, [target]) => `Valid thru date may not be after ${target}`,
  alpha: 'Please use letters (A-Z) only',
  date_format: 'Please enter valid thru date as it indicated on your card',
  decimal: (field, [decimals = '*'] = []) =>
    `The ${field} field must be numeric and may contain${
      !decimals || decimals === '*' ? '' : ' ' + decimals
    } decimal points`,
  digits: (field, [length]) =>
    `The ${field} field must be numeric and contains exactly ${length} digits`,
  email: 'Field must be a valid email',
  max: (field, [length]) => `Please enter ${length} characters max.`,
  min: (field, [length]) => `Please enter ${length} characters min.`,
  numeric: 'Field may only contain numeric characters',
  required: 'Please fill in this field',
  regex: 'Field format is invalid.',

  customer_name: 'Enter both Surname and Name',
  customer_field: 'Please use letters (A-Z) only',
  customer_field_utf8: 'Invalid characters',
  phone: 'Field format is invalid.',
  numrange: 'Transfer amount limit exceeded.',
  ccard: 'Field format is invalid.',
}
