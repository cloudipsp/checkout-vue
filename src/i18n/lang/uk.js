import countries from '@umpirsky/country-list/data/uk/country.json'
import { messages as validateMessages } from 'vee-validate/dist/locale/uk'

export const messages = Object.assign({}, countries, {
  card: 'Оплата картою',
  card_number: 'Номер карти',
  card_number_p: '0000 0000 0000 0000',
  expiry_date: 'ММ/РР',
  expiry_date_p: '00/00',
  cvv2: 'CVV/CVC',
  cvv2_p: '000',
  cvv2_question: '{0} цифри з оборотного боку карти',
  email: 'Email',

  regular: 'Регулярний платіж',
  regular_every: 'Періодичність',
  regular_period: 'Період',
  regular_amount: 'Сума до оплати',
  regular_start_time: 'Почати з',
  day: 'День',
  week: 'Тиждень',
  month: 'Місяць',

  sepa: 'SEPA Direct Debit',
  sepa_t: 'Введіть реквізити вашого рахунку',
  sender_name: "Ім'я",
  sender_familyName: 'Прізвище',
  bic: 'BIC',
  iban: 'IBAN',

  fee: 'Комісія:',
  offer: 'оферта',
  offer_t: 'Я згоден з <a href="{0}" target="_blank"> умовами оферти </a>',
  other: 'Інші способи',
  declined: 'Неуспішно',
  approved: 'Успішно',
  number_payment: '№ платежу в {0}:',
  payment_system: 'платіжній системі',
  continue: 'Продовжити',
  code: 'Код перевірки',
  pay: 'Оплатити {0} {1}',

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

  customer_name: 'ПІБ',
  customer_name_utf8: 'ПІБ',
  customer_address: 'Адреса. Вулиця, дім/будова',
  customer_zip: 'Почтовий код',
  customer_city: 'Місто',
  customer_country: 'Країна',
  customer_state: 'Область',
  customer_phonemobile: 'Номер телефону',
  customer_email: 'Email',

  mfo_title: 'Реквізити для сплати рахунку № {0}',
  ibox_title: 'Реквізити до сплати рахунку у системі iBox',
  receiver: 'Отримувач платежу',
  current_bill: 'Поточний рахунок',
  usreou: 'Код ЄДРПОУ',
  bank: 'Установа банку',
  mfo: 'МФО Банку',
  purpose: 'Призначення',
  receipt_id: 'Номер замовлення',
  end_date: 'Кiнцева дата платежу',
  amount: 'Сума',
  save_receipt: 'Зберегти квитанцію',
  save_qr_code: 'Зберегти на смартфон',
  ibox_desc:
    '<p>Ви можете знайти найближче відділення iBox за посиланням <a href="https://ibox.ua/ru/map" target="_blank">ibox.ua/ru/map</a></p>',
  ibox_info:
    '<p>З детальною інструкцією ви можете ознайомитись на сайт <a href="https://ibox.ua/" target="_blank">ibox.ua</a>.</p>' +
    '<p>Сплата повинна бути не пізніше кінцевої дати платежу.</p>' +
    '<p>Сплатити замовлення можливо лише в системі iBox.</p>',
  qr_code_text: 'Відскануйте цей код, щоб зберегти квитанцію на ваш смартфон',
})

export const validate = Object.assign({}, validateMessages, {
  customer_name: () => `Введіть прізвище та ім’я`,
  customer_field: () => `Введіть лише латинські символи`,
  customer_field_utf8: () => `Недійсні символи`,
  ccard: field => `Поле ${field} має бути дійсним номером карти`,
})
