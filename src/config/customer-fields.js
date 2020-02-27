export default {
  customer_name: {
    name: 'customer_name',
    validate: 'required|customer_name',
    autocomplete: 'cc-name',
  },
  customer_name_utf8: {
    name: 'customer_name_utf8',
    validate: 'required|customer_field_utf8',
    autocomplete: 'cc-name',
  },
  customer_address: {
    name: 'customer_address',
    validate: 'required|customer_field',
    autocomplete: 'shipping street-address',
  },
  customer_zip: {
    name: 'customer_zip',
    validate: 'required|customer_field',
    autocomplete: 'shipping postal-code',
  },
  customer_city: {
    name: 'customer_city',
    validate: 'required|customer_field',
    autocomplete: 'shipping locality',
  },
  customer_country: {
    name: 'customer_country',
    validate: 'required',
    dictionary: 'countries',
    autocomplete: 'shipping country',
  },
  customer_state: {
    name: 'customer_state',
    validate: 'required|customer_field|min:2|max:20',
    autocomplete: 'shipping region',
  },
  phonemobile: {
    name: 'customer_phonemobile',
    validate: 'required|phone',
    autocomplete: 'tel',
  },
  email: {
    name: 'customer_email',
    validate: 'required|email',
    autocomplete: 'email',
  },
}
