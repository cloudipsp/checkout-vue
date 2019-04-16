export default {
  customer_name: {
    name: 'customer_name',
    valid: 'required|customer_field',
  },
  customer_address: {
    name: 'customer_address',
    valid: 'required|customer_field',
  },
  customer_zip: {
    name: 'customer_zip',
    valid: 'required|customer_field',
  },
  customer_city: {
    name: 'customer_city',
    valid: 'required|customer_field',
  },
  customer_country: {
    name: 'customer_country',
    valid: 'required',
    dictionary: 'countries',
  },
  customer_state: {
    name: 'customer_state',
    valid: 'required|customer_field|min:2|max:20',
  },
  phonemobile: {
    name: 'customer_phonemobile',
    valid: 'required|phone',
  },
  email: {
    name: 'customer_email',
    valid: 'required|email',
  },
}
