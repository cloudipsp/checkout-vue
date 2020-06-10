import countries from '@umpirsky/country-list/data/ru/country.json'
import { messages as validateMessages } from 'vee-validate/dist/locale/ru'

export const messages = Object.assign({}, countries, {
  card: 'Оплата картой',
  card_number: 'Номер карты',
  card_number_p: '0000 0000 0000 0000',
  expiry_date: 'ММ/ГГ',
  expiry_date_p: '00/00',
  cvv2: 'CVV/CVC',
  cvv2_p: '000',
  cvv2_question: '{0} цифры с оборотной стороны карты',
  email: 'Email',
  email_p: 'Ваш email',

  regular: 'Регулярный платеж',
  regular_every: 'Периодичность',
  regular_period: 'Период',
  regular_amount: 'Сума к оплате',
  regular_start_time: 'Начать с',
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',

  emoney: 'Электронные деньги',
  emoney_t: 'Выберите платежный сервис из списка:',

  ibank: 'Интернет–банки',
  ibank_t: 'Выберите ваш банк:',

  cash: 'Наличные',
  cash_t: 'Чем платить будете?',

  sepa: 'Международные платежи',
  sepa_t: 'Введите реквизиты вашего счета',

  sender_name: 'Имя',
  sender_familyName: 'Фамилия',
  bic: 'BIC',
  iban: 'IBAN',

  fee: 'Комиссия:',
  offer: 'оферта',
  offer_t: 'Я согласен с <a href="{0}" target="_blank">условиями оферты</a>',
  other: 'Другие способы',
  declined: 'Неуспешно',
  approved: 'Успешно',
  number_payment: '№ платежа в {0}:',
  payment_system: 'платежной системе',
  continue: 'Продолжить',
  cancel: 'Отменить',
  code: 'Проверочный код',
  pay: 'Оплатить {0} {1}',

  p24: 'Приват 24',
  platba24: 'Platba24',
  raiffeisen: 'Райффайзен Банк Аваль',
  paypal: 'PayPal',
  qiwi: 'QIWI',
  webmoney: 'WebMoney',
  yamoney: 'Яндекс.Деньги',
  liqpay: 'LiqPay',

  ru: 'Русский',
  en: 'English',
  uk: 'Українською',
  lv: 'Latviešu',
  fr: 'Français',
  cs: 'Čeština',
  sk: 'Slovenský',

  customer_name: 'ФИО',
  customer_name_utf8: 'ФИО',
  customer_address: 'Адрес. Улица, дом/строение',
  customer_zip: 'Почтовый код',
  customer_city: 'Город',
  customer_country: 'Страна',
  customer_state: 'Область/район/округ',
  customer_phonemobile: 'Номер телефона',
  customer_email: 'Email',

  confirm: 'Подтвердить',
})

export const validate = Object.assign({}, validateMessages, {
  customer_name: () => `Введите фамилию и имя`,
  customer_field: () => `Только латинские буквы`,
  customer_field_utf8: () => `Недопустимые символы`,
  ccard: field => `Поле ${field} должно быть действительным номером карты`,
})
