import countries from '@/lang/countries/uk'

export const messages = Object.assign(
  {
    card: 'Оплата картою',
    card_number: 'Номер карти',
    card_number_p: 'XXXX XXXX XXXX XXXX',
    expiry_date: 'Дійсна до',
    expiry_date_p: 'ММ/РР',
    cvv2: 'CVV2',
    cvv2_p: 'XXX',
    cvv2_question: '{0} цифри з оборотного боку карти',
    email: 'Email',
    email_p: 'Ваш email',

    regular: 'Регулярний платіж',
    regular_every: 'Періодичність',
    regular_period: 'Період',
    regular_amount: 'Сума до оплати',
    regular_start_time: 'Почати з',
    day: 'День',
    week: 'Тиждень',
    month: 'Місяць',

    emoney: 'Електронні гроші',
    emoney_t: 'Виберіть платіжний сервіс зі списку:',

    ibank: 'Інтернет-банки',
    ibank_t: 'Виберіть ваш банк:',

    cash: 'Готівкові',
    cash_t: 'Чим платити будете?',

    sepa: 'SEPA Direct Debit',
    sepa_t: 'Введіть реквізити вашого рахунку',
    sender_name: "Ім'я",
    sender_familyName: 'Прізвище',
    bic: 'BIC',
    iban: 'IBAN',

    info: 'Дані платежу',
    amount: 'Сума платежу:',
    fee: 'Комісія:',
    methods: 'Методи оплати',
    methods_m: 'Виберіть спосіб оплати',
    fast: 'Швидкий доступ до методів оплати:',
    offer: 'оферта',
    offer_t: 'Я згоден з <a href="{0}" target="_blank"> умовами оферти </a>',
    other: 'Інші способи',
    declined: 'Неуспішно',
    approved: 'Успішно',
    number_payment: '№ платежу в {0}:',
    payment_system: 'платіжній системі',
    continue: 'Продовжити',
    cancel: 'Скасувати',
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
    customer_address: 'Адреса. Вулиця, дім/будова',
    customer_zip: 'Почтовий код',
    customer_city: 'Місто',
    customer_country: 'Країна',
    customer_state: 'Область',
    customer_phonemobile: 'Номер телефону',
    customer_email: 'Email',
  },
  countries
)

export const validate = {
  after: (field, [target]) =>
    `В полі ${field} повинна бути дата після ${target} .`,
  alpha_dash: field =>
    `Поле ${field} може містити тільки букви, цифри та дефіс.`,
  alpha_num: field => `Поле ${field} може містити тільки букви і ціфри.`,
  alpha_spaces: field => `Поле ${field} може містити тільки букви і пробели.`,
  alpha: field => `Поле ${field} може містити тільки букви.`,
  before: (field, [target]) =>
    `В полі ${field} повинна бути дата до ${target} .`,
  between: (field, [min, max]) =>
    `Поле ${field} має бути між ${min} і ${max} .`,
  confirmed: (field, [confirmedField]) =>
    `Поле ${field} не збігається з ${confirmedField} .`,
  credit_card: field => `Поле ${field} має бути дійсним номером карти`,
  ccard: field => `Поле ${field} має бути дійсним номером карти`,
  date_between: (field, [min, max]) =>
    `Поле ${field} має бути між ${min} і ${max} .`,
  date_format: (field, [format]) =>
    `Поле ${field} має бути в форматі ${format} .`,
  decimal: (field, [decimals = '*'] = []) =>
    `Поле ${field} має бути числовим і може містити ${
      decimals === '*' ? '' : decimals
    } десяткових чісла.`,
  digits: (field, [length]) =>
    `Поле ${field} має бути числовим і точно містити ${length} ціфри.`,
  dimensions: (field, [width, height]) =>
    `Поле ${field} має бути ${width} пікселів на ${height} пікселей.`,
  email: field => `Поле ${field} має бути дійсним електронним адресом.`,
  image: field => `Поле ${field} має бути ізображеніем.`,
  in: field => `Поле ${field} має бути допустимим значеніем.`,
  max: (field, [length]) =>
    `Поле ${field} не може бути більше ${length} сімволов.`,
  max_value: (field, [max]) => `Поле ${field} має бути ${max} або менее.`,
  mimes: (field, [...args]) =>
    `Поле ${field} повинно мати дійсний тип файлу. (${args}) `,
  min: (field, [length]) =>
    `Поле ${field} має бути не менше ${length} сімволов.`,
  min_value: (field, [min]) => `Поле ${field} має бути ${min} або больше.`,
  not_in: field => `Поле ${field} має бути допустимим значеніем.`,
  numeric: field => `Поле ${field} має бути чіслом.`,
  regex: field => `Поле ${field} має помилковий формат.`,
  required: field => `Поле ${field} обов'язково для заполненія.`,
  url: field => `Поле ${field} має хибний формат URL.`,
}
