import { deepMerge } from '@/utils/helpers'

export const rulesEmail = 'required|email'

export const rulesEmailRequiredOne = 'required_one:@f-phonemobile|email'

export const configCustomer = {
  // $t('customer_name')
  customer_name: {
    label: 'customer_name',
    rules: 'required|customer_name',
    autocomplete: 'cc-name',
  },
  // $t('customer_name_utf8')
  customer_name_utf8: {
    label: 'customer_name_utf8',
    rules: 'required|customer_field_utf8',
    autocomplete: 'cc-name',
  },
  // $t('customer_address')
  customer_address: {
    label: 'customer_address',
    rules: 'required|customer_field_utf8',
    autocomplete: 'shipping street-address',
  },
  // $t('customer_zip')
  customer_zip: {
    label: 'customer_zip',
    rules: 'required|customer_field',
    autocomplete: 'shipping postal-code',
  },
  // $t('customer_city')
  customer_city: {
    label: 'customer_city',
    rules: 'required|customer_field_utf8',
    autocomplete: 'shipping locality',
  },
  // $t('customer_country')
  customer_country: {
    label: 'customer_country',
    rules: 'required',
    dictionary: 'countries',
    autocomplete: 'shipping country',
  },
  // $t('customer_state')
  customer_state: {
    label: 'customer_state',
    rules: 'required|customer_field|min:2|max:20',
    autocomplete: 'shipping region',
  },
  // $t('customer_phonemobile')
  phonemobile: {
    label: 'customer_phonemobile',
    rules: 'required|phonemobile',
    autocomplete: 'tel',
  },
  // $t('customer_email')
  email: {
    label: 'customer_email',
    rules: rulesEmail,
    autocomplete: 'email',
  },
}

export const configCustomerRequiredOne = deepMerge({}, configCustomer, {
  phonemobile: {
    rules: 'required_one:@f-email|phonemobile',
  },
  email: {
    rules: rulesEmailRequiredOne,
  },
})
