import countries from '@/lang/countries/ru'

export const messages = Object.assign(
  {
    card: 'Оплата картой',
    card_number: 'Номер карты',
    card_number_p: 'XXXX XXXX XXXX XXXX',
    expiry_date: 'Действительна до',
    expiry_date_p: 'ММ/ГГ',
    cvv2: 'CVV2',
    cvv2_p: 'XXX',
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

    info: 'Данные платежа',
    amount: 'Сумма платежа:',
    fee: 'Комиссия:',
    methods: 'Методы оплаты',
    methods_m: 'Выберите способ оплаты',
    fast: 'Быстрый доступ к методам оплаты:',
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
    customer_address: 'Адрес. Улица, дом/строение',
    customer_zip: 'Почтовый код',
    customer_city: 'Город',
    customer_country: 'Страна',
    customer_state: 'Область/район/округ',
    customer_phonemobile: 'Номер телефона',
    customer_email: 'Email',
  },
  countries
)

export const validate = {
  after: (field, [target]) =>
    `В поле ${field} должна быть дата после ${target}.`,
  alpha_dash: field =>
    `Поле ${field} может содержать только буквы, цифры и дефис.`,
  alpha_num: field => `Поле ${field} может содержать только буквы и цифры.`,
  alpha_spaces: field =>
    `Поле ${field} может содержать только буквы и пробелы.`,
  alpha: field => `Поле ${field} может содержать только буквы.`,
  before: (field, [target]) => `В поле ${field} должна быть дата до ${target}.`,
  between: (field, [min, max]) =>
    `Поле ${field} должно быть между ${min} и ${max}.`,
  confirmed: (field, [confirmedField]) =>
    `Поле ${field} не совпадает с ${confirmedField}.`,
  credit_card: field =>
    `Поле ${field} должно быть действительным номером карты`,
  ccard: field => `Поле ${field} должно быть действительным номером карты`,
  date_between: (field, [min, max]) =>
    `Поле ${field} должно быть между ${min} и ${max}.`,
  date_format: (field, [format]) =>
    `Поле ${field} должно быть в формате ${format}.`,
  decimal: (field, [decimals = '*'] = []) =>
    `Поле ${field} должно быть числовым и может содержать ${
      decimals === '*' ? '' : decimals
    } десятичных числа.`,
  digits: (field, [length]) =>
    `Поле ${field} должно быть числовым и точно содержать ${length} цифры.`,
  dimensions: (field, [width, height]) =>
    `Поле ${field} должно быть ${width} пикселей на ${height} пикселей.`,
  email: field =>
    `Поле ${field} должно быть действительным электронным адресом.`,
  image: field => `Поле ${field} должно быть изображением.`,
  in: field => `Поле ${field} должно быть допустимым значением.`,
  max: (field, [length]) =>
    `Поле ${field} не может быть более ${length} символов.`,
  max_value: (field, [max]) => `Поле ${field} должно быть ${max} или менее.`,
  mimes: (field, [...args]) =>
    `Поле ${field} должно иметь действительный тип файла. (${args})`,
  min: (field, [length]) =>
    `Поле ${field} должно быть не менее ${length} символов.`,
  min_value: (field, [min]) => `Поле ${field} должно быть ${min} или больше.`,
  not_in: field => `Поле ${field} должно быть допустимым значением.`,
  numeric: field => `Поле ${field} должно быть числом.`,
  regex: field => `Поле ${field} имеет ошибочный формат.`,
  required: field => `Поле ${field} обязательно для заполнения.`,
  url: field => `Поле ${field} имеет ошибочный формат URL.`,
}
