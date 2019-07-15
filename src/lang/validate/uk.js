export default {
  after: (field, [target]) =>
    `В полі ${field} повинна бути дата після ${target} .`,
  alpha: field => `Поле ${field} може містити тільки букви.`,
  date_format: (field, [format]) =>
    `Поле ${field} має бути в форматі ${format} .`,
  decimal: (field, [decimals = '*'] = []) =>
    `Поле ${field} має бути числовим і може містити ${
      decimals === '*' ? '' : decimals
    } десяткових чісла.`,
  digits: (field, [length]) =>
    `Поле ${field} має бути числовим і точно містити ${length} ціфри.`,
  email: field => `Поле ${field} має бути дійсним електронним адресом.`,
  max: (field, [length]) =>
    `Поле ${field} не може бути більше ${length} сімволов.`,
  min: (field, [length]) =>
    `Поле ${field} має бути не менше ${length} сімволов.`,
  numeric: field => `Поле ${field} має бути чіслом.`,
  required: field => `Поле ${field} обов'язково для заполненія.`,

  ccard: field => `Поле ${field} має бути дійсним номером карти`,
}
