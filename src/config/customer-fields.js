export default {
  customer_name: {
    label: 'customer_name',
    rules: 'required|customer_name',
    autocomplete: 'cc-name',
  },
  customer_name_utf8: {
    label: 'customer_name_utf8',
    rules: 'required|customer_field_utf8',
    autocomplete: 'cc-name',
  },
  customer_address: {
    label: 'customer_address',
    rules: 'required|customer_field',
    autocomplete: 'shipping street-address',
  },
  customer_zip: {
    label: 'customer_zip',
    rules: 'required|customer_field',
    autocomplete: 'shipping postal-code',
  },
  customer_city: {
    label: 'customer_city',
    rules: 'required|customer_field',
    autocomplete: 'shipping locality',
  },
  customer_country: {
    label: 'customer_country',
    rules: 'required',
    dictionary: 'countries',
    autocomplete: 'shipping country',
  },
  customer_state: {
    label: 'customer_state',
    rules: 'required|customer_field|min:2|max:20',
    autocomplete: 'shipping region',
  },
  phonemobile: {
    label: 'customer_phonemobile',
    rules: 'required|phone',
    autocomplete: 'tel',
  },
  email: {
    label: 'customer_email',
    rules: 'required|email',
    autocomplete: 'email',
  },
}
