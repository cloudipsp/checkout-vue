export default {
  after: (field, [target]) =>
    `В поле ${field} должна быть дата после ${target}.`,
  alpha: field => `Поле ${field} может содержать только буквы.`,
  date_format: (field, [format]) =>
    `Поле ${field} должно быть в формате ${format}.`,
  decimal: (field, [decimals = '*'] = []) =>
    `Поле ${field} должно быть числовым и может содержать ${
      decimals === '*' ? '' : decimals
    } десятичных числа.`,
  digits: (field, [length]) =>
    `Поле ${field} должно быть числовым и точно содержать ${length} цифры.`,
  email: field =>
    `Поле ${field} должно быть действительным электронным адресом.`,
  max: (field, [length]) =>
    `Поле ${field} не может быть более ${length} символов.`,
  min: (field, [length]) =>
    `Поле ${field} должно быть не менее ${length} символов.`,
  numeric: field => `Поле ${field} должно быть числом.`,
  required: field => `Поле ${field} обязательно для заполнения.`,

  ccard: field => `Поле ${field} должно быть действительным номером карты`,
}
