import { messages } from 'vee-validate/dist/locale/ru'

export default Object.assign({}, messages, {
  ccard: field => `Поле ${field} должно быть действительным номером карты`,
})
