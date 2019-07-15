import { messages } from 'vee-validate/dist/locale/uk'

export default Object.assign({}, messages, {
  ccard: field => `Поле ${field} має бути дійсним номером карти`,
})
