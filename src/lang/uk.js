import countries from '@/lang/countries/uk'
import validate from '@/lang/validate/uk'

const messages = Object.assign(
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

export { messages, validate }
