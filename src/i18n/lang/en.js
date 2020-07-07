import countries from '@umpirsky/country-list/data/en/country.json'
import { messages as validateMessages } from 'vee-validate/dist/locale/en'

export const messages = Object.assign({}, countries, {
  other_payment_method: 'Or use another payment method',
  card: 'Payment by card',
  banklinks_eu: 'Internet banks',

  back_to_payment_methods: 'Back to Payment Methods',
  fee: 'Commission:',
  see_more: 'See more',

  card_number: 'Card number',
  card_number_p: '0000 0000 0000 0000',
  expiry_date: 'MM/YY',
  expiry_date_p: '00/00',
  cvv2: 'CVV/CVC',
  cvv2_p: '000',
  cvv2_question: '{0} digits on the back of the card',
  expires_on: 'Expires on',
  email: 'Email',

  verification_t: 'Card verification',
  verification_code_d: 'Amount is hold on your credit card account',
  verification_code: 'Please enter verification code',
  verification_amount_d:
    'a random amount has been temporarily blocked on your card. To confirm that you are owner of the card - contact the bank, that issued it, to clarify this amount or check it by yourself through the online-banking service',
  verification_amount: 'Enter the verification amount',

  regular: 'Regular payment',
  regular_every: 'Periodicity',
  regular_period: 'Interval',
  regular_amount: 'Regular payment amount',
  regular_start_time: 'Begin with',
  day: 'Day',
  week: 'Week',
  month: 'Month',

  default_country: 'Choose your country or region',
  system_search: "bank's name, IBAN, BLZ",
  load_more: 'Load more...',

  sepa: 'SEPA Direct Debit',
  sepa_t: 'Provide your bank account details',
  sender_name: 'Name',
  sender_familyName: 'Surname',
  bic: 'BIC',
  iban: 'IBAN',

  declined: 'Payment is declined',
  approved: 'Thank you! Your payment was approved',
  pending: 'Your payment is being processed',
  number_payment: '№ of payment in {0}:',
  payment_system: 'payment system',

  offer_t:
    'I agree with the <a href="{0}" target="_blank">offer conditions </a>',
  pay: 'Pay now {0} {1}',

  ru: 'Русский',
  en: 'English',
  uk: 'Українською',
  lv: 'Latviešu',
  fr: 'Français',
  cs: 'Čeština',
  sk: 'Slovenský',

  customer_name: 'Customer name',
  customer_name_utf8: 'Customer name',
  customer_address: 'Customer address',
  customer_zip: 'Customer zip',
  customer_city: 'Customer city',
  customer_country: 'Customer country',
  customer_state: 'Customer state',
  customer_phonemobile: 'Phone mobile',
  customer_email: 'Email',

  submit3ds_title: 'Payment was not completed successfully',
  submit3ds_text: 'Please try again',
  submit3ds_submit: 'Repeat payment',
  submit3ds_wait: 'payment will be repeated in {0} sec.',

  security_title: 'Strong Customer Authentication',
  security_text:
    '<p>Validated PCI DSS Compliance</p><p>Listed on Visa Global Registry and verified by Mastercard</p>',

  confirm: 'Confirm',
  cancel: 'Cancel',

  or_pay_with_card: 'Or pay with card',
})

export const validate = Object.assign({}, validateMessages, {
  customer_name: () => `Enter both Surname and Name`,
  customer_field: () => `Please type only Latin characters`,
  customer_field_utf8: () => `Invalid characters`,
  phone: field => `The ${field} field format is invalid.`,
  numrange: () => `Transfer amount limit exceeded.`,
  ccard: field => `The ${field} field format is invalid.`,
})
